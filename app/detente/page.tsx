import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { GalleryFrame } from "@/components/GalleryFrame";
import { RoomDetailPanel } from "@/components/RoomDetailPanel";
import { getDetenteGalleries } from "@/lib/image-gallery.server";

export const metadata: Metadata = {
  title: "Détente — Bon Accueil Hotel",
  description:
    "Piscine, jardin et espace bien-être aux hauteurs de Jacmel — air frais et calme à la campagne.",
};

const POOL_SERVICES = [
  "Piscine chauffée",
  "Transats et parasols",
  "Serviettes de bain",
  "Bar de pool",
  "Massages sur demande",
  "Accès au jardin",
];

export default function DetentePage() {
  const detente = getDetenteGalleries();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Bien-être"
          title="Espace détente & piscine"
          description="Un havre de paix à la campagne — jardin ombragé, piscine et brise légère des hauteurs."
          slides={detente.hero}
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid lg:grid-cols-2 gap-14 items-start">
          <GalleryFrame
            slides={detente.piscine}
            className="relative w-full h-80 lg:h-[480px]"
            label="Piscine et jardin"
            priority
          />
          <div>
            <h2 className="font-display text-3xl text-palm-deep mb-6">Un jardin en hauteur</h2>
            <p className="leading-relaxed text-ink/80 mb-6">
              Notre espace détente s&apos;ouvre sur un jardin luxuriant perché au-dessus de Jacmel.
              La piscine, les transats et la vue dégagée sur la ville invitent à ralentir — dans
              un air frais et doux, loin du bruit du centre.
            </p>
            <p className="leading-relaxed text-ink/80 mb-8">
              Les hôtes de Bon Accueil profitent d&apos;un accès libre à la piscine et au jardin.
              Des soins spa et massages peuvent être organisés sur demande.
            </p>
            <RoomDetailPanel amenities={[]} services={POOL_SERVICES} />
            <Link
              href="/chambres"
              className="mt-8 inline-flex px-6 py-3 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors"
            >
              Réserver une chambre
            </Link>
          </div>
        </section>

        <section className="bg-sand py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10">
            <GalleryFrame slides={detente.spa} className="relative w-full h-64 md:h-72" label="Spa et bien-être" />
            <GalleryFrame slides={detente.jardin} className="relative w-full h-64 md:h-72" label="Jardin" />
          </div>
          <p className="text-sm text-ink/70 text-center mt-10 px-6">
            Horaires piscine : 7h – 20h · Accès réservé aux hôtes et sur réservation pour les visiteurs.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
