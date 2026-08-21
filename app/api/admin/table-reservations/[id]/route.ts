import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { RESERVATION_STATUSES } from "@/lib/admin/navigation";
import { notifyTableReservationStatusChange } from "@/lib/notifications";

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
    .from("table_reservations")
    .select(
      "id, status, email, user_id, first_name, last_name, reservation_date, reservation_time, party_size, restaurant_tables(name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }

  const { error } = await db.from("table_reservations").update({ status }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const tableName =
    existing.restaurant_tables &&
    typeof existing.restaurant_tables === "object" &&
    "name" in existing.restaurant_tables
      ? String(existing.restaurant_tables.name)
      : "Table";

  await notifyTableReservationStatusChange({
    email: existing.email,
    userId: existing.user_id,
    status,
    previousStatus: existing.status,
    firstName: existing.first_name,
    tableName,
    reservationDate: existing.reservation_date,
    reservationTime: existing.reservation_time,
    partySize: existing.party_size,
    reservationId: existing.id,
  });

  return NextResponse.json({ success: true });
}
