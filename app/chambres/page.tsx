import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Chambres — Bon Accueil Hotel",
  description: "Découvrez nos chambres et suites à Jacmel : confort tropical, vue mer et hospitalité haïtienne.",
};

export default async function ChambresPage() {
  const rooms = await getRooms();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <section className="bg-palm-deep text-linen py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <Eyebrow inverted>Hébergement</Eyebrow>
            <h1 className="font-display text-4xl md:text-5xl mb-5">Nos chambres</h1>
            <p className="text-palm-soft max-w-2xl leading-relaxed">
              Chambres baignées de lumière, literie confortable et ambiance tropicale —
              choisissez l&apos;espace qui correspond à votre séjour à Jacmel.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          {rooms.length === 0 ? (
            <p className="text-center text-ink/60">Aucune chambre disponible pour le moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.slug} room={room} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-sand py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-palm-deep mb-4">
              Besoin d&apos;aide pour choisir ?
            </h2>
            <p className="text-sm text-ink/80 mb-6">
              Notre équipe est disponible pour vous conseiller selon la durée de votre séjour et vos préférences.
            </p>
            <Link
              href="/"
              className="inline-block text-sm tracking-wide text-palm-deep hover:opacity-70"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
