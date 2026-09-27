import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/** Uniquement les routes qui nécessitent une vérification auth */
export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/compte",
    "/api/notifications/:path*",
    "/api/admin/:path*",
    /*
     * Détecte la sortie de /admin pour lancer le délai d’1 minute (sans cron).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api/).*)",
  ],
};
