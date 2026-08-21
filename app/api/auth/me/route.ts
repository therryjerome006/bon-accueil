import { NextResponse } from "next/server";
import { getUser, isAdminUser } from "@/lib/auth";

/** Session courante vérifiée côté serveur (évite la confiance au client Supabase) */
export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false, isAdmin: false });
  }

  const isAdmin = await isAdminUser();

  return NextResponse.json({
    authenticated: true,
    isAdmin,
    email: user.email,
  });
}
