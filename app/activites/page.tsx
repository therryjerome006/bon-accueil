import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EventOfferingCard } from "@/components/EventOfferingCard";
import { HotelServiceCard } from "@/components/HotelServiceCard";
import {
  HOTEL_EVENT_SERVICES,
  LEGACY_HOTEL_EXCURSIONS_NOTE,
  ORGANIZABLE_EVENTS,
} from "@/lib/group-events";
import { getContactEmail, getContactPhone } from "@/lib/env";
import { getHotelPhoneTel } from "@/lib/hotel";

export const metadata: Metadata = {
  title: "Événements & groupes — Bon Accueil Hotel",
  description:
    "Organisez fêtes, journées piscine, sorties scolaires ou excursions depuis Bon Accueil — services traiteur, piscine et salles disponibles.",
};

export default function ActivitesPage() {
  const phone = getContactPhone();
  const email = getContactEmail();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Groupes & événements"
          title="Organisez votre événement chez nous"
          description="Bon Accueil met ses espaces à votre disposition : vous planifiez votre journée, votre fête ou votre sortie — nous fournissons l'accueil, les lieux et les services sur mesure."
        />

        {/* Partie 1 — Ce que les visiteurs peuvent organiser */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="mb-12 max-w-2xl">
            <Eyebrow>À organiser par vos soins</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">
              Vos idées, nos espaces
            </h2>
            <p className="text-sm leading-relaxed text-ink/70">
              L&apos;hôtel n&apos;organise pas ces activités à votre place : vous les concevez et
              nous vous accueillons avec les infrastructures adaptées — jardins, piscine, salles
              et terrasses en hauteur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ORGANIZABLE_EVENTS.map((event) => (
              <EventOfferingCard key={event.slug} event={event} />
            ))}
          </div>
        </section>

        {/* Partie 2 — Services proposés par l'hôtel */}
        <section className="bg-sand py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="mb-12 max-w-2xl">
              <Eyebrow>Services de l&apos;hôtel</Eyebrow>
              <h2 className="font-display text-3xl md:text-4xl text-palm-deep mb-4">
                Ce que nous mettons à votre disposition
              </h2>
              <p className="text-sm leading-relaxed text-ink/70">
                Pour accompagner votre événement, notre équipe propose des prestations
                complémentaires — restauration, équipement piscine, coordination et plus encore.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {HOTEL_EVENT_SERVICES.map((service) => (
                <HotelServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA + note excursions */}
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-palm-deep mb-4">
            Demander un devis
          </h2>
          <p className="text-sm text-ink/80 mb-8 leading-relaxed">
            Indiquez la date, le nombre de personnes et les services souhaités — notre équipe
            vous répondra avec une proposition adaptée.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href={`tel:${getHotelPhoneTel()}`}
              className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors w-full sm:w-auto"
            >
              {phone}
            </a>
            <a
              href={`mailto:${email}?subject=Demande%20événement%20-%20Bon%20Accueil`}
              className="px-8 py-3.5 text-sm tracking-wide border border-palm-deep text-palm-deep rounded-sm hover:bg-sand/40 transition-colors w-full sm:w-auto"
            >
              {email}
            </a>
          </div>
          <p className="text-xs text-ink/50 leading-relaxed">{LEGACY_HOTEL_EXCURSIONS_NOTE}</p>
          <Link href="/evenements" className="inline-block mt-6 text-sm text-palm-deep hover:opacity-70">
            Voir aussi : mariages &amp; séminaires →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
