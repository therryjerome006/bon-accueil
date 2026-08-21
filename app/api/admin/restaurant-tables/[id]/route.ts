import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { parseImageUrls } from "@/lib/image-url";
import type { TablesUpdate } from "@/types/database.types";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const db = getAdminDb();

  const update: TablesUpdate<"restaurant_tables"> = {};
  if (body.name != null) update.name = body.name.trim();
  if (body.capacity != null) update.capacity = Number(body.capacity);
  if (body.description != null) update.description = body.description.trim() || null;
  if (body.images != null) update.images = parseImageUrls(body.images);
  if (body.status != null) update.status = body.status;

  const { error } = await db.from("restaurant_tables").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const db = getAdminDb();
  const { error } = await db.from("restaurant_tables").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
