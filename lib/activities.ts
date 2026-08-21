import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database.types";
import { allowStaticFallback, hasSupabasePublic } from "@/lib/env";

/** @deprecated Utiliser lib/group-events.ts pour la page publique. Conservé pour l'admin et réservations futures. */
export type Activity = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  price: number;
  description: string;
  images: string[];
};

const STATIC_ACTIVITIES: Activity[] = [];

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapDbActivity(row: Tables<"activities">): Activity {
  return {
    id: row.id,
    slug: slugFromTitle(row.title) || row.id,
    title: row.title,
    date: row.date,
    price: row.price,
    description: row.description ?? "",
    images: row.images.length > 0 ? row.images : ["/images/activites.jpg"],
  };
}

/** Anciennes activités organisées par l'hôtel — admin uniquement */
export async function getActivities(): Promise<Activity[]> {
  if (!hasSupabasePublic()) {
    return allowStaticFallback() ? STATIC_ACTIVITIES : [];
  }

  const supabase = createPublicClient();
  if (!supabase) return allowStaticFallback() ? STATIC_ACTIVITIES : [];

  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("[activities] fetch:", error.message);
      return allowStaticFallback() ? STATIC_ACTIVITIES : [];
    }

    return (data ?? []).map(mapDbActivity);
  } catch (err) {
    console.error("[activities] fetch:", err instanceof Error ? err.message : err);
    return allowStaticFallback() ? STATIC_ACTIVITIES : [];
  }
}

export function getActivityImage(activity: Activity): string {
  return activity.images[0] ?? "/images/activites.jpg";
}

export function formatActivityDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
}
