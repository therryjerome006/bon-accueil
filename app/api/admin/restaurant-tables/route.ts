import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";
import { parseImageUrls } from "@/lib/image-url";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  if (!body.name || body.capacity == null) {
    return NextResponse.json({ error: "Nom et capacité requis." }, { status: 400 });
  }

  const db = getAdminDb();
  const { data, error } = await db
    .from("restaurant_tables")
    .insert({
      name: body.name.trim(),
      capacity: Number(body.capacity),
      description: body.description?.trim() || null,
      images: parseImageUrls(body.images),
      status: body.status ?? "available",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
