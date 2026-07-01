import Link from "next/link";
import Image from "next/image";
import { MapPin, Wifi, Coffee, Car, Wind, Tv, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FrondDivider } from "@/components/ui/FrondDivider";
import { RoomCard } from "@/components/RoomCard";
import { getRooms } from "@/lib/rooms";

export default async function HomePage() {
  const featuredRooms = await getRooms(true);

  return (
    <main>
      <Navbar variant="hero" />

      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center text-center overflow-hidden">
        {/* Remplacer par une <video autoPlay muted loop> une fois l'asset vidéo disponible */}
        <Image
          src="/hero-jacmel.jpg"
          alt="Côte de Jacmel, Haïti"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-palm-deep/55 via-palm-deep/35 to-palm-deep/75" />
        <div className="relative z-10 px-6 max-w-3xl">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-5 text-sand">Jacmel · Haïti</p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight mb-6 text-linen">
            Un accueil tropical,
            <br />à fleur d&apos;océan
          </h1>
          <p className="text-base md:text-lg mb-10 max-w-xl mx-auto text-palm-soft">
            Chambres baignées de lumière, table créole et jardins en bord de mer —
            une parenthèse de calme au cœur de Jacmel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chambres"
              className="px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors w-full sm:w-auto"
            >
              Chambres
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 text-sm tracking-wide border border-linen text-linen rounded-sm hover:bg-linen hover:text-palm-deep transition-colors w-full sm:w-auto"
            >
              Services
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <div className="relative w-full h-[420px] rounded-sm overflow-hidden">
            <Image src="/images/jardin-piscine.jpg" alt="Jardin et piscine de l'hôtel" fill className="object-cover" />
          </div>
          <div className="hidden md:block absolute -bottom-10 -right-10 w-56 h-40 rounded-sm overflow-hidden border-4 border-linen">
            <Image src="/images/table-restaurant.jpg" alt="Table dressée au restaurant" fill className="object-cover" />
          </div>
        </div>
        <div>
          <Eyebrow>Notre maison</Eyebrow>
          <h2 className="font-display text-3xl md:text-4xl mb-6 text-palm-deep">
            Une halte chaleureuse, pensée comme une maison de famille
          </h2>
          <p className="leading-relaxed mb-6 text-ink/80">
            Niché entre les collines verdoyantes et la mer des Caraïbes, Bon Accueil réunit
            l&apos;hospitalité haïtienne et un confort raffiné. Chaque recoin de la propriété —
            des terrasses ombragées aux salons ouverts sur le jardin — porte la signature
            de l&apos;artisanat local de Jacmel.
          </p>
          <p className="leading-relaxed mb-8 text-ink/80">
            Notre équipe, enracinée dans la ville depuis trois générations, vous accueille
            comme on reçoit un proche : avec attention, simplicité et générosité.
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
            <h2 className="font-display text-3xl md:text-4xl text-palm-deep">Gastronomie créole &amp; art de vivre</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-sm overflow-hidden">
              <div className="relative w-full h-72">
                <Image src="/images/gastronomie.jpg" alt="Gastronomie créole" fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl mb-3 text-palm-deep">Gastronomie</h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  Une cuisine créole revisitée, produits du marché de Jacmel et fruits de mer
                  pêchés du jour, servis face à l&apos;océan.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-sm overflow-hidden">
              <div className="relative w-full h-72">
                <Image src="/images/activites.jpg" alt="Activités proposées par l'hôtel" fill className="object-cover" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl mb-3 text-palm-deep">Activités</h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  Excursions au Bassin Bleu, ateliers de papier mâché et tours du Carnaval —
                  l&apos;âme artisanale de Jacmel à portée de main.
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
            Réservez votre séjour à Jacmel
          </h2>
          <p className="mb-8 text-ink/80">
            Profitez d&apos;un accueil personnalisé, du petit-déjeuner créole à la table d&apos;hôte du soir.
          </p>
          <Link href="/chambres" className="inline-block px-8 py-3.5 text-sm tracking-wide bg-palm-deep text-linen rounded-sm hover:bg-palm transition-colors">
            Réserver maintenant
          </Link>
        </div>
      </section>

      {/* LOCALISATION */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>Nous trouver</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl mb-5 text-palm-deep">Au cœur de Jacmel</h2>
            <p className="mb-6 leading-relaxed text-ink/80">
              À deux pas du front de mer et des galeries d&apos;art de la ville, Bon Accueil est
              votre point de départ idéal pour explorer le Sud-Est d&apos;Haïti.
            </p>
            <div className="flex items-center gap-2 text-sm text-palm-deep">
              <MapPin size={16} /> Rue du Commerce, Jacmel, Haïti
            </div>
          </div>
          <div className="h-72 md:h-80 rounded-sm flex items-center justify-center bg-palm-soft">
            <div className="text-center">
              <MapPin size={28} className="text-palm-deep mx-auto mb-2" />
              <span className="text-sm text-palm-deep">Carte interactive (Google Maps)</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
