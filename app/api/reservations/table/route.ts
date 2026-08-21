import { NextResponse } from "next/server";
import { ensureTableId, getRestaurantTableBySlug, checkTableAvailability } from "@/lib/restaurant";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { sendAdminNotification } from "@/lib/email";
import { getUser } from "@/lib/auth";
import { formatDateFr } from "@/lib/reservation";
import { createNotificationForAccount, hasRegisteredAccount } from "@/lib/notifications";

type TableReservationBody = {
  tableSlug: string;
  reservationDate: string;
  reservationTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partySize: number;
};

export async function POST(request: Request) {
  try {
    if (!hasAdminClient()) {
      return NextResponse.json({ error: "Base de données non configurée." }, { status: 503 });
    }

    const body = (await request.json()) as TableReservationBody;
    let { tableSlug, reservationDate, reservationTime, firstName, lastName, email, phone, partySize } = body;

    const user = await getUser();
    const userId = user?.id ?? null;
    if (user?.email) {
      email = user.email;
    }

    const table = await getRestaurantTableBySlug(tableSlug);
    if (!table) {
      return NextResponse.json({ error: "Table introuvable." }, { status: 404 });
    }

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    if (!reservationDate || !reservationTime) {
      return NextResponse.json({ error: "Date et heure requises." }, { status: 400 });
    }

    if (partySize < 1 || partySize > table.capacity) {
      return NextResponse.json(
        { error: `Cette table accueille maximum ${table.capacity} personnes.` },
        { status: 400 },
      );
    }

    const tableResult = await ensureTableId(tableSlug);
    if ("error" in tableResult) {
      return NextResponse.json({ error: tableResult.error }, { status: 500 });
    }

    const available = await checkTableAvailability(tableResult.id, reservationDate, reservationTime);
    if (!available) {
      return NextResponse.json(
        { error: "Ce créneau n'est plus disponible. Choisissez une autre date ou heure." },
        { status: 409 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hasAccount = await hasRegisteredAccount(userId, normalizedEmail);

    const admin = createAdminClient();
    const { data: inserted, error: insertError } = await admin
      .from("table_reservations")
      .insert({
        table_id: tableResult.id,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        party_size: partySize,
        status: "pending",
        user_id: userId,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("[table reservation]", insertError);
      return NextResponse.json(
        { error: `Impossible d'enregistrer : ${insertError?.message ?? "Erreur inconnue"}` },
        { status: 500 },
      );
    }

    if (hasAccount) {
      await createNotificationForAccount({
        email: normalizedEmail,
        userId,
        type: "table_pending",
        title: "Demande de table enregistrée",
        message: `Votre demande pour ${table.name} le ${formatDateFr(reservationDate)} à ${reservationTime} est en attente de validation. Suivez-la dans votre espace client.`,
        payload: {
          reservationId: inserted.id,
          reservationType: "table",
          tableName: table.name,
          reservationDate,
          reservationTime,
          partySize,
        },
      });
    }

    const guestNote = hasAccount
      ? "Le client a un compte — notification sur le site après validation."
      : `Client invité : envoyer la confirmation manuellement par email hôtel à ${normalizedEmail}.`;

    await sendAdminNotification({
      subject: `[À confirmer] ${hasAccount ? "Compte" : "Invité"} — ${table.name}`,
      html: `<p>${firstName} ${lastName} (${normalizedEmail}) — ${formatDateFr(reservationDate)} à ${reservationTime}, ${partySize} pers.</p><p><strong>Action requise :</strong> valider dans l'admin.</p><p>${guestNote}</p>`,
    });

    return NextResponse.json({ success: true, hasAccount });
  } catch (err) {
    console.error("[table reservation]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
