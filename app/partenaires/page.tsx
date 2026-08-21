import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { getContactEmail } from "@/lib/env";

export const metadata: Metadata = {
  title: "Partenaires — Bon Accueil Hotel",
};

export default function PartenairesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Collaborations"
          title="Nos partenaires"
          description="Artisans, guides et producteurs locaux qui enrichissent l'expérience Bon Accueil."
        />
        <section className="max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed text-ink/80 space-y-6">
          <p>
            Bon Accueil collabore avec des acteurs locaux de Jacmel : ateliers de papier mâché,
            pêcheurs du Sud-Est, guides du Bassin Bleu et producteurs du marché de la ville.
          </p>
          <p>
            Vous souhaitez devenir partenaire ? Contactez-nous à{" "}
            <a href={`mailto:${getContactEmail()}`} className="text-palm-deep hover:opacity-70">
              {getContactEmail()}
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
