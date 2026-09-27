import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Users, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { GalleryFrame } from "@/components/GalleryFrame";
import { getEvenementsGalleries } from "@/lib/image-gallery.server";

export const metadata: Metadata = {
  title: "Événements — Bon Accueil Hotel",
  description:
    "Mariages, séminaires et réceptions privées aux hauteurs de Jacmel — vue sur la ville et jardins à la campagne.",
};

export default function EvenementsPage() {
  const evenements = getEvenementsGalleries();

  const eventTypes = [
    { icon: Sparkles, title: "Mariages & célébrations", slides: evenements.mariage },
    { icon: Users, title: "Séminaires & retraites", slides: evenements.seminaire },
    { icon: Calendar, title: "Réceptions privées", slides: evenements.prive },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Événements"
          title="Vos moments, notre maison"
          description="Mariages, séminaires et réceptions aux hauteurs de Jacmel — jardins, vue ouverte et équipe dédiée."
          slides={evenements.reception}
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-10">
            {eventTypes.map(({ icon: Icon, title, slides }) => (
              <div key={title} className="bg-white rounded-sm overflow-hidden">
                <GalleryFrame slides={slides} variant="card" className="relative w-full h-48" label={title} />
                <div className="p-8">
                  <Icon size={24} className="text-palm mb-4" />
                  <h3 className="font-display text-xl text-palm-deep mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">
                    {title === "Mariages & célébrations" &&
                      "Une cérémonie intime avec vue sur Jacmel, un dîner de réception dans le jardin — nous orchestrons chaque détail."}
                    {title === "Séminaires & retraites" &&
                      "Salons modulables, calme des hauteurs et restauration sur place pour vos réunions d'équipe ou retraites bien-être."}
                    {title === "Réceptions privées" &&
                      "Anniversaires, dîners d'affaires ou soirées culturelles — nos espaces s'adaptent à vos envies, de 10 à 80 convives."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-palm-deep text-linen py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-2xl md:text-3xl mb-4">Organiser votre événement</h2>
            <p className="text-palm-soft mb-8">
              Contactez notre équipe pour un devis personnalisé : menu, décoration, hébergement des invités et activités.
            </p>
            <Link
              href="/restaurant"
              className="inline-flex px-8 py-3.5 text-sm tracking-wide bg-linen text-palm-deep rounded-sm hover:bg-sand transition-colors"
            >
              Découvrir nos espaces
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
