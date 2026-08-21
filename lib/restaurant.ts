import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database.types";
import { allowStaticFallback, hasSupabasePublic } from "@/lib/env";
import { SITE_IMAGES, restaurantTableImageForCapacity } from "@/lib/site-images";
import { firstImageUrl, normalizeImageUrl, parseImageUrls } from "@/lib/image-url";

export type RestaurantTable = {
  id?: string;
  slug: string;
  name: string;
  capacity: number;
  description: string;
  images: string[];
};

const STATIC_TABLES: RestaurantTable[] = [
  {
    slug: "table-2",
    name: "Table pour 2",
    capacity: 2,
    description: "Intime et avec vue dégagée sur Jacmel — idéale pour un dîner en couple au coucher du soleil.",
    images: [SITE_IMAGES.restaurant.table2],
  },
  {
    slug: "table-4",
    name: "Table pour 4",
    capacity: 4,
    description: "Au cœur de la terrasse ombragée, parfaite pour un déjeuner en famille ou entre amis.",
    images: [SITE_IMAGES.restaurant.table4],
  },
  {
    slug: "table-6",
    name: "Table pour 6",
    capacity: 6,
    description: "Grande table conviviale pour célébrer un moment spécial, avec vue sur le jardin et la ville.",
    images: [SITE_IMAGES.restaurant.table6],
  },
  {
    slug: "table-8",
    name: "Table pour 8",
    capacity: 8,
    description: "Espace privatif pour groupes et événements intimes, avec service dédié.",
    images: [SITE_IMAGES.restaurant.table8],
  },
];

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapDbTable(row: Tables<"restaurant_tables">): RestaurantTable {
  return {
    id: row.id,
    // UUID unique — évite les doublons quand plusieurs tables ont le même nom
    slug: row.id,
    name: row.name,
    capacity: row.capacity,
    description: row.description ?? "",
    images:
      row.images.length > 0
        ? row.images.map(normalizeImageUrl).filter(Boolean)
        : [restaurantTableImageForCapacity(row.capacity)],
  };
}

/** Clé React / identifiant stable (priorité à l'id Supabase) */
export function getTableKey(table: RestaurantTable): string {
  return table.id ?? table.slug;
}

export function getTableReservationParam(table: RestaurantTable): string {
  return table.id ?? table.slug;
}

export async function getRestaurantTables(): Promise<RestaurantTable[]> {
  if (!hasSupabasePublic()) {
    return allowStaticFallback() ? STATIC_TABLES : [];
  }

  const supabase = createPublicClient();
  if (!supabase) return allowStaticFallback() ? STATIC_TABLES : [];

  try {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("status", "available")
      .order("capacity", { ascending: true });

    if (error) {
      console.error("[restaurant] fetch:", error.message);
      return allowStaticFallback() ? STATIC_TABLES : [];
    }

    return (data ?? []).map(mapDbTable);
  } catch (err) {
    console.error("[restaurant] fetch:", err instanceof Error ? err.message : err);
    return allowStaticFallback() ? STATIC_TABLES : [];
  }
}

export async function getRestaurantTableBySlug(slugOrId: string): Promise<RestaurantTable | null> {
  const tables = await getRestaurantTables();

  const byId = tables.find((t) => t.id === slugOrId || t.slug === slugOrId);
  if (byId) return byId;

  // Anciens liens du type ?table=table-pour-2
  const legacyMatches = tables.filter((t) => slugFromName(t.name) === slugOrId);
  if (legacyMatches.length === 1) return legacyMatches[0];

  return null;
}

export function getTableImage(table: RestaurantTable): string {
  return firstImageUrl(table.images, SITE_IMAGES.restaurant.fallback);
}

export async function checkTableAvailability(
  tableId: string,
  reservationDate: string,
  reservationTime: string,
): Promise<boolean> {
  const { createAdminClient, hasAdminClient } = await import("@/lib/supabase/admin");
  if (!hasAdminClient()) return false;

  const admin = createAdminClient();
  const { data } = await admin
    .from("table_reservations")
    .select("id")
    .eq("table_id", tableId)
    .eq("reservation_date", reservationDate)
    .eq("reservation_time", reservationTime)
    .in("status", ["pending", "confirmed"])
    .limit(1);

  return !data?.length;
}

export async function ensureTableId(slug: string): Promise<{ id: string } | { error: string }> {
  const table = await getRestaurantTableBySlug(slug);
  if (!table) return { error: "Table introuvable." };

  if (table.id) return { id: table.id };

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY manquante." };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    const { data: all } = await admin.from("restaurant_tables").select("*").eq("status", "available");
    const match = all?.find((r) => slugFromName(r.name) === slug || r.id === slug);
    if (match?.id) return { id: match.id };

    const { data: inserted, error } = await admin
      .from("restaurant_tables")
      .insert({
        name: table.name,
        capacity: table.capacity,
        description: table.description,
        images: table.images,
        status: "available",
      })
      .select("id")
      .single();

    if (error) return { error: error.message };
    if (!inserted?.id) return { error: "Impossible d'enregistrer la table." };
    return { id: inserted.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
