import { NextResponse } from "next/server";
import { getRoomBySlug, ensureRoomId, checkRoomAvailability } from "@/lib/rooms";
import {
  validateReservationForm,
  calculateNights,
  calculateTotal,
  formatDateFr,
  type ReservationFormData,
} from "@/lib/reservation";
import { getStripe, hasStripe } from "@/lib/stripe";
import {
  getPaymentMode,
  isStripeCheckoutEnabled,
  reservationReferenceFromId,
} from "@/lib/payment";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { getAppUrl } from "@/lib/env";
import { sendAdminNotification } from "@/lib/email";
import { getUser } from "@/lib/auth";
import { createNotificationForAccount, hasRegisteredAccount } from "@/lib/notifications";

type CheckoutBody = ReservationFormData & {
  roomSlug: string;
};

export async function POST(request: Request) {
  try {
    if (!hasAdminClient()) {
      return NextResponse.json(
        { error: "Base de données non configurée. Ajoutez SUPABASE_SERVICE_ROLE_KEY." },
        { status: 503 },
      );
    }

    if (getPaymentMode() === "stripe" && !hasStripe()) {
      return NextResponse.json(
        {
          error:
            "Le paiement en ligne par carte est temporairement indisponible. Contactez l'hôtel pour réserver.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as CheckoutBody;
    let { roomSlug, checkIn, checkOut, firstName, lastName, email, phone } = body;

    const user = await getUser();
    const userId = user?.id ?? null;
    if (user?.email) {
      email = user.email;
    }

    const room = await getRoomBySlug(roomSlug);
    if (!room) {
      return NextResponse.json({ error: "Chambre introuvable." }, { status: 404 });
    }

    const formData: ReservationFormData = { checkIn, checkOut, firstName, lastName, email, phone };
    const errors = validateReservationForm(formData, room.price);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: Object.values(errors)[0] }, { status: 400 });
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = calculateTotal(room.price, nights);

    const roomResult = await ensureRoomId(roomSlug);
    if ("error" in roomResult) {
      return NextResponse.json({ error: roomResult.error }, { status: 500 });
    }
    const roomId = roomResult.id;

    const availability = await checkRoomAvailability(roomId, checkIn, checkOut);
    if (!availability.available) {
      return NextResponse.json(
        {
          error: availability.error
            ? `Vérification de disponibilité impossible : ${availability.error}`
            : "Cette chambre n'est pas disponible pour les dates sélectionnées.",
        },
        { status: availability.error ? 503 : 409 },
      );
    }

    if (isStripeCheckoutEnabled()) {
      return createStripeCheckout({
        roomSlug,
        roomId,
        roomTitle: room.title,
        checkIn,
        checkOut,
        firstName,
        lastName,
        email,
        phone,
        nights,
        totalPrice,
        userId,
      });
    }

    return createOnSiteReservation({
      roomId,
      roomTitle: room.title,
      checkIn,
      checkOut,
      firstName,
      lastName,
      email,
      phone,
      nights,
      totalPrice,
      userId,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erreur serveur lors de la réservation." }, { status: 500 });
  }
}

type ReservationPayload = {
  roomId: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nights: number;
  totalPrice: number;
  userId: string | null;
};

async function createOnSiteReservation(payload: ReservationPayload) {
  const admin = createAdminClient();
  const normalizedEmail = payload.email.trim().toLowerCase();
  const hasAccount = await hasRegisteredAccount(payload.userId, normalizedEmail);

  const { data: reservation, error: insertError } = await admin
    .from("reservations")
    .insert({
      room_id: payload.roomId,
      check_in: payload.checkIn,
      check_out: payload.checkOut,
      first_name: payload.firstName.trim(),
      last_name: payload.lastName.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      total_price: payload.totalPrice,
      payment_method: "on_site",
      status: "pending",
      user_id: payload.userId,
    })
    .select("id")
    .single();

  if (insertError || !reservation) {
    console.error("[checkout] on-site insert:", insertError);
    const detail = insertError?.message ?? "Erreur inconnue";
    return NextResponse.json({ error: `Impossible de créer la réservation : ${detail}` }, { status: 500 });
  }

  const transactionCode = reservationReferenceFromId(reservation.id);

  await admin
    .from("reservations")
    .update({ transaction_code: transactionCode })
    .eq("id", reservation.id);

  if (hasAccount) {
    await createNotificationForAccount({
      email: normalizedEmail,
      userId: payload.userId,
      type: "reservation_pending",
      title: "Demande enregistrée",
      message: `Votre demande pour ${payload.roomTitle} (${formatDateFr(payload.checkIn)} → ${formatDateFr(payload.checkOut)}) est en attente de validation par l'hôtel. Consultez votre espace client pour le suivi.`,
      payload: {
        reservationId: reservation.id,
        reservationType: "room",
        roomTitle: payload.roomTitle,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        nights: payload.nights,
        totalPrice: payload.totalPrice,
        transactionCode,
        paymentMethod: "on_site",
      },
    });
  }

  const guestNote = hasAccount
    ? "Le client a un compte — il sera notifié sur le site après validation."
    : `<p><strong>Client invité (sans compte) :</strong> après validation, envoyer la confirmation manuellement par email depuis la messagerie de l'hôtel à ${normalizedEmail}.</p>`;

  await sendAdminNotification({
    subject: `[À confirmer] ${hasAccount ? "Compte" : "Invité"} — ${payload.roomTitle}`,
    html: `<p><strong>${payload.firstName.trim()} ${payload.lastName.trim()}</strong> (${normalizedEmail})</p>
      <p>${payload.roomTitle} · ${formatDateFr(payload.checkIn)} → ${formatDateFr(payload.checkOut)} · ${payload.nights} nuit(s)</p>
      <p>Total indicatif : ${payload.totalPrice} USD — paiement sur place</p>
      <p>Réf. ${transactionCode}</p>
      <p><strong>Action requise :</strong> valider la réservation dans l'admin.</p>
      ${guestNote}`,
  });

  const origin = getAppUrl();
  return NextResponse.json({
    confirmationUrl: `${origin}/reservation/confirmation?reservation_id=${reservation.id}`,
    hasAccount,
  });
}

async function createStripeCheckout(
  payload: ReservationPayload & { roomSlug: string },
) {
  const admin = createAdminClient();
  const normalizedEmail = payload.email.trim().toLowerCase();
  const { data: reservation, error: insertError } = await admin
    .from("reservations")
    .insert({
      room_id: payload.roomId,
      check_in: payload.checkIn,
      check_out: payload.checkOut,
      first_name: payload.firstName.trim(),
      last_name: payload.lastName.trim(),
      email: normalizedEmail,
      phone: payload.phone.trim(),
      total_price: payload.totalPrice,
      payment_method: "stripe",
      status: "pending",
      user_id: payload.userId,
    })
    .select("id")
    .single();

  if (insertError || !reservation) {
    console.error("[checkout] stripe insert:", insertError);
    const detail = insertError?.message ?? "Erreur inconnue";
    return NextResponse.json({ error: `Impossible de créer la réservation : ${detail}` }, { status: 500 });
  }

  const origin = getAppUrl();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: payload.email.trim().toLowerCase(),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(payload.totalPrice * 100),
          product_data: {
            name: `${payload.roomTitle} — ${payload.nights} nuit${payload.nights > 1 ? "s" : ""}`,
            description: `Arrivée ${payload.checkIn} · Départ ${payload.checkOut}`,
          },
        },
      },
    ],
    metadata: {
      reservation_id: reservation.id,
      room_slug: payload.roomSlug,
      room_title: payload.roomTitle,
      nights: String(payload.nights),
      total_price: String(payload.totalPrice),
    },
    success_url: `${origin}/reservation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/reservation/chambre?room=${payload.roomSlug}&cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
