import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { RESERVATION_STATUSES } from "@/lib/admin/navigation";
import { notifyRoomReservationStatusChange } from "@/lib/notifications";
import { reservationReferenceFromId } from "@/lib/payment";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const { status } = await request.json();

  if (!RESERVATION_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const db = getAdminDb();

  const { data: existing, error: fetchError } = await db
    .from("reservations")
    .select(
      "id, status, email, user_id, first_name, last_name, check_in, check_out, nights, total_price, transaction_code, payment_method, rooms(title)",
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const { error } = await db.from("reservations").update({ status }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const roomTitle =
    existing.rooms && typeof existing.rooms === "object" && "title" in existing.rooms
      ? String(existing.rooms.title)
      : "Chambre";

  const transactionCode =
    existing.transaction_code ??
    (status === "confirmed" ? reservationReferenceFromId(existing.id) : null);

  if (status === "confirmed" && !existing.transaction_code && transactionCode) {
    await db.from("reservations").update({ transaction_code: transactionCode }).eq("id", id);
  }

  await notifyRoomReservationStatusChange({
    email: existing.email,
    userId: existing.user_id,
    status,
    previousStatus: existing.status,
    firstName: existing.first_name,
    roomTitle,
    checkIn: existing.check_in,
    checkOut: existing.check_out,
    nights: existing.nights,
    totalPrice: existing.total_price,
    transactionCode,
    paymentMethod: existing.payment_method,
    reservationId: existing.id,
  });

  return NextResponse.json({ success: true });
}
