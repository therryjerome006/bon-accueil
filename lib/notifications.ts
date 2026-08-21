import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateFr } from "@/lib/reservation";

export type NotificationType =
  | "reservation_pending"
  | "reservation_confirmed"
  | "reservation_rejected"
  | "reservation_cancelled"
  | "table_pending"
  | "table_confirmed"
  | "table_rejected"
  | "table_cancelled";

export type NotificationPayload = {
  reservationId?: string;
  reservationType?: "room" | "table";
  roomTitle?: string;
  tableName?: string;
  checkIn?: string;
  checkOut?: string;
  reservationDate?: string;
  reservationTime?: string;
  partySize?: number;
  nights?: number;
  totalPrice?: number;
  transactionCode?: string;
  paymentMethod?: string;
};

type CreateNotificationInput = {
  email: string;
  userId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  payload?: NotificationPayload;
};

export async function resolveUserIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  return data?.id ?? null;
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const admin = createAdminClient();
  const userId = input.userId ?? (await resolveUserIdByEmail(input.email));

  const { error } = await admin.from("notifications").insert({
    user_id: userId,
    email: input.email.trim().toLowerCase(),
    type: input.type,
    title: input.title,
    message: input.message,
    payload: input.payload ?? {},
  });

  if (error) {
    console.error("[notifications] insert:", error.message);
  }
}

export async function hasRegisteredAccount(
  userId?: string | null,
  email?: string,
): Promise<boolean> {
  if (userId) return true;
  if (!email?.trim()) return false;
  return Boolean(await resolveUserIdByEmail(email));
}

/** Notification in-app uniquement si le client a un compte sur le site. */
export async function createNotificationForAccount(
  input: CreateNotificationInput,
): Promise<boolean> {
  const ok = await hasRegisteredAccount(input.userId, input.email);
  if (!ok) return false;
  await createNotification(input);
  return true;
}

export async function notifyRoomReservationStatusChange(params: {
  email: string;
  userId?: string | null;
  status: string;
  previousStatus: string;
  firstName: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number | null;
  totalPrice: number | null;
  transactionCode: string | null;
  paymentMethod: string;
  reservationId: string;
}): Promise<void> {
  if (params.status === params.previousStatus) return;

  if (params.status === "confirmed") {
    const paymentNote =
      params.paymentMethod === "stripe"
        ? "Paiement en ligne enregistré."
        : "Paiement à effectuer sur place à votre arrivée.";

    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "reservation_confirmed",
      title: "Réservation confirmée",
      message: `Bonne nouvelle ! Votre séjour en ${params.roomTitle} est confirmé (${formatDateFr(params.checkIn)} → ${formatDateFr(params.checkOut)}). Retrouvez tous les détails dans votre espace client. ${paymentNote}`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "room",
        roomTitle: params.roomTitle,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nights: params.nights ?? undefined,
        totalPrice: params.totalPrice ?? undefined,
        transactionCode: params.transactionCode ?? undefined,
        paymentMethod: params.paymentMethod,
      },
    });
    return;
  }

  if (params.status === "rejected") {
    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "reservation_rejected",
      title: "Réservation non retenue",
      message: `Votre demande pour ${params.roomTitle} (${formatDateFr(params.checkIn)} → ${formatDateFr(params.checkOut)}) n'a pas pu être acceptée. Contactez l'hôtel pour une autre date.`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "room",
        roomTitle: params.roomTitle,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
      },
    });
    return;
  }

  if (params.status === "cancelled") {
    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "reservation_cancelled",
      title: "Réservation annulée",
      message: `Votre réservation ${params.roomTitle} (${formatDateFr(params.checkIn)} → ${formatDateFr(params.checkOut)}) a été annulée.`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "room",
        roomTitle: params.roomTitle,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
      },
    });
  }
}

export async function notifyTableReservationStatusChange(params: {
  email: string;
  userId?: string | null;
  status: string;
  previousStatus: string;
  firstName: string;
  tableName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  reservationId: string;
}): Promise<void> {
  if (params.status === params.previousStatus) return;

  if (params.status === "confirmed") {
    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "table_confirmed",
      title: "Table confirmée",
      message: `Votre table « ${params.tableName} » est confirmée le ${formatDateFr(params.reservationDate)} à ${params.reservationTime} (${params.partySize} pers.). Consultez votre espace client pour les détails.`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "table",
        tableName: params.tableName,
        reservationDate: params.reservationDate,
        reservationTime: params.reservationTime,
        partySize: params.partySize,
      },
    });
    return;
  }

  if (params.status === "rejected") {
    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "table_rejected",
      title: "Réservation table non retenue",
      message: `Votre demande pour ${params.tableName} le ${formatDateFr(params.reservationDate)} à ${params.reservationTime} n'a pas pu être acceptée.`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "table",
        tableName: params.tableName,
        reservationDate: params.reservationDate,
        reservationTime: params.reservationTime,
        partySize: params.partySize,
      },
    });
    return;
  }

  if (params.status === "cancelled") {
    await createNotificationForAccount({
      email: params.email,
      userId: params.userId,
      type: "table_cancelled",
      title: "Réservation table annulée",
      message: `Votre réservation ${params.tableName} le ${formatDateFr(params.reservationDate)} a été annulée.`,
      payload: {
        reservationId: params.reservationId,
        reservationType: "table",
        tableName: params.tableName,
        reservationDate: params.reservationDate,
        reservationTime: params.reservationTime,
        partySize: params.partySize,
      },
    });
  }
}
