import {
  HOTEL_PHONE_DISPLAY,
  HOTEL_PHONE_RAW,
} from "@/lib/hotel";

export function hasSupabasePublic(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getContactPhone(): string {
  return process.env.NEXT_PUBLIC_CONTACT_PHONE ?? HOTEL_PHONE_DISPLAY;
}

/** Numéro local sans indicatif (37471711) */
export function getContactPhoneRaw(): string {
  return HOTEL_PHONE_RAW;
}

export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@bonaccueil.ht";
}

/** Fallback statique en dev local (Supabase absent ou injoignable) */
export function allowStaticFallback(): boolean {
  return isDevelopment();
}
