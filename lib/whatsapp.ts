import { getHotelPhoneTel } from "@/lib/hotel";

/** Numéro international sans + (ex. 50937471711) pour wa.me */
export function getWhatsAppPhoneE164Digits(): string {
  return getHotelPhoneTel().replace(/\D/g, "");
}

export function getWhatsAppUrl(message?: string): string {
  const phone = getWhatsAppPhoneE164Digits();
  const base = `https://wa.me/${phone}`;
  const text = message?.trim();
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
