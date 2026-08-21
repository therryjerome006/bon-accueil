/** Informations officielles et textes de présentation — Bon Accueil Hotel */

export const HOTEL_NAME = "Bon Accueil Hotel";
export const HOTEL_CITY = "Jacmel, Haïti";

export const HOTEL_ADDRESS =
  "7CPG+PQ3, Rte de L'amitié, Arrondissement de Jacmel 9110";

export const HOTEL_ADDRESS_SHORT = "Route de l'Amitié, Jacmel 9110";

export const HOTEL_PHONE_RAW = "37471711";
export const HOTEL_PHONE_DISPLAY = "+509 3747 1711";

export const HOTEL_TAGLINE =
  "Hôtel en hauteur à la campagne, vue dominante sur Jacmel — air frais et doux.";

export const HOTEL_DESCRIPTION =
  "Perché sur les hauteurs de Jacmel, Bon Accueil vous accueille à la campagne : air frais et doux, vue ouverte sur la ville, chambres confortables, table créole et jardins paisibles sur la Route de l'Amitié.";

export const HOTEL_SETTING =
  "À la campagne, en hauteur — loin de l'agitation du centre, avec une vue dominante sur Jacmel et les collines alentour.";

const DEFAULT_MAPS_QUERY = encodeURIComponent(
  "7CPG+PQ3, Route de l'Amitié, Jacmel, Haïti",
);

export function getHotelAddress(): string {
  return process.env.NEXT_PUBLIC_HOTEL_ADDRESS ?? HOTEL_ADDRESS;
}

export function getHotelAddressShort(): string {
  return process.env.NEXT_PUBLIC_HOTEL_ADDRESS_SHORT ?? HOTEL_ADDRESS_SHORT;
}

export function getHotelPhoneDisplay(): string {
  return process.env.NEXT_PUBLIC_CONTACT_PHONE ?? HOTEL_PHONE_DISPLAY;
}

export function getHotelPhoneTel(): string {
  const display = getHotelPhoneDisplay();
  const digits = display.replace(/\D/g, "");
  return digits.startsWith("509") ? `+${digits}` : `+509${HOTEL_PHONE_RAW}`;
}

export function getGoogleMapsEmbedUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    `https://maps.google.com/maps?q=${DEFAULT_MAPS_QUERY}&output=embed`
  );
}

export function getGoogleMapsLink(): string {
  return `https://www.google.com/maps/search/?api=1&query=${DEFAULT_MAPS_QUERY}`;
}
