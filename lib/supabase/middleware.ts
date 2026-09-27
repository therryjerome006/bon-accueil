import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { finalizeAdminGate, withPathnameHeader } from "@/lib/admin/gate-middleware";

const PROTECTED_PREFIXES = ["/admin", "/login", "/compte"];

function needsAuthCheck(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = withPathnameHeader(request);

  if (!needsAuthCheck(pathname) && !pathname.startsWith("/api/admin")) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    return await finalizeAdminGate(request, response, pathname);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    return await finalizeAdminGate(request, response, pathname);
  }

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
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
    return await finalizeAdminGate(request, supabaseResponse, pathname);
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
      return await finalizeAdminGate(request, supabaseResponse, pathname);
    }
  }

  return await finalizeAdminGate(request, supabaseResponse, pathname);
}
