import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tables } from "@/types/database.types";
import { allowStaticFallback, hasSupabasePublic } from "@/lib/env";
import { normalizeImageUrl } from "@/lib/image-url";
import {
  chambreGalleryForSlug,
  getChambresGalleries,
  imageUrls,
} from "@/lib/image-gallery.server";
import type { Room } from "@/lib/rooms.types";

export type { Room } from "@/lib/rooms.types";
export { AMENITY_LABELS, SERVICE_LABELS } from "@/lib/rooms.constants";

async function buildStaticRooms(): Promise<Room[]> {
  const g = getChambresGalleries();

  return [
  {
    slug: "chambre-standard",
    title: "Chambre Standard",
    price: 80,
    capacity: 2,
    surface: 22,
    description:
      "Une chambre lumineuse et fonctionnelle, idéale pour un séjour court à Jacmel. Vue jardin et colline, air frais des hauteurs, literie confortable et ambiance apaisante.",
    images: imageUrls(g.standard),
    amenities: ["Télévision", "Air conditionné", "Toilettes séparées", "Sèche-cheveux"],
    services: ["Accès internet", "Parking gratuit"],
    isFeatured: true,
  },
  {
    slug: "chambre-deluxe",
    title: "Chambre Deluxe",
    price: 140,
    capacity: 2,
    surface: 32,
    description:
      "Espace généreux avec terrasse privée et vue dominante sur Jacmel. Finitions en bois local, salle de bain spacieuse et brise légère des hauteurs pour un séjour prolongé.",
    images: imageUrls(g.deluxe),
    amenities: [
      "Télévision",
      "Air conditionné",
      "Toilettes séparées",
      "Coffre-fort",
      "Machine à café",
      "Machine à thé",
      "Sèche-cheveux",
    ],
    services: ["Accès internet", "Service de chambre", "Parking gratuit"],
    isFeatured: true,
  },
  {
    slug: "suite-bon-accueil",
    title: "Suite Bon Accueil",
    price: 250,
    capacity: 4,
    surface: 55,
    description:
      "Notre suite signature : salon séparé, deux chambres, terrasse panoramique sur Jacmel et les collines. L'expérience ultime de l'hospitalité jacmélienne, au calme de la campagne.",
    images: imageUrls(g.suite),
    amenities: [
      "Télévision",
      "Air conditionné",
      "Toilettes séparées",
      "Coffre-fort",
      "Machine à laver",
      "Machine à café",
      "Machine à thé",
      "Sèche-cheveux",
    ],
    services: ["Accès internet", "Service de chambre", "Parking gratuit"],
    isFeatured: true,
  },
];
}

async function mapDbRoom(row: Tables<"rooms">): Promise<Room> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price,
    capacity: row.capacity,
    surface: row.surface ?? 0,
    description: row.description ?? "",
    images:
      row.images.length > 0
        ? row.images.map(normalizeImageUrl).filter(Boolean)
        : imageUrls(chambreGalleryForSlug(row.slug)),
    amenities: row.amenities,
    services: row.services,
    isFeatured: row.is_featured,
  };
}

async function fetchRoomsFromDb(): Promise<{ rooms: Room[]; error?: boolean }> {
  const staticRooms = await buildStaticRooms();

  if (!hasSupabasePublic()) {
    return { rooms: allowStaticFallback() ? staticRooms : [] };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return { rooms: allowStaticFallback() ? staticRooms : [] };
  }

  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "available")
      .order("price", { ascending: true });

    if (error) {
      console.error("[rooms] fetch:", error.message);
      return { rooms: allowStaticFallback() ? staticRooms : [], error: true };
    }

    const rooms = await Promise.all((data ?? []).map(mapDbRoom));
    return { rooms };
  } catch (err) {
    console.error("[rooms] fetch:", err instanceof Error ? err.message : err);
    return { rooms: allowStaticFallback() ? staticRooms : [], error: true };
  }
}

const fetchRoomsCached = unstable_cache(
  async () => fetchRoomsFromDb(),
  ["rooms-list"],
  { revalidate: 60 },
);

