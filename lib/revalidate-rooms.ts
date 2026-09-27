import { revalidatePath, revalidateTag } from "next/cache";

export const ROOMS_LIST_CACHE_TAG = "rooms-list";

/** Invalide le catalogue chambres (liste, accueil, fiches) après changement admin. */
export function revalidateRoomsCatalog(slug?: string | null) {
  revalidateTag(ROOMS_LIST_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/chambres");
  if (slug?.trim()) {
    revalidatePath(`/chambres/${slug.trim()}`, "page");
  }
}
