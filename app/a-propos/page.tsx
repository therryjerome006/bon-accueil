import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { GalleryFrame } from "@/components/GalleryFrame";
import { HOTEL_DESCRIPTION } from "@/lib/hotel";
import { getAProposGalleries } from "@/lib/image-gallery.server";

export const metadata: Metadata = {
  title: "À propos — Bon Accueil Hotel",
  description: HOTEL_DESCRIPTION,
};

export default function AProposPage() {
  const aPropos = getAProposGalleries();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Notre histoire"
          title="Bon Accueil, une maison sur les hauteurs"
          description="À la campagne, face à Jacmel — l'hospitalité haïtienne dans un cadre aéré et paisible."
          slides={aPropos.hero}
        />
        <section className="max-w-3xl mx-auto px-6 py-16 leading-relaxed text-ink/80 space-y-6">
          <GalleryFrame
            slides={aPropos.maison}
            className="relative w-full h-64 md:h-80 mb-8"
            label="Bon Accueil Hotel"
            priority
          />
          <p>
            Bon Accueil est un hôtel perché en hauteur, à la campagne, sur la Route de l&apos;Amitié.
            Loin du bruit du centre, on y respire un air frais et doux ; depuis les terrasses et
            les chambres, la vue s&apos;étend largement sur Jacmel et les collines environnantes.
          </p>
          <p>
            Ce n&apos;est pas un établissement au bord de la plage : c&apos;est une retraite
            verdoyante où l&apos;on retrouve le confort, la table créole et la chaleur d&apos;un
            accueil familial. Une base idéale pour explorer la ville, le Bassin Bleu et
            l&apos;artisanat jacmélien, tout en profitant du calme des hauteurs.
          </p>
          <p>
            Notre équipe vous reçoit comme un proche : avec attention, simplicité et générosité —
            pour que chaque séjour laisse le souvenir d&apos;un Jacmel authentique, vu d&apos;en haut.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
