import Link from "next/link";
import { MapPin, Wifi, Coffee, Car, Wind, Tv, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { GalleryFrame } from "@/components/GalleryFrame";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FrondDivider } from "@/components/ui/FrondDivider";
import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/rooms";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsLink,
  getHotelAddress,
  getHotelPhoneTel,
  HOTEL_CITY,
} from "@/lib/hotel";
import { getContactPhone } from "@/lib/env";
import { getAccueilGalleries, getHeroSlides } from "@/lib/image-gallery.server";
import { WhatsAppContactSection } from "@/components/WhatsAppContactSection";

export default async function HomePage() {
  const featuredRooms = await getRooms(true);
  const phone = getContactPhone();
  const heroSlides = getHeroSlides();
  const accueil = getAccueilGalleries();

  return (
    <main>
      <Navbar variant="hero" />

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center text-center overflow-hidden">
        <HeroCarousel slides={heroSlides} />
        <div className="absolute inset-0 bg-gradient-to-b from-palm-deep/55 via-palm-deep/35 to-palm-deep/75 z-[1]" />
        <div className="relative z-10 px-6 max-w-3xl">
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-2xl bg-black/35 blur-2xl"
            aria-hidden
          />
          <p className="font-hero text-sm md:text-base font-bold tracking-[0.28em] uppercase mb-5 text-white text-shadow-hero-sm">
            {HOTEL_CITY}
          </p>
          <h1 className="font-hero text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white text-shadow-hero">
            Un accueil chaleureux,
            <br />
            au-dessus de Jacmel
          </h1>
          <p className="text-base md:text-lg font-semibold mb-10 max-w-xl mx-auto text-linen text-shadow-hero-sm leading-relaxed">
            À la campagne, en hauteur — air frais et doux, vue dominante sur la ville.
            Chambres confortables, table créole et jardins paisibles sur la Route de l&apos;Amitié.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chambres"
              className="font-hero px-8 py-3.5 text-sm font-bold tracking-wide bg-white text-palm-deep rounded-sm hover:bg-linen transition-colors w-full sm:w-auto shadow-lg"
            >
              Chambres
            </Link>
            <Link
              href="/services"
              className="font-hero px-8 py-3.5 text-sm font-bold tracking-wide border-2 border-white text-white rounded-sm hover:bg-white hover:text-palm-deep transition-colors w-full sm:w-auto text-shadow-hero-sm"
            >
              Services
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <GalleryFrame
            slides={accueil.jardin}
            className="relative w-full h-[420px]"
            label="Jardin et piscine"
            priority
          />
          <div className="hidden md:block absolute -bottom-10 -right-10 w-56 h-40 rounded-sm overflow-hidden border-4 border-linen">
            <GalleryFrame
              slides={accueil.restaurant}
              variant="card"
              className="relative w-full h-full"
              label="Restaurant"
            />
          </div>
        </div>
        <div>
          <Eyebrow>Notre maison</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl mb-6 text-palm-deep">
            Une retraite à la campagne, les yeux sur Jacmel
          </h2>
          <p className="leading-relaxed mb-6 text-ink/80">
            Perché sur les hauteurs, Bon Accueil n&apos;est pas un hôtel au bord de la plage :
            c&apos;est une maison à la campagne où l&apos;air est frais et doux, où les terrasses
            dominent la ville et où le calme remplace l&apos;agitation du centre.
          </p>
          <p className="leading-relaxed mb-8 text-ink/80">
            L&apos;hospitalité haïtienne, le confort de chambres lumineuses, une cuisine créole
            généreuse et des jardins ombragés — le tout à quelques minutes de Jacmel, sur la
            Route de l&apos;Amitié.
          </p>
          <Link href="/a-propos" className="inline-flex items-center gap-2 text-sm tracking-wide text-palm-deep hover:opacity-70">
            Découvrir notre histoire <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* SPECIALITES */}
      <section className="bg-sand py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <Eyebrow centered>Nos spécialités</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-palm-deep">Gastronomie créole &amp; événements groupés</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-sm overflow-hidden">
              <GalleryFrame
                slides={accueil.gastronomie}
                className="relative w-full h-72"
                label="Gastronomie créole"
              />
              <div className="p-8">
                <h3 className="font-display text-2xl mb-3 text-palm-deep">Gastronomie</h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  Cuisine créole authentique, produits du marché de Jacmel et recettes de maison —
                  servie en salle ou en terrasse, avec la brise légère des hauteurs.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-sm overflow-hidden">
              <GalleryFrame
                slides={accueil.groupes}
                className="relative w-full h-72"
                label="Groupes et événements"
              />
              <div className="p-8">
                <h3 className="font-display text-2xl mb-3 text-palm-deep">Groupes &amp; événements</h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  Fêtes, journées piscine, sorties scolaires ou excursions — organisez votre
                  événement chez nous avec traiteur, équipement piscine et espaces dédiés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMBRES PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <Eyebrow>Hébergement</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-palm-deep">Nos chambres</h2>
          </div>
          <Link href="/chambres" className="inline-flex items-center gap-2 text-sm tracking-wide text-palm self-start md:self-auto hover:opacity-70">
            Voir plus <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </div>
      </section>

      {/* EQUIPEMENTS TEASER */}
      <section className="bg-palm-deep py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {[
            { icon: Wifi, label: "Internet" },
            { icon: Wind, label: "Climatisation" },
            { icon: Tv, label: "Télévision" },
            { icon: Coffee, label: "Service en chambre" },
            { icon: Car, label: "Parking gratuit" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <Icon size={22} className="text-sand" />
              <span className="text-xs tracking-wide text-palm-soft">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO */}
      <section className="py-28 bg-linen">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex justify-center">
            <FrondDivider />
          </div>
          <h2 className="font-display text-3xl md:text-4xl mt-6 mb-6 text-palm-deep">
            Réservez votre séjour aux hauteurs de Jacmel
          </h2>
          <p className="mb-8 text-ink/80">
            Air frais, vue ouverte sur la ville et accueil personnalisé — du petit-déjeuner créole
            au dîner à la table d&apos;hôte.
          </p>
          <Link href="/chambres" className="inline-block px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors">
            Réserver maintenant
          </Link>
        </div>
      </section>

      <WhatsAppContactSection />

      {/* LOCALISATION */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Nous trouver</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl mb-5 text-palm-deep">Sur les hauteurs de Jacmel</h2>
            <p className="mb-6 leading-relaxed text-ink/80">
              Situé à la campagne sur la Route de l&apos;Amitié, Bon Accueil offre une vue
              dominante sur Jacmel tout en restant proche du centre-ville. Idéal pour un séjour
              au calme, avec un accès facile aux galeries, marchés et plages du Sud-Est.
            </p>
            <div className="space-y-2 text-sm text-palm-deep">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <a href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  {getHotelAddress()}
                </a>
              </div>
              <a href={`tel:${getHotelPhoneTel()}`} className="block hover:opacity-70">
                {phone}
              </a>
            </div>
          </div>
          <iframe
            title="Localisation Bon Accueil Hotel"
            src={getGoogleMapsEmbedUrl()}
            className="w-full h-72 md:h-80 rounded-sm border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
