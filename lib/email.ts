import { getContactPhone } from "@/lib/env";
import { getHotelAddressShort } from "@/lib/hotel";

type ConfirmationEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  transactionCode: string;
  paymentMethod?: "stripe" | "on_site";
};

type TableReservationEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  tableName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
};

type AdminNotificationParams = {
  subject: string;
  html: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Bon Accueil Hotel <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY absente — email non envoyé.");
    return { sent: false as const, error: "Service email non configuré." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error:", body);
      return { sent: false as const, error: body };
    }

    return { sent: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { sent: false as const, error: message };
  }
}

export async function sendReservationConfirmation(params: ConfirmationEmailParams) {
  const phone = getContactPhone();
  const onSite = params.paymentMethod === "on_site";
  const totalLabel = onSite ? "Total à régler sur place" : "Total payé";
  const paymentNote = onSite
    ? `<p style="color: #3F7259; font-size: 14px; margin-top: 16px;"><strong>Important :</strong> cette confirmation ne constitue pas un paiement en ligne. Le règlement s'effectue directement à l'hôtel, à votre arrivée ou selon les modalités convenues avec notre équipe.</p>`
    : "";

  const html = `
    <div style="font-family: Georgia, serif; color: #221F1A; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #1B3D2F; font-size: 24px;">Bon Accueil Hotel</h1>
      <p>Bonjour ${params.firstName} ${params.lastName},</p>
      <p>Votre réservation est confirmée. Merci de votre confiance !</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px 0; color: #3F7259;">Chambre</td><td><strong>${params.roomTitle}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Arrivée</td><td>${params.checkIn}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Départ</td><td>${params.checkOut}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Nuits</td><td>${params.nights}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">${totalLabel}</td><td><strong>${params.totalPrice} USD</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Référence</td><td>${params.transactionCode}</td></tr>
      </table>
      ${paymentNote}
      <p style="color: #666; font-size: 14px;">${getHotelAddressShort()} · ${phone}</p>
    </div>
  `;

  return sendEmail(params.to, `Confirmation de réservation — ${params.roomTitle}`, html);
}

type RequestReceivedEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  transactionCode: string;
};

/** Demande enregistrée — en attente de validation par l'hôtel */
export async function sendReservationRequestReceived(params: RequestReceivedEmailParams) {
  const phone = getContactPhone();
  const html = `
    <div style="font-family: Georgia, serif; color: #221F1A; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #1B3D2F; font-size: 24px;">Bon Accueil Hotel</h1>
      <p>Bonjour ${params.firstName} ${params.lastName},</p>
      <p>Nous avons bien reçu votre <strong>demande de réservation</strong>. Notre équipe va la valider sous peu.</p>
      <p style="color: #3F7259; font-size: 14px;">Aucun paiement en ligne n'a été effectué. Vous recevrez une notification dans votre espace client une fois la réservation confirmée par l'hôtel.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px 0; color: #3F7259;">Chambre</td><td><strong>${params.roomTitle}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Arrivée</td><td>${params.checkIn}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Départ</td><td>${params.checkOut}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Nuits</td><td>${params.nights}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Total indicatif</td><td><strong>${params.totalPrice} USD</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Référence</td><td>${params.transactionCode}</td></tr>
      </table>
      <p style="color: #666; font-size: 14px;">${getHotelAddressShort()} · ${phone}</p>
    </div>
  `;

  return sendEmail(params.to, `Demande de réservation reçue — ${params.roomTitle}`, html);
}

export async function sendTableReservationConfirmed(params: TableReservationEmailParams) {
  const phone = getContactPhone();
  const html = `
    <div style="font-family: Georgia, serif; color: #221F1A; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #1B3D2F; font-size: 24px;">Bon Accueil Hotel</h1>
      <p>Bonjour ${params.firstName} ${params.lastName},</p>
      <p>Votre réservation au restaurant est <strong>confirmée</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px 0; color: #3F7259;">Table</td><td><strong>${params.tableName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Date</td><td>${params.reservationDate}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Heure</td><td>${params.reservationTime}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Personnes</td><td>${params.partySize}</td></tr>
      </table>
      <p style="color: #666; font-size: 14px;">${getHotelAddressShort()} · ${phone}</p>
    </div>
  `;

  return sendEmail(params.to, `Table confirmée — ${params.tableName}`, html);
}

export async function sendTableReservationConfirmation(params: TableReservationEmailParams) {
  const phone = getContactPhone();
  const html = `
    <div style="font-family: Georgia, serif; color: #221F1A; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #1B3D2F; font-size: 24px;">Bon Accueil Hotel</h1>
      <p>Bonjour ${params.firstName} ${params.lastName},</p>
      <p>Nous avons bien reçu votre <strong>demande de réservation</strong> au restaurant. Notre équipe va la valider sous peu.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><td style="padding: 8px 0; color: #3F7259;">Table</td><td><strong>${params.tableName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Date</td><td>${params.reservationDate}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Heure</td><td>${params.reservationTime}</td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Personnes</td><td>${params.partySize}</td></tr>
      </table>
      <p>Vous recevrez une notification dans votre espace client dès confirmation par l'hôtel.</p>
      <p style="color: #666; font-size: 14px;">${getHotelAddressShort()} · ${phone}</p>
    </div>
  `;

  return sendEmail(params.to, `Demande de réservation — ${params.tableName}`, html);
}

export async function sendAdminNotification(params: AdminNotificationParams) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return { sent: false as const, error: "ADMIN_NOTIFICATION_EMAIL non configuré." };
  return sendEmail(adminEmail, params.subject, params.html);
}
