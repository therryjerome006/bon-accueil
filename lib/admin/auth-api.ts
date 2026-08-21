import { getUser, getProfile } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdminApi() {
  const user = await getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Non authentifié." }, { status: 401 }) };
  }

  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 }) };
  }

  return { user, profile };
}
