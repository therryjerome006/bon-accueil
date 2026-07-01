import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getStripe, hasStripe } from "@/lib/stripe";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { formatDateFr } from "@/lib/reservation";

export const metadata: Metadata = {
  title: "Confirmation — Bon Accueil Hotel",
  description: "Votre réservation est confirmée.",
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId || !hasStripe()) {
    redirect("/chambres");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    redirect("/chambres");
  }

  const reservationId = session.metadata?.reservation_id;
  let details = {
    firstName: session.customer_details?.name?.split(" ")[0] ?? "",
    lastName: "",
    roomTitle: session.metadata?.room_title ?? "Chambre",
    checkIn: "",
    checkOut: "",
    nights: Number(session.metadata?.nights ?? 0),
    totalPrice: (session.amount_total ?? 0) / 100,
    transactionCode: String(session.payment_intent ?? session.id),
    email: session.customer_details?.email ?? session.customer_email ?? "",
  };

  if (reservationId && hasAdminClient()) {
    const admin = createAdminClient();
    const { data: reservation } = await admin
      .from("reservations")
      .select("first_name, last_name, check_in, check_out, nights, total_price, transaction_code, email")
      .eq("id", reservationId)
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
      };
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <CheckCircle2 size={48} className="text-palm mx-auto mb-6" />
          <h1 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">
            Réservation confirmée
          </h1>
          <p className="text-ink/70 mb-8">
            Merci {details.firstName} ! Un email de confirmation a été envoyé à{" "}
            <strong>{details.email}</strong>.
          </p>

          <div className="bg-white border border-palm-soft/50 rounded-sm p-6 text-left text-sm mb-8">
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
              <span className="text-ink/60">Total payé</span>
              <span className="font-display text-lg text-palm-deep">{details.totalPrice} $</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink/60">Référence</span>
              <span className="text-xs break-all">{details.transactionCode}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/chambres"
              className="px-6 py-3 text-sm tracking-wide border border-palm-deep text-palm-deep rounded-sm hover:bg-sand/40 transition-colors"
            >
              Voir les chambres
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
