import { getAdminDb } from "./db";
import type { Enums } from "@/types/database.types";

export type Period = "month" | "quarter" | "semester";
type ReservationStatus = Enums<"reservation_status">;

function periodStart(period: Period): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === "quarter") start.setMonth(start.getMonth() - 2);
  if (period === "semester") start.setMonth(start.getMonth() - 5);
  return start;
}

export async function getDashboardStats() {
  const db = getAdminDb();

  const [rooms, reservations, tableRes, activities, profiles, pendingRoom, pendingTable] =
    await Promise.all([
      db.from("rooms").select("id", { count: "exact", head: true }),
      db.from("reservations").select("id, status, total_price, created_at"),
      db.from("table_reservations").select("id, status, created_at"),
      db.from("activities").select("id", { count: "exact", head: true }),
      db.from("profiles").select("id", { count: "exact", head: true }),
      db.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("table_reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

  const allReservations = reservations.data ?? [];
  const confirmed = allReservations.filter((r) => r.status === "confirmed");
  const revenue = confirmed.reduce((sum, r) => sum + (r.total_price ?? 0), 0);

  return {
    roomCount: rooms.count ?? 0,
    activityCount: activities.count ?? 0,
    userCount: profiles.count ?? 0,
    pendingCount: (pendingRoom.count ?? 0) + (pendingTable.count ?? 0),
    confirmedReservations: confirmed.length,
    totalReservations: allReservations.length,
    tableReservations: (tableRes.data ?? []).length,
    revenue,
  };
}

export async function getStatsForPeriod(period: Period) {
  const db = getAdminDb();
  const start = periodStart(period);
  const startIso = start.toISOString();

  const [{ data: reservations }, { data: profiles }, { data: monthlyView }] = await Promise.all([
    db.from("reservations").select("*").gte("created_at", startIso).order("created_at", { ascending: false }),
    db.from("profiles").select("id, created_at").gte("created_at", startIso),
    db.from("reservation_stats_monthly").select("*"),
  ]);

  const rows = reservations ?? [];
  const confirmed = rows.filter((r) => r.status === "confirmed");
  const revenue = confirmed.reduce((sum, r) => sum + (r.total_price ?? 0), 0);
  const nights = confirmed.reduce((sum, r) => sum + (r.nights ?? 0), 0);

  const byStatus = {
    pending: rows.filter((r) => r.status === "pending").length,
    confirmed: confirmed.length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    cancelled: rows.filter((r) => r.status === "cancelled").length,
  };

  const byMonth = new Map<string, { count: number; revenue: number }>();
  for (const r of rows) {
    const key = r.created_at.slice(0, 7);
    const entry = byMonth.get(key) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    if (r.status === "confirmed") entry.revenue += r.total_price ?? 0;
    byMonth.set(key, entry);
  }

  return {
    period,
    periodLabel:
      period === "month" ? "30 derniers jours (mois courant)" : period === "quarter" ? "Trimestre" : "Semestre",
    totalReservations: rows.length,
    revenue,
    nightsBooked: nights,
    newUsers: (profiles ?? []).length,
    occupancyRate: rows.length > 0 ? Math.round((confirmed.length / rows.length) * 100) : 0,
    byStatus,
    byMonth: Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data })),
    monthlyView: monthlyView ?? [],
    ledger: confirmed.map((r) => ({
      id: r.id,
      date: r.created_at.slice(0, 10),
      guest: `${r.first_name} ${r.last_name}`,
      checkIn: r.check_in,
      checkOut: r.check_out,
      nights: r.nights,
      amount: r.total_price,
      transaction: r.transaction_code,
    })),
  };
}

export async function getAllReservations(statusFilter?: string) {
  const db = getAdminDb();

  let roomQuery = db
    .from("reservations")
    .select("*, rooms(title)")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") {
    const status = statusFilter as ReservationStatus;
    roomQuery = roomQuery.eq("status", status);
  }

  let tableQuery = db
    .from("table_reservations")
    .select("*, restaurant_tables(name)")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") {
    const status = statusFilter as ReservationStatus;
    tableQuery = tableQuery.eq("status", status);
  }

  const [{ data: roomRes }, { data: tableRes }] = await Promise.all([roomQuery, tableQuery]);

  return {
    rooms: (roomRes ?? []).map((r) => ({
      ...r,
      type: "room" as const,
      label: (r.rooms as { title?: string } | null)?.title ?? "Chambre",
    })),
    tables: (tableRes ?? []).map((r) => ({
      ...r,
      type: "table" as const,
      label: (r.restaurant_tables as { name?: string } | null)?.name ?? "Table",
    })),
  };
}
