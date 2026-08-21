import type { Metadata } from "next";
import Image from "next/image";
import { SITE_IMAGES } from "@/lib/site-images";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { RestaurantTableCard } from "@/components/RestaurantTableCard";
import { getRestaurantTables, getTableKey } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Restaurant — Bon Accueil Hotel",
  description:
    "Gastronomie créole aux hauteurs de Jacmel. Réservez votre table au restaurant Bon Accueil, Route de l'Amitié.",
};

export default async function RestaurantPage() {
  const tables = await getRestaurantTables();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-linen">
        <PageHero
          eyebrow="Gastronomie"
          title="Notre restaurant"
          description="Cuisine créole authentique, produits du marché de Jacmel et recettes de maison — en salle ou en terrasse, avec la brise des hauteurs."
        />

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-2 gap-14 items-center">
          <div className="relative w-full h-80 md:h-[420px] rounded-sm overflow-hidden">
            <Image src={SITE_IMAGES.restaurant.hero} alt="Plats créoles au restaurant" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-palm-deep mb-6">Table créole, vue sur Jacmel</h2>
            <p className="leading-relaxed text-ink/80 mb-4">
              Notre chef compose chaque menu autour des produits locaux : légumes du marché,
              épices haïtiennes et recettes transmises de génération en génération.
            </p>
            <p className="leading-relaxed text-ink/80">
              Petit-déjeuner créole, déjeuner en terrasse ombragée ou dîner aux chandelles —
              chaque repas est une invitation à savourer Jacmel, depuis la campagne.
            </p>
          </div>
        </section>

        <section className="bg-sand py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <h2 className="font-display text-3xl text-palm-deep mb-4 text-center">Choisissez votre table</h2>
            <p className="text-sm text-ink/70 text-center mb-12 max-w-xl mx-auto">
              Tables en terrasse ou en salle, pour deux ou en groupe. Réservez directement en ligne.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {tables.map((table) => (
                <RestaurantTableCard key={getTableKey(table)} table={table} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
