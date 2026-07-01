import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, hasStripe } from "@/lib/stripe";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { sendReservationConfirmation } from "@/lib/email";
import { formatDateFr } from "@/lib/reservation";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutExpired(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservation_id;
  if (!reservationId) return;

  const transactionCode = session.payment_intent
    ? String(session.payment_intent)
    : session.id;

  const admin = createAdminClient();

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
    console.error("[webhook] confirm reservation:", error);
    return;
  }

  const roomTitle = session.metadata?.room_title ?? "Chambre";

  await sendReservationConfirmation({
    to: reservation.email,
    firstName: reservation.first_name,
    lastName: reservation.last_name,
    roomTitle,
    checkIn: formatDateFr(reservation.check_in),
    checkOut: formatDateFr(reservation.check_out),
    nights: reservation.nights ?? Number(session.metadata?.nights ?? 0),
    totalPrice: reservation.total_price ?? Number(session.metadata?.total_price ?? 0),
    transactionCode,
  });
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservation_id;
  if (!reservationId) return;

  const admin = createAdminClient();
  await admin
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .eq("status", "pending");
}
