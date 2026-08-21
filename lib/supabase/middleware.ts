import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

const PROTECTED_PREFIXES = ["/admin", "/login", "/compte"];

function needsAuthCheck(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pages publiques : aucun appel Supabase (évite les lags réseau)
  if (!needsAuthCheck(pathname)) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  let user = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn("[middleware] auth:", error.message);
    }
    user = data.user;
  } catch (err) {
    console.warn("[middleware] auth fetch failed:", err);
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
    return supabaseResponse;
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/compte", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login?error=auth", request.url));
    }
  }

  if (pathname === "/login" && user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const dest = profile?.role === "admin" ? "/admin" : "/compte";
      return NextResponse.redirect(new URL(dest, request.url));
    } catch {
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}
