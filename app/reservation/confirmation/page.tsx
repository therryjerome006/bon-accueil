import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getStripe, hasStripe } from "@/lib/stripe";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { formatDateFr } from "@/lib/reservation";
import { isStripeCheckoutEnabled } from "@/lib/payment";

export const metadata: Metadata = {
  title: "Confirmation — Bon Accueil Hotel",
  description: "Votre demande de réservation.",
};

type PageProps = {
  searchParams: Promise<{ session_id?: string; reservation_id?: string }>;
};

type ConfirmationDetails = {
  firstName: string;
  lastName: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  transactionCode: string;
  email: string;
  paymentMethod: "stripe" | "on_site";
  status: string;
  hasAccount: boolean;
};

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { session_id: sessionId, reservation_id: reservationId } = await searchParams;

  const details = await loadConfirmationDetails(sessionId, reservationId);
  if (!details) {
    redirect("/chambres");
  }

  const isPending = details.status === "pending";
  const paidOnline = details.paymentMethod === "stripe" && !isPending;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          {isPending ? (
            <Clock3 size={48} className="text-amber-700 mx-auto mb-6" />
          ) : (
            <CheckCircle2 size={48} className="text-palm mx-auto mb-6" />
          )}
          <h1 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">
            {isPending ? "Demande enregistrée" : "Réservation confirmée"}
          </h1>
          <p className="text-ink/70 mb-8">
            Merci {details.firstName} !
            {isPending ? (
              <>
                {" "}
                Votre demande a bien été transmise à l&apos;hôtel.
                {details.hasAccount ? (
                  <>
                    {" "}
                    Une fois validée, vous recevrez une{" "}
                    <strong>notification dans votre espace client</strong> (pas par email).
                  </>
                ) : (
                  <>
                    {" "}
                    L&apos;hôtel vous enverra la réponse par <strong>email</strong>, depuis sa
                    propre messagerie — le site n&apos;envoie pas d&apos;email automatique.
                  </>
                )}
              </>
            ) : paidOnline ? (
              <>
                {" "}
                Votre paiement a été accepté. Retrouvez la confirmation dans votre{" "}
                <strong>espace client</strong>.
              </>
            ) : (
              <>
                {" "}
                Votre séjour est confirmé. Le règlement se fera sur place, à votre arrivée.
                Consultez votre <strong>boîte de notifications</strong> dans l&apos;espace client.
              </>
            )}
            {isPending && (
              <>
                {" "}
                Connectez-vous avec la même adresse email pour suivre votre demande dans{" "}
                <Link href="/compte" className="text-palm-deep hover:opacity-70">
                  Mon compte
                </Link>
                .
              </>
            )}
          </p>

          <div className="bg-white border border-palm-soft/50 rounded-sm p-6 text-left text-sm mb-8">
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Statut</span>
              <span className={isPending ? "text-amber-800 font-medium" : "text-palm font-medium"}>
                {isPending ? "En attente de confirmation" : "Confirmée"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Chambre</span>
              <span className="font-medium text-palm-deep">{details.roomTitle}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Arrivée</span>
              <span>{details.checkIn || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Départ</span>
              <span>{details.checkOut || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Nuits</span>
              <span>{details.nights}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">
                {isPending || !paidOnline ? "Total indicatif" : "Total payé"}
              </span>
              <span className="font-display text-lg text-palm-deep">{details.totalPrice} $</span>
            </div>
            <div className="flex justify-between py-2 border-b border-palm-soft/30">
              <span className="text-ink/60">Paiement</span>
              <span>
                {paidOnline ? "Carte bancaire (en ligne)" : "Sur place à l'hôtel (après confirmation)"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink/60">Référence</span>
              <span className="text-xs break-all">{details.transactionCode}</span>
            </div>
          </div>

          {isPending && !details.hasAccount && (
            <p className="text-xs text-ink/50 mb-8 leading-relaxed">
              Pensez à vérifier votre boîte mail (et les spams). Pour les prochaines réservations,{" "}
              <Link href="/login" className="text-palm-deep hover:opacity-70">
                créez un compte
              </Link>{" "}
              pour suivre tout sur le site.
            </p>
          )}

          {isPending && details.hasAccount && (
            <p className="text-xs text-ink/50 mb-8 leading-relaxed">
              Consultez{" "}
              <Link href="/compte" className="text-palm-deep hover:opacity-70">
                Mon compte
              </Link>{" "}
              ou attendez le bouton notifications en bas de page.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {details.hasAccount ? (
              <Link
                href="/compte"
                className="px-6 py-3 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
              >
                Mon espace client
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
              >
                Créer un compte
              </Link>
            )}
            <Link
              href="/"
              className="px-6 py-3 text-sm tracking-wide border border-palm-deep text-palm-deep rounded-sm hover:bg-sand/40 transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function loadConfirmationDetails(
  sessionId?: string,
  reservationId?: string,
): Promise<ConfirmationDetails | null> {
  if (sessionId && isStripeCheckoutEnabled()) {
    return loadFromStripeSession(sessionId);
  }

  if (reservationId && hasAdminClient()) {
    return loadFromReservationId(reservationId);
  }

  return null;
}

async function loadFromStripeSession(sessionId: string): Promise<ConfirmationDetails | null> {
  if (!hasStripe()) return null;

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return null;
  }

  const dbReservationId = session.metadata?.reservation_id;
  let details: ConfirmationDetails = {
    firstName: session.customer_details?.name?.split(" ")[0] ?? "",
    lastName: "",
    roomTitle: session.metadata?.room_title ?? "Chambre",
    checkIn: "",
    checkOut: "",
    nights: Number(session.metadata?.nights ?? 0),
    totalPrice: (session.amount_total ?? 0) / 100,
    transactionCode: String(session.payment_intent ?? session.id),
    email: session.customer_details?.email ?? session.customer_email ?? "",
    paymentMethod: "stripe",
    status: "confirmed",
    hasAccount: true,
  };

  if (dbReservationId && hasAdminClient()) {
    const admin = createAdminClient();
    const { data: reservation } = await admin
      .from("reservations")
      .select(
        "first_name, last_name, check_in, check_out, nights, total_price, transaction_code, email, payment_method, status, user_id",
      )
      .eq("id", dbReservationId)
      .maybeSingle();

    if (reservation) {
      details = {
        firstName: reservation.first_name,
        lastName: reservation.last_name,
        roomTitle: session.metadata?.room_title ?? "Chambre",
        checkIn: formatDateFr(reservation.check_in),
        checkOut: formatDateFr(reservation.check_out),
        nights: reservation.nights ?? details.nights,
        totalPrice: reservation.total_price ?? details.totalPrice,
        transactionCode: reservation.transaction_code ?? details.transactionCode,
        email: reservation.email,
        paymentMethod: reservation.payment_method === "on_site" ? "on_site" : "stripe",
        status: reservation.status,
        hasAccount: Boolean(reservation.user_id),
      };
    }
  }

  return details;
}

async function loadFromReservationId(reservationId: string): Promise<ConfirmationDetails | null> {
  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
      .select(
        "first_name, last_name, check_in, check_out, nights, total_price, transaction_code, email, payment_method, status, user_id, rooms(title)",
      )
    .eq("id", reservationId)
    .maybeSingle();

  if (!reservation || reservation.status === "rejected" || reservation.status === "cancelled") {
    return null;
  }

  const roomTitle =
    reservation.rooms && typeof reservation.rooms === "object" && "title" in reservation.rooms
      ? String(reservation.rooms.title)
      : "Chambre";

  return {
    firstName: reservation.first_name,
    lastName: reservation.last_name,
    roomTitle,
    checkIn: formatDateFr(reservation.check_in),
    checkOut: formatDateFr(reservation.check_out),
    nights: reservation.nights ?? 0,
    totalPrice: reservation.total_price ?? 0,
    transactionCode: reservation.transaction_code ?? reservationId,
    email: reservation.email,
    paymentMethod: reservation.payment_method === "stripe" ? "stripe" : "on_site",
    status: reservation.status,
    hasAccount: Boolean(reservation.user_id),
  };
}