export async function getRooms(featuredOnly = false): Promise<Room[]> {
  const { rooms } = await fetchRoomsCached();
  return featuredOnly ? rooms.filter((r) => r.isFeatured !== false).slice(0, 3) : rooms;
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (hasSupabasePublic()) {
    const supabase = createPublicClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select("*")
          .eq("slug", slug)
          .eq("status", "available")
          .maybeSingle();

        if (!error && data) return await mapDbRoom(data);
        if (!error) return null;
        console.error("[rooms] getBySlug:", error.message);
      } catch (err) {
        console.error("[rooms] getBySlug:", err instanceof Error ? err.message : err);
      }
    }
  }

  if (!allowStaticFallback()) return null;
  const staticRooms = await buildStaticRooms();
  return staticRooms.find((r) => r.slug === slug) ?? null;
}

function staticRoomToInsert(room: Room) {
  return {
    slug: room.slug,
    title: room.title,
    price: room.price,
    capacity: room.capacity,
    surface: room.surface,
    description: room.description,
    images: room.images,
    amenities: room.amenities,
    services: room.services,
    is_featured: room.isFeatured ?? false,
    status: "available" as const,
  };
}

/** Résout l'UUID Supabase d'une chambre (crée depuis les données statiques si besoin). */
export async function ensureRoomId(slug: string): Promise<{ id: string } | { error: string }> {
  const room = await getRoomBySlug(slug);
  if (!room) return { error: "Chambre introuvable." };

  if (room.id) return { id: room.id };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { error: "NEXT_PUBLIC_SUPABASE_URL manquante dans .env.local." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY manquante. Ajoutez la clé service_role depuis Supabase → Project Settings → API.",
    };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    const { data: existing, error: selectError } = await admin
      .from("rooms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (selectError) {
      console.error("[ensureRoomId] select:", selectError);
      if (selectError.message.includes("Invalid API key")) {
        return {
          error:
            "Clé Supabase service_role invalide. Regénérez-la dans Supabase → Project Settings → API → service_role (secret), mettez à jour .env.local et redémarrez le serveur.",
        };
      }
      return { error: `Erreur Supabase : ${selectError.message}` };
    }

    if (existing?.id) return { id: existing.id };

    const { data: inserted, error: insertError } = await admin
      .from("rooms")
      .insert(staticRoomToInsert(room))
      .select("id")
      .single();

    if (insertError) {
      console.error("[ensureRoomId] insert:", insertError);
      if (insertError.code === "23505") {
        const { data: retry } = await admin.from("rooms").select("id").eq("slug", slug).maybeSingle();
        if (retry?.id) return { id: retry.id };
      }
      return { error: `Impossible de créer la chambre : ${insertError.message}` };
    }

    if (!inserted?.id) return { error: "La chambre n'a pas pu être enregistrée." };
    return { id: inserted.id };
  } catch (err) {
    console.error("[ensureRoomId]", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { error: message };
  }
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string | null,
): Promise<{ available: boolean; error?: string }> {
  try {
    const { createAdminClient, hasAdminClient } = await import("@/lib/supabase/admin");

    if (hasAdminClient()) {
      const admin = createAdminClient();
      let query = admin
        .from("reservations")
        .select("id")
        .eq("room_id", roomId)
        .in("status", ["pending", "confirmed"])
        .lt("check_in", checkOut)
        .gt("check_out", checkIn)
        .limit(1);

      if (excludeReservationId) {
        query = query.neq("id", excludeReservationId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("[availability]", error.message);
        return { available: false, error: error.message };
      }
      return { available: !data?.length };
    }

    if (!hasSupabasePublic()) {
      if (allowStaticFallback()) return { available: true };
      return { available: false, error: "Supabase non configuré." };
    }

    const supabase = createPublicClient();
    if (!supabase) {
      return { available: false, error: "Supabase non configuré." };
    }

    const { data, error } = await supabase.rpc("is_room_available", {
      p_room_id: roomId,
      p_check_in: checkIn,
      p_check_out: checkOut,
      p_exclude_reservation_id: excludeReservationId ?? undefined,
    });

    if (error) {
      console.error("[availability]", error.message);
      return { available: false, error: error.message };
    }

    return { available: Boolean(data) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur réseau";
    console.error("[availability]", message);
    return { available: false, error: message };
  }
}
