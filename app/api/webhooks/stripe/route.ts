import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, hasStripe } from "@/lib/stripe";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { notifyRoomReservationStatusChange } from "@/lib/notifications";

export async function POST(request: Request) {
  if (!hasStripe() || !hasAdminClient()) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] signature:", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutExpired(session);
    }
  } catch (err) {
    console.error("[webhook] handler error:", err);
    return NextResponse.json({ error: "Traitement échoué." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservation_id;
  if (!reservationId) {
    throw new Error("metadata.reservation_id manquant");
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("reservations")
    .select("status, email, user_id, first_name, last_name, check_in, check_out, nights, total_price, transaction_code, payment_method")
    .eq("id", reservationId)
    .maybeSingle();

  if (existing?.status === "confirmed") {
    return;
  }

  const transactionCode = session.payment_intent
    ? String(session.payment_intent)
    : session.id;

  const { data: reservation, error } = await admin
    .from("reservations")
    .update({
      status: "confirmed",
      transaction_code: transactionCode,
      payment_method: "stripe",
    })
    .eq("id", reservationId)
    .select("first_name, last_name, email, check_in, check_out, nights, total_price")
    .single();

  if (error || !reservation) {
    throw new Error(`Confirmation DB échouée: ${error?.message ?? "inconnue"}`);
  }

  const roomTitle = session.metadata?.room_title ?? "Chambre";

  await notifyRoomReservationStatusChange({
    email: reservation.email,
    userId: existing?.user_id,
    status: "confirmed",
    previousStatus: existing?.status ?? "pending",
    firstName: reservation.first_name,
    roomTitle,
    checkIn: reservation.check_in,
    checkOut: reservation.check_out,
    nights: reservation.nights,
    totalPrice: reservation.total_price,
    transactionCode,
    paymentMethod: "stripe",
    reservationId,
  });
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservation_id;
  if (!reservationId) return;

  const admin = createAdminClient();
  const { error } = await admin
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .eq("status", "pending");

  if (error) {
    throw new Error(`Annulation échouée: ${error.message}`);
  }
}
