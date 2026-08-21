import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { RoomDetailPanel } from "@/components/RoomDetailPanel";
import { SITE_IMAGES } from "@/lib/site-images";

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
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Bien-être"
          title="Espace détente & piscine"
          description="Un havre de paix à la campagne — jardin ombragé, piscine et brise légère des hauteurs, loin de l'agitation de la ville."
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid lg:grid-cols-2 gap-14 items-start">
          <div className="relative w-full h-80 lg:h-[480px] rounded-sm overflow-hidden">
            <Image src={SITE_IMAGES.detente.piscine} alt="Jardin et piscine de l'hôtel" fill className="object-cover" priority />
          </div>
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
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="relative w-full h-64 rounded-sm overflow-hidden mb-8">
              <Image src={SITE_IMAGES.detente.spa} alt="Espace spa et bien-être" fill className="object-cover" />
            </div>
            <p className="text-sm text-ink/70">
              Horaires piscine : 7h – 20h · Accès réservé aux hôtes et sur réservation pour les visiteurs.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
