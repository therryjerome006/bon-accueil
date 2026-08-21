import { SITE_IMAGES } from "@/lib/site-images";

export type OrganizableEvent = {
  slug: string;
  title: string;
  description: string;
  image: string;
  highlights?: string[];
};

export type HotelEventService = {
  slug: string;
  title: string;
  description: string;
  icon: "catering" | "pool" | "room" | "restaurant" | "coordination";
};

export const ORGANIZABLE_EVENTS: OrganizableEvent[] = [
  {
    slug: "journee-groupe",
    title: "Journée en groupe",
    description:
      "Réunissez famille, amis ou collègues pour une journée conviviale dans nos jardins, terrasses et espaces communs — au calme des hauteurs, avec vue sur Jacmel.",
    image: SITE_IMAGES.groupes.journee,
    highlights: ["Groupes privés", "Espaces extérieurs", "Sur réservation"],
  },
  {
    slug: "fetes-celebrations",
    title: "Fêtes & célébrations",
    description:
      "Anniversaires, baptêmes, réceptions ou soirées thématiques : privatisez une partie de l'hôtel et composez votre événement à votre image.",
    image: SITE_IMAGES.groupes.fete,
    highlights: ["Décoration possible", "Musique sur demande", "Capacité modulable"],
  },
  {
    slug: "journee-piscine",
    title: "Journée piscine",
    description:
      "Profitez de la piscine et du jardin en groupe — idéal pour un afterwork, un club sportif ou une journée détente entre proches.",
    image: SITE_IMAGES.groupes.piscine,
    highlights: ["Accès piscine", "Transats & parasols", "Restauration optionnelle"],
  },
  {
    slug: "excursions-base",
    title: "Excursions (base de départ)",
    description:
      "Utilisez Bon Accueil comme point de rendez-vous et base logistique avant ou après vos excursions dans la région — stationnement, repas et pause au frais.",
    image: SITE_IMAGES.groupes.excursion,
    highlights: ["Parking", "Petit-déjeuner tôt", "Consigne bagages"],
  },
  {
    slug: "sorties-scolaires",
    title: "Sorties scolaires",
    description:
      "Accueil d'établissements scolaires et centres de loisirs : espaces sécurisés, restauration adaptée et encadrement possible sur demande.",
    image: SITE_IMAGES.groupes.scolaire,
    highlights: ["Groupes jeunes", "Menus adaptés", "Espaces dédiés"],
  },
];

export const HOTEL_EVENT_SERVICES: HotelEventService[] = [
  {
    slug: "traiteur",
    title: "Service traiteur",
    description:
      "Menus créoles, buffets froids ou chauds, collations et boissons — préparés par notre cuisine selon le nombre de convives et votre budget.",
    icon: "catering",
  },
  {
    slug: "equipement-piscine",
    title: "Équipement piscine",
    description:
      "Mise à disposition de transats, parasols, serviettes et aménagement de l'espace pool pour votre groupe.",
    icon: "pool",
  },
  {
    slug: "salles-terrasses",
    title: "Salles & terrasses",
    description:
      "Salons modulables et terrasses ombragées avec vue sur Jacmel — pour réunions, repas groupés ou moments de détente.",
    icon: "room",
  },
  {
    slug: "restauration-groupe",
    title: "Restauration sur mesure",
    description:
      "Petit-déjeuner, déjeuner ou dîner groupé : formules à la carte, menus fixes ou buffets selon votre programme.",
    icon: "restaurant",
  },
  {
    slug: "coordination",
    title: "Accueil & coordination",
    description:
      "Un interlocuteur dédié pour planifier les horaires, les accès, la logistique et les services complémentaires de votre événement.",
    icon: "coordination",
  },
];

/** @deprecated Ancien modèle « excursions organisées par l'hôtel » — page publique utilise ORGANIZABLE_EVENTS */
export const LEGACY_HOTEL_EXCURSIONS_NOTE =
  "Les excursions touristiques (Bassin Bleu, etc.) ne sont plus proposées directement par l'hôtel. Contactez l'accueil pour des recommandations locales.";
