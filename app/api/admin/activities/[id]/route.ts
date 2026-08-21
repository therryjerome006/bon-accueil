import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
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

  const update: TablesUpdate<"activities"> = {};
  if (body.title != null) update.title = body.title.trim();
  if (body.date != null) update.date = body.date;
  if (body.price != null) update.price = Number(body.price);
  if (body.description != null) update.description = body.description.trim() || null;
  if (body.images != null) update.images = parseLines(body.images);

  const { error } = await db.from("activities").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const { id } = await params;
  const db = getAdminDb();
  const { error } = await db.from("activities").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
