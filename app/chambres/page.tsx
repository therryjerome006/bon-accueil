import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/rooms";
import { getChambresGalleries } from "@/lib/image-gallery.server";

export const metadata: Metadata = {
  title: "Chambres — Bon Accueil Hotel",
  description:
    "Chambres et suites aux hauteurs de Jacmel : air frais, vue sur la ville et hospitalité haïtienne à la campagne.",
};

export default async function ChambresPage() {
  const rooms = await getRooms();
  const chambresHero = getChambresGalleries().hero;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Hébergement"
          title="Nos chambres"
          description="Chambres lumineuses, literie confortable et air frais des hauteurs — avec vue sur Jacmel, le jardin ou les collines."
          slides={chambresHero}
        />

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
