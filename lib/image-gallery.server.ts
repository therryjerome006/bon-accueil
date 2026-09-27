import "server-only";

import fs from "fs";
import path from "path";
import { firstImage, imageUrls, urlsToSlides, type ImageSlide } from "@/lib/image-gallery.shared";

export type { ImageSlide, HeroSlide } from "@/lib/image-gallery.shared";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const galleryCache = new Map<string, ImageSlide[]>();

function altFromFilename(filename: string, prefix: string): string {
  const base = path
    .basename(filename, path.extname(filename))
    .replace(/[-_]+/g, " ")
    .trim();
  if (base.length < 2) return prefix;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function publicUrl(relativeDir: string, filename: string): string {
  const segments = relativeDir.split("/").filter(Boolean);
  // Chemin non pré-encodé : Next/Image encode une seule fois (évite %2520 → 404).
  return `/images/${[...segments, filename].join("/")}`;
}

export function listImageFiles(relativeDir: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "images", ...relativeDir.split("/"));
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

export function galleryFromFolder(relativeDir: string, altPrefix: string): ImageSlide[] {
  const cacheKey = `${relativeDir}::${altPrefix}`;
  if (process.env.NODE_ENV === "production" && galleryCache.has(cacheKey)) {
    return galleryCache.get(cacheKey)!;
  }

  const slides = listImageFiles(relativeDir).map((file) => ({
    src: publicUrl(relativeDir, file),
    alt: altFromFilename(file, altPrefix),
  }));

  if (process.env.NODE_ENV === "production") {
    galleryCache.set(cacheKey, slides);
  }

  return slides;
}

export const IMAGE_DIRS = {
  hero: "hero",
  accueil: {
    jardin: "accueil/jardin",
    restaurant: "accueil/restaurant",
    gastronomie: "accueil/gastronomie",
    groupes: "accueil/groupes",
  },
  chambres: {
    hero: "chambres/hero",
    standard: "chambres/standard",
    deluxe: "chambres/deluxe",
    suite: "chambres/suite",
  },
  restaurant: {
    hero: "restaurant/hero",
    salle: "restaurant/salle",
    plats: "restaurant/plats",
    table2: "restaurant/table-2",
    table4: "restaurant/table-4",
    table6: "restaurant/table-6",
    table8: "restaurant/table-8",
  },
  detente: {
    hero: "detente/hero",
    piscine: "detente/piscine",
    spa: "detente/spa",
    jardin: "detente/jardin",
  },
  groupes: {
    hero: "groupes/hero",
    journee: "groupes/journee",
    fete: "groupes/fete",
    piscine: "groupes/piscine",
    excursion: "groupes/excursion",
    scolaire: "groupes/scolaire",
  },
  evenements: {
    reception: "evenements/reception",
    mariage: "evenements/mariage",
    seminaire: "evenements/seminaire",
    prive: "evenements/prive",
  },
  aPropos: {
    hero: "a-propos/hero",
    maison: "a-propos/maison",
    equipe: "a-propos/equipe",
  },
  services: {
    hebergement: "services/hebergement",
    restaurant: "services/restaurant",
    detente: "services/detente",
    groupes: "services/groupes",
  },
} as const;

export function getHeroSlides(): ImageSlide[] {
  return galleryFromFolder(IMAGE_DIRS.hero, "Bon Accueil Hotel");
}

export function getAccueilGalleries() {
  return {
    jardin: galleryFromFolder(IMAGE_DIRS.accueil.jardin, "Jardin"),
    restaurant: galleryFromFolder(IMAGE_DIRS.accueil.restaurant, "Restaurant"),
    gastronomie: galleryFromFolder(IMAGE_DIRS.accueil.gastronomie, "Gastronomie"),
    groupes: galleryFromFolder(IMAGE_DIRS.accueil.groupes, "Groupes et événements"),
  };
}

export function getChambresGalleries() {
  return {
    hero: galleryFromFolder(IMAGE_DIRS.chambres.hero, "Chambres"),
    standard: galleryFromFolder(IMAGE_DIRS.chambres.standard, "Chambre Standard"),
    deluxe: galleryFromFolder(IMAGE_DIRS.chambres.deluxe, "Chambre Deluxe"),
    suite: galleryFromFolder(IMAGE_DIRS.chambres.suite, "Suite Bon Accueil"),
  };
}

export function getRestaurantGalleries() {
  return {
    hero: galleryFromFolder(IMAGE_DIRS.restaurant.hero, "Restaurant"),
    salle: galleryFromFolder(IMAGE_DIRS.restaurant.salle, "Salle du restaurant"),
    plats: galleryFromFolder(IMAGE_DIRS.restaurant.plats, "Plats créoles"),
    table2: galleryFromFolder(IMAGE_DIRS.restaurant.table2, "Table pour 2"),
    table4: galleryFromFolder(IMAGE_DIRS.restaurant.table4, "Table pour 4"),
    table6: galleryFromFolder(IMAGE_DIRS.restaurant.table6, "Table pour 6"),
    table8: galleryFromFolder(IMAGE_DIRS.restaurant.table8, "Table pour 8"),
  };
}

export function getDetenteGalleries() {
  return {
    hero: galleryFromFolder(IMAGE_DIRS.detente.hero, "Détente"),
    piscine: galleryFromFolder(IMAGE_DIRS.detente.piscine, "Piscine"),
    spa: galleryFromFolder(IMAGE_DIRS.detente.spa, "Spa"),
    jardin: galleryFromFolder(IMAGE_DIRS.detente.jardin, "Jardin"),
  };
}

export function getGroupesGalleries() {
  return {
    hero: galleryFromFolder(IMAGE_DIRS.groupes.hero, "Groupes"),
    journee: galleryFromFolder(IMAGE_DIRS.groupes.journee, "Journée en groupe"),
    fete: galleryFromFolder(IMAGE_DIRS.groupes.fete, "Fête"),
    piscine: galleryFromFolder(IMAGE_DIRS.groupes.piscine, "Journée piscine"),
    excursion: galleryFromFolder(IMAGE_DIRS.groupes.excursion, "Excursion"),
    scolaire: galleryFromFolder(IMAGE_DIRS.groupes.scolaire, "Sortie scolaire"),
  };
}

export function getEvenementsGalleries() {
  return {
    reception: galleryFromFolder(IMAGE_DIRS.evenements.reception, "Réception"),
    mariage: galleryFromFolder(IMAGE_DIRS.evenements.mariage, "Mariage"),
    seminaire: galleryFromFolder(IMAGE_DIRS.evenements.seminaire, "Séminaire"),
    prive: galleryFromFolder(IMAGE_DIRS.evenements.prive, "Réception privée"),
  };
}

export function getAProposGalleries() {
  return {
    hero: galleryFromFolder(IMAGE_DIRS.aPropos.hero, "Bon Accueil Hotel"),
    maison: galleryFromFolder(IMAGE_DIRS.aPropos.maison, "Notre maison"),
    equipe: galleryFromFolder(IMAGE_DIRS.aPropos.equipe, "Notre équipe"),
  };
}

export function getServicesGalleries() {
  return {
    hebergement: galleryFromFolder(IMAGE_DIRS.services.hebergement, "Hébergement"),
    restaurant: galleryFromFolder(IMAGE_DIRS.services.restaurant, "Restaurant"),
    detente: galleryFromFolder(IMAGE_DIRS.services.detente, "Détente"),
    groupes: galleryFromFolder(IMAGE_DIRS.services.groupes, "Groupes"),
  };
}

export function restaurantTableGalleryForCapacity(capacity: number): ImageSlide[] {
  const r = getRestaurantGalleries();
  const map: Record<number, ImageSlide[]> = {
    2: r.table2,
    4: r.table4,
    6: r.table6,
    8: r.table8,
  };
  return map[capacity]?.length ? map[capacity] : r.hero;
}

export function restaurantTableImageForCapacity(capacity: number): string {
  return firstImage(restaurantTableGalleryForCapacity(capacity));
}

export function chambreGalleryForSlug(slug: string): ImageSlide[] {
  const c = getChambresGalleries();
  if (slug.includes("deluxe")) return c.deluxe;
  if (slug.includes("suite")) return c.suite;
  return c.standard;
}

export function getSiteImages() {
  const accueil = getAccueilGalleries();
  const chambres = getChambresGalleries();
  const restaurant = getRestaurantGalleries();
  const detente = getDetenteGalleries();
  const groupes = getGroupesGalleries();
  const evenements = getEvenementsGalleries();
  const aPropos = getAProposGalleries();
  const services = getServicesGalleries();

  return {
    hero: firstImage(getHeroSlides()),
    accueil: {
      jardin: firstImage(accueil.jardin),
      restaurantApercu: firstImage(accueil.restaurant),
      gastronomie: firstImage(accueil.gastronomie),
      groupes: firstImage(accueil.groupes),
    },
    chambres: {
      standard: firstImage(chambres.standard),
      deluxe: firstImage(chambres.deluxe),
      suite: firstImage(chambres.suite),
      fallback: firstImage(chambres.standard),
    },
    restaurant: {
      hero: firstImage(restaurant.hero),
      table2: firstImage(restaurant.table2),
      table4: firstImage(restaurant.table4),
      table6: firstImage(restaurant.table6),
      table8: firstImage(restaurant.table8),
      fallback: firstImage(restaurant.hero),
    },
    detente: {
      piscine: firstImage(detente.piscine),
      spa: firstImage(detente.spa),
    },
    groupes: {
      journee: firstImage(groupes.journee),
      fete: firstImage(groupes.fete),
      piscine: firstImage(groupes.piscine),
      excursion: firstImage(groupes.excursion),
      scolaire: firstImage(groupes.scolaire),
    },
    evenements: {
      reception: firstImage(evenements.reception),
    },
    aPropos: {
      maison: firstImage(aPropos.maison),
    },
    services: {
      hebergement: firstImage(services.hebergement),
      restaurant: firstImage(services.restaurant),
      detente: firstImage(services.detente),
      groupes: firstImage(services.groupes),
    },
  };
}

export { firstImage, imageUrls, urlsToSlides };
