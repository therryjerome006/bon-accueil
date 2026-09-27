import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearAdminGateCookie } from "@/lib/admin/gate";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });
  clearAdminGateCookie(response);
  return response;
}
