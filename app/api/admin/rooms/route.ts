import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { slugify } from "@/lib/admin/navigation";
import { AMENITY_LABELS, SERVICE_LABELS } from "@/lib/rooms";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  const db = getAdminDb();

  const slug = body.slug?.trim() || slugify(body.title ?? "");
  if (!slug || !body.title || body.price == null) {
    return NextResponse.json({ error: "Titre, slug et prix requis." }, { status: 400 });
  }

  const amenities = (body.amenities as string[] | undefined)?.filter((a: string) =>
    AMENITY_LABELS.includes(a as (typeof AMENITY_LABELS)[number]),
  ) ?? [];
  const services = (body.services as string[] | undefined)?.filter((s: string) =>
    SERVICE_LABELS.includes(s as (typeof SERVICE_LABELS)[number]),
  ) ?? [];

  const images = parseLines(body.images);

  const { data, error } = await db
    .from("rooms")
    .insert({
      title: body.title.trim(),
      slug,
      price: Number(body.price),
      capacity: Number(body.capacity) || 2,
      surface: Number(body.surface) || null,
      description: body.description?.trim() || null,
      images,
      amenities,
      services,
      is_featured: Boolean(body.is_featured),
      status: body.status ?? "available",
      room_type: body.room_type?.trim() || null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

function parseLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}
