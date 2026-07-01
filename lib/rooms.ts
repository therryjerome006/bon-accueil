import { supabase } from "@/lib/supabaseClient";
import type { Tables } from "@/types/database.types";

export const AMENITY_LABELS = [
  "Télévision",
  "Air conditionné",
  "Toilettes séparées",
  "Coffre-fort",
  "Machine à laver",
  "Machine à café",
  "Machine à thé",
  "Sèche-cheveux",
] as const;

export const SERVICE_LABELS = [
  "Accès internet",
  "Service de chambre",
  "Parking gratuit",
] as const;

export type Room = {
  id?: string;
  slug: string;
  title: string;
  price: number;
  capacity: number;
  surface: number;
  description: string;
  images: string[];
  amenities: string[];
  services: string[];
  isFeatured?: boolean;
};

const STATIC_ROOMS: Room[] = [
  {
    slug: "chambre-standard",
    title: "Chambre Standard",
    price: 80,
    capacity: 2,
    surface: 22,
    description:
      "Une chambre lumineuse et fonctionnelle, idéale pour un séjour court à Jacmel. Vue sur le jardin tropical, literie confortable et ambiance apaisante au cœur de l'hôtel.",
    images: ["/images/rooms/standard.jpg"],
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
      "Espace généreux avec terrasse privée et vue partielle sur la mer. Finitions en bois local, salle de bain spacieuse et tous les conforts pour un séjour prolongé en toute sérénité.",
    images: ["/images/rooms/deluxe.jpg"],
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
      "Notre suite signature : salon séparé, deux chambres, terrasse panoramique face à l'océan. L'expérience ultime de l'hospitalité jacmélienne, pensée pour les familles ou les séjours d'exception.",
    images: ["/images/rooms/suite.jpg"],
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

function mapDbRoom(row: Tables<"rooms">): Room {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: row.price,
    capacity: row.capacity,
    surface: row.surface ?? 0,
    description: row.description ?? "",
    images: row.images.length > 0 ? row.images : ["/images/rooms/standard.jpg"],
    amenities: row.amenities,
    services: row.services,
    isFeatured: row.is_featured,
  };
}

async function fetchRoomsFromDb(): Promise<Room[] | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("status", "available")
    .order("price", { ascending: true });

  if (error || !data?.length) return null;
  return data.map(mapDbRoom);
}

export async function getRooms(featuredOnly = false): Promise<Room[]> {
  const dbRooms = await fetchRoomsFromDb();
  const rooms = dbRooms ?? STATIC_ROOMS;
  return featuredOnly ? rooms.filter((r) => r.isFeatured !== false).slice(0, 3) : rooms;
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("slug", slug)
      .eq("status", "available")
      .maybeSingle();

    if (!error && data) return mapDbRoom(data);
  }

  return STATIC_ROOMS.find((r) => r.slug === slug) ?? null;
}

export function getRoomImage(room: Room): string {
  return room.images[0] ?? "/images/rooms/standard.jpg";
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
export async function ensureRoomId(slug: string): Promise<string | null> {
  const room = await getRoomBySlug(slug);
  if (!room) return null;

  if (room.id) return room.id;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();

    const { data: existing } = await admin.from("rooms").select("id").eq("slug", slug).maybeSingle();
    if (existing?.id) return existing.id;

    const { data: inserted, error } = await admin
      .from("rooms")
      .insert(staticRoomToInsert(room))
      .select("id")
      .single();

    if (error || !inserted) return null;
    return inserted.id;
  } catch {
    return null;
  }
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return true;
  }

  const { data, error } = await supabase.rpc("is_room_available", {
    p_room_id: roomId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) return true;
  return Boolean(data);
}
