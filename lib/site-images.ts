/**
 * Plan des images — une photo distincte par emplacement.
 * Fichiers dans public/ (ex. public/images/accueil/jardin.jpg).
 */

export const SITE_IMAGES = {
  hero: "/images/hero-accueil.jpg",

  accueil: {
    jardin: "/images/accueil/jardin.jpg",
    restaurantApercu: "/images/accueil/restaurant.jpg",
    gastronomie: "/images/accueil/gastronomie.jpg",
    groupes: "/images/accueil/groupes.jpg",
  },

  chambres: {
    standard: "/images/chambres/standard.jpg",
    deluxe: "/images/chambres/deluxe.jpg",
    suite: "/images/chambres/suite.jpg",
    fallback: "/images/chambres/standard.jpg",
  },

  restaurant: {
    hero: "/images/restaurant/hero.jpg",
    table2: "/images/restaurant/table-2.jpg",
    table4: "/images/restaurant/table-4.jpg",
    table6: "/images/restaurant/table-6.jpg",
    table8: "/images/restaurant/table-8.jpg",
    fallback: "/images/restaurant/hero.jpg",
  },

  detente: {
    piscine: "/images/detente/piscine.jpg",
    spa: "/images/detente/spa.jpg",
  },

  groupes: {
    journee: "/images/groupes/journee.jpg",
    fete: "/images/groupes/fete.jpg",
    piscine: "/images/groupes/piscine.jpg",
    excursion: "/images/groupes/excursion.jpg",
    scolaire: "/images/groupes/scolaire.jpg",
  },

  evenements: {
    reception: "/images/evenements/reception.jpg",
  },

  aPropos: {
    maison: "/images/a-propos/maison.jpg",
  },

  services: {
    hebergement: "/images/chambres/deluxe.jpg",
    restaurant: "/images/restaurant/hero.jpg",
    detente: "/images/detente/piscine.jpg",
    groupes: "/images/groupes/journee.jpg",
  },
} as const;

/** Images par défaut des tables statiques (capacité → fichier) */
export const RESTAURANT_TABLE_IMAGES: Record<number, string> = {
  2: SITE_IMAGES.restaurant.table2,
  4: SITE_IMAGES.restaurant.table4,
  6: SITE_IMAGES.restaurant.table6,
  8: SITE_IMAGES.restaurant.table8,
};

export function restaurantTableImageForCapacity(capacity: number): string {
  return RESTAURANT_TABLE_IMAGES[capacity] ?? SITE_IMAGES.restaurant.fallback;
}
