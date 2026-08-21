import { createClient } from "@/lib/supabase/server";
import { formatDateFr } from "@/lib/reservation";
import type { NotificationPayload } from "@/lib/notifications";
import type { Tables } from "@/types/database.types";

export type ClientNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  payload: NotificationPayload;
  readAt: string | null;
  createdAt: string;
};

export type ClientRoomReservation = {
  id: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number | null;
  totalPrice: number | null;
  status: string;
  paymentMethod: string;
  transactionCode: string | null;
  createdAt: string;
};

export type ClientTableReservation = {
  id: string;
  tableName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  status: string;
  createdAt: string;
};

export type ClientDashboardData = {
  notifications: ClientNotification[];
  unreadCount: number;
  roomReservations: ClientRoomReservation[];
  tableReservations: ClientTableReservation[];
};

export async function getClientDashboard(userId: string, email: string): Promise<ClientDashboardData> {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  const [notificationsRes, roomsRes, tablesRes] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, type, title, message, payload, read_at, created_at")
      .or(`user_id.eq.${userId},email.eq.${normalizedEmail}`)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reservations")
      .select(
        "id, check_in, check_out, nights, total_price, status, payment_method, transaction_code, created_at, rooms(title)",
      )
      .or(`user_id.eq.${userId},email.eq.${normalizedEmail}`)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("table_reservations")
      .select(
        "id, reservation_date, reservation_time, party_size, status, created_at, restaurant_tables(name)",
      )
      .or(`user_id.eq.${userId},email.eq.${normalizedEmail}`)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const notifications: ClientNotification[] = (notificationsRes.data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    payload: (row.payload ?? {}) as NotificationPayload,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const roomReservations: ClientRoomReservation[] = (roomsRes.data ?? []).map((row) => {
    const room = row.rooms as { title?: string } | null;
    return {
      id: row.id,
      roomTitle: room?.title ?? "Chambre",
      checkIn: formatDateFr(row.check_in),
      checkOut: formatDateFr(row.check_out),
      nights: row.nights,
      totalPrice: row.total_price,
      status: row.status,
      paymentMethod: row.payment_method,
      transactionCode: row.transaction_code,
      createdAt: row.created_at,
    };
  });

  const tableReservations: ClientTableReservation[] = (tablesRes.data ?? []).map((row) => {
    const table = row.restaurant_tables as { name?: string } | null;
    return {
      id: row.id,
      tableName: table?.name ?? "Table",
      reservationDate: formatDateFr(row.reservation_date),
      reservationTime: row.reservation_time,
      partySize: row.party_size,
      status: row.status,
      createdAt: row.created_at,
    };
  });

  return { notifications, unreadCount, roomReservations, tableReservations };
}

export async function getUnreadNotificationCount(userId: string, email: string): Promise<number> {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .or(`user_id.eq.${userId},email.eq.${normalizedEmail}`)
    .is("read_at", null);

  if (error) {
    console.error("[account] unread count:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function markAllNotificationsRead(userId: string, email: string): Promise<void> {
  const supabase = await createClient();
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: now })
    .or(`user_id.eq.${userId},email.eq.${normalizedEmail}`)
    .is("read_at", null);

  if (error) {
    console.error("[account] mark read:", error.message);
  }
}

export function reservationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "En attente de confirmation",
    confirmed: "Confirmée",
    rejected: "Refusée",
    cancelled: "Annulée",
  };
  return labels[status] ?? status;
}

export type NotificationRow = Tables<"notifications">;
