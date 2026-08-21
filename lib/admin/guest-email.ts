import { formatDateFr } from "@/lib/reservation";

export type GuestEmailDraft = {
  to: string;
  subject: string;
  body: string;
};

type RoomGuestEmailParams = {
  email: string;
  firstName: string;
  lastName: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  transactionCode?: string | null;
  totalPrice?: number | null;
  status: "confirmed" | "rejected" | "cancelled";
};

type TableGuestEmailParams = {
  email: string;
  firstName: string;
  lastName: string;
  tableName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  status: "confirmed" | "rejected" | "cancelled";
};

export function buildGuestRoomEmailDraft(params: RoomGuestEmailParams): GuestEmailDraft | null {
  const { status } = params;

  if (status === "confirmed") {
    const ref = params.transactionCode ? `\nRéférence : ${params.transactionCode}` : "";
    const total =
      params.totalPrice != null ? `\nTotal indicatif : ${params.totalPrice} USD (règlement sur place)` : "";
    return {
      to: params.email,
      subject: `Confirmation de réservation — ${params.roomTitle}`,
      body: `Bonjour ${params.firstName} ${params.lastName},

Nous avons le plaisir de confirmer votre réservation à Bon Accueil Hotel.

Chambre : ${params.roomTitle}
Arrivée : ${formatDateFr(params.checkIn)}
Départ : ${formatDateFr(params.checkOut)}${total}${ref}

Le paiement s'effectue sur place à votre arrivée.

Au plaisir de vous accueillir,
Bon Accueil Hotel`,
    };
  }

  if (status === "rejected") {
    return {
      to: params.email,
      subject: `Votre demande de réservation — Bon Accueil Hotel`,
      body: `Bonjour ${params.firstName} ${params.lastName},

Nous vous remercions pour votre intérêt pour Bon Accueil Hotel.

Malheureusement, nous ne sommes pas en mesure de confirmer votre demande pour ${params.roomTitle} (${formatDateFr(params.checkIn)} → ${formatDateFr(params.checkOut)}).

N'hésitez pas à nous contacter pour d'autres dates.

Cordialement,
Bon Accueil Hotel`,
    };
  }

  return {
    to: params.email,
    subject: `Annulation de réservation — Bon Accueil Hotel`,
    body: `Bonjour ${params.firstName} ${params.lastName},

Nous vous informons que votre réservation pour ${params.roomTitle} (${formatDateFr(params.checkIn)} → ${formatDateFr(params.checkOut)}) a été annulée.

Cordialement,
Bon Accueil Hotel`,
  };
}

export function buildGuestTableEmailDraft(params: TableGuestEmailParams): GuestEmailDraft | null {
  const { status } = params;

  if (status === "confirmed") {
    return {
      to: params.email,
      subject: `Confirmation table — ${params.tableName}`,
      body: `Bonjour ${params.firstName} ${params.lastName},

Votre table au restaurant Bon Accueil est confirmée.

Table : ${params.tableName}
Date : ${formatDateFr(params.reservationDate)}
Heure : ${params.reservationTime}
Personnes : ${params.partySize}

Au plaisir de vous recevoir,
Bon Accueil Hotel`,
    };
  }

  if (status === "rejected") {
    return {
      to: params.email,
      subject: `Votre demande de table — Bon Accueil Hotel`,
      body: `Bonjour ${params.firstName} ${params.lastName},

Nous ne sommes pas en mesure de confirmer votre demande pour ${params.tableName} le ${formatDateFr(params.reservationDate)} à ${params.reservationTime}.

Contactez-nous pour un autre créneau.

Cordialement,
Bon Accueil Hotel`,
    };
  }

  return {
    to: params.email,
    subject: `Annulation table — Bon Accueil Hotel`,
    body: `Bonjour ${params.firstName} ${params.lastName},

Votre réservation pour ${params.tableName} le ${formatDateFr(params.reservationDate)} a été annulée.

Cordialement,
Bon Accueil Hotel`,
  };
}

/** Ouvre l'application mail par défaut (Outlook, Mail Windows, etc.) */
export function mailtoLink(draft: GuestEmailDraft): string {
  return `mailto:${encodeURIComponent(draft.to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
}

/**
 * Ouvre Gmail dans le navigateur (compte Gmail connecté dans le navigateur).
 * L'expéditeur sera le compte Gmail actuellement connecté — idéalement l'email de l'hôtel.
 */
export function gmailComposeLink(draft: GuestEmailDraft): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: draft.to,
    su: draft.subject,
    body: draft.body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function guestRoomMailtoLink(params: RoomGuestEmailParams): string | null {
  const draft = buildGuestRoomEmailDraft(params);
  return draft ? mailtoLink(draft) : null;
}

export function guestTableMailtoLink(params: TableGuestEmailParams): string | null {
  const draft = buildGuestTableEmailDraft(params);
  return draft ? mailtoLink(draft) : null;
}

export function guestStatusLabel(hasAccount: boolean): string {
  return hasAccount ? "Compte client" : "Invité (email hôtel)";
}
