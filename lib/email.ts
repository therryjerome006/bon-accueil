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
};

export async function sendReservationConfirmation(
  params: ConfirmationEmailParams,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Bon Accueil Hotel <reservations@bonaccueil.ht>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY absente — email de confirmation non envoyé.");
    return { sent: false, error: "Service email non configuré." };
  }

  const subject = `Confirmation de réservation — ${params.roomTitle}`;
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
        <tr><td style="padding: 8px 0; color: #3F7259;">Total payé</td><td><strong>${params.totalPrice} USD</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #3F7259;">Référence</td><td>${params.transactionCode}</td></tr>
      </table>
      <p style="color: #666; font-size: 14px;">Rue du Commerce, Jacmel, Haïti · +509 00 00 0000</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: body };
    }

    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
