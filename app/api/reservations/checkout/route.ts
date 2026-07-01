import { NextResponse } from "next/server";
import { getRoomBySlug, ensureRoomId, checkRoomAvailability } from "@/lib/rooms";
import {
  validateReservationForm,
  calculateNights,
  calculateTotal,
  type ReservationFormData,
} from "@/lib/reservation";
import { getStripe, hasStripe } from "@/lib/stripe";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";

type CheckoutBody = ReservationFormData & {
  roomSlug: string;
};

export async function POST(request: Request) {
  try {
    if (!hasStripe()) {
      return NextResponse.json(
        { error: "Paiement non configuré. Ajoutez STRIPE_SECRET_KEY dans .env.local." },
        { status: 503 },
      );
    }

    if (!hasAdminClient()) {
      return NextResponse.json(
        { error: "Base de données non configurée. Ajoutez SUPABASE_SERVICE_ROLE_KEY." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as CheckoutBody;
    const { roomSlug, checkIn, checkOut, firstName, lastName, email, phone } = body;

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

    const roomId = await ensureRoomId(roomSlug);
    if (!roomId) {
      return NextResponse.json(
        { error: "Impossible d'enregistrer la chambre. Vérifiez la configuration Supabase." },
        { status: 500 },
      );
    }

    const available = await checkRoomAvailability(roomId, checkIn, checkOut);
    if (!available) {
      return NextResponse.json(
        { error: "Cette chambre n'est pas disponible pour les dates sélectionnées." },
        { status: 409 },
      );
    }

    const admin = createAdminClient();
    const { data: reservation, error: insertError } = await admin
      .from("reservations")
      .insert({
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        nights,
        total_price: totalPrice,
        payment_method: "stripe",
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !reservation) {
      console.error("[checkout] insert reservation:", insertError);
      return NextResponse.json({ error: "Impossible de créer la réservation." }, { status: 500 });
    }

    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim().toLowerCase(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(totalPrice * 100),
            product_data: {
              name: `${room.title} — ${nights} nuit${nights > 1 ? "s" : ""}`,
              description: `Arrivée ${checkIn} · Départ ${checkOut}`,
            },
          },
        },
      ],
      metadata: {
        reservation_id: reservation.id,
        room_slug: roomSlug,
        room_title: room.title,
        nights: String(nights),
        total_price: String(totalPrice),
      },
      success_url: `${origin}/reservation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reservation/chambre?room=${roomSlug}&cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Erreur serveur lors de la création du paiement." }, { status: 500 });
  }
}
