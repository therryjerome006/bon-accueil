/** Normalise et valide les URLs d'images (locales ou publiques) */

export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

/** URL absolue http(s) — nécessite <img> natif (hors optimisation Next/Image) */
export function isExternalImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Chemin local servi depuis /public, ex. /images/photo.jpg */
export function isLocalImageUrl(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

export function parseImageUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => normalizeImageUrl(String(v))).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map(normalizeImageUrl)
      .filter(Boolean);
  }
  return [];
}

export function firstImageUrl(urls: string[] | undefined, fallback: string): string {
  const first = urls?.map(normalizeImageUrl).find(Boolean);
  return first ?? fallback;
}
