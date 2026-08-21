import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Bed, UtensilsCrossed, Trees, Compass, Wifi, Car, Coffee, Wind } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Services — Bon Accueil Hotel",
  description:
    "Hébergement, restaurant, détente et activités aux hauteurs de Jacmel — Bon Accueil Hotel, Route de l'Amitié.",
};

const MAIN_SERVICES = [
  {
    icon: Bed,
    title: "Hébergement",
    description: "Chambres Standard, Deluxe et Suite — climatisation, Wi-Fi, vue jardin ou sur Jacmel.",
    href: "/chambres",
    image: SITE_IMAGES.services.hebergement,
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurant",
    description: "Cuisine créole, produits locaux et tables en terrasse avec vue dégagée sur la ville.",
    href: "/restaurant",
    image: SITE_IMAGES.services.restaurant,
  },
  {
    icon: Trees,
    title: "Détente & piscine",
    description: "Piscine, jardin en hauteur, transats et soins spa sur demande — air frais garanti.",
    href: "/detente",
    image: SITE_IMAGES.services.detente,
  },
  {
    icon: Compass,
    title: "Groupes & événements",
    description:
      "Fêtes, journées piscine, sorties scolaires — organisez votre événement à l'hôtel avec nos services traiteur et piscine.",
    href: "/activites",
    image: SITE_IMAGES.services.groupes,
  },
];

const AMENITIES = [
  { icon: Wifi, label: "Internet gratuit" },
  { icon: Wind, label: "Climatisation" },
  { icon: Coffee, label: "Service en chambre" },
  { icon: Car, label: "Parking gratuit" },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Bon Accueil"
          title="Nos services"
          description="De l'hébergement à la table, de la piscine aux excursions — tout pour un séjour complet aux hauteurs de Jacmel."
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10">
            {MAIN_SERVICES.map(({ icon: Icon, title, description, href, image }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-sm overflow-hidden bg-white transition-transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative w-full h-52">
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>
                <div className="p-7">
                  <Icon size={22} className="text-palm mb-3" />
                  <h3 className="font-display text-xl text-palm-deep mb-2 group-hover:opacity-80">{title}</h3>
                  <p className="text-sm text-ink/70">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-palm-deep py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-display text-2xl text-linen text-center mb-10">Équipements inclus</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {AMENITIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3">
                  <Icon size={22} className="text-sand" />
                  <span className="text-xs tracking-wide text-palm-soft">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
