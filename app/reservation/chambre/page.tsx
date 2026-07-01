import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ReservationForm } from "@/components/ReservationForm";
import { getRoomBySlug } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Réservation chambre — Bon Accueil Hotel",
  description: "Réservez votre chambre à l'Hôtel Bon Accueil, Jacmel.",
};

type PageProps = {
  searchParams: Promise<{ room?: string; cancelled?: string }>;
};

export default async function ReservationChambrePage({ searchParams }: PageProps) {
  const { room: roomSlug, cancelled } = await searchParams;

  if (!roomSlug) {
    redirect("/chambres");
  }

  const room = await getRoomBySlug(roomSlug);
  if (!room) {
    redirect("/chambres");
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <section className="bg-palm-deep text-linen py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Eyebrow inverted>Réservation</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl mb-3">Réserver une chambre</h1>
            <p className="text-palm-soft max-w-xl">
              Renseignez vos dates et coordonnées. Le tarif total est calculé automatiquement.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          {cancelled === "1" && (
            <p className="mb-8 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
              Paiement annulé. Vous pouvez modifier vos informations et réessayer.
            </p>
          )}

          <ReservationForm room={room} />

          <div className="mt-10">
            <Link href={`/chambres/${room.slug}`} className="text-sm text-palm-deep hover:opacity-70">
              ← Retour aux détails de la chambre
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
