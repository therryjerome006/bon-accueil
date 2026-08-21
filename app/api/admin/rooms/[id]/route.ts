import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { slugify } from "@/lib/admin/navigation";
import { AMENITY_LABELS, SERVICE_LABELS } from "@/lib/rooms";
import type { TablesUpdate } from "@/types/database.types";

type RouteParams = { params: Promise<{ id: string }> };

function parseLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const db = getAdminDb();

  const update: TablesUpdate<"rooms"> = {};
  if (body.title != null) update.title = body.title.trim();
  if (body.slug != null) update.slug = body.slug.trim() || slugify(body.title ?? "");
  if (body.price != null) update.price = Number(body.price);
  if (body.capacity != null) update.capacity = Number(body.capacity);
  if (body.surface != null) update.surface = Number(body.surface) || null;
  if (body.description != null) update.description = body.description.trim() || null;
  if (body.images != null) update.images = parseLines(body.images);
  if (body.amenities != null) {
    update.amenities = (body.amenities as string[]).filter((a) =>
      AMENITY_LABELS.includes(a as (typeof AMENITY_LABELS)[number]),
    );
  }
  if (body.services != null) {
    update.services = (body.services as string[]).filter((s) =>
      SERVICE_LABELS.includes(s as (typeof SERVICE_LABELS)[number]),
    );
  }
  if (body.is_featured != null) update.is_featured = Boolean(body.is_featured);
  if (body.status != null) update.status = body.status;
  if (body.room_type != null) update.room_type = body.room_type.trim() || null;

  const { error } = await db.from("rooms").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const db = getAdminDb();
  const { error } = await db.from("rooms").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
