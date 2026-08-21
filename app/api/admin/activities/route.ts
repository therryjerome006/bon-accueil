import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import { getAdminDb } from "@/lib/admin/db";

function parseLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if ("error" in auth && auth.error) return auth.error;

  const body = await request.json();
  if (!body.title || body.price == null || !body.date) {
    return NextResponse.json({ error: "Titre, prix et date requis." }, { status: 400 });
  }

  const db = getAdminDb();
  const { data, error } = await db
    .from("activities")
    .insert({
      title: body.title.trim(),
      date: body.date,
      price: Number(body.price),
      description: body.description?.trim() || null,
      images: parseLines(body.images),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
