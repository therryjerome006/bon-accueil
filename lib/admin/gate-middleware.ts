import { NextResponse, type NextRequest } from "next/server";
import {
  adminGateAfterLeave,
  adminGatePasswordConfigured,
  adminGateWhileInside,
  ADMIN_GATE_COOKIE,
  isAdminGateOpen,
  parseAdminGate,
  setAdminGateCookie,
} from "@/lib/admin/gate";

export function withPathnameHeader(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return requestHeaders;
}

export async function finalizeAdminGate(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
): Promise<NextResponse> {
  const isUnlock = pathname === "/admin/unlock";
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isGateApi = pathname === "/api/admin/gate";

  const gate = await parseAdminGate(request.cookies.get(ADMIN_GATE_COOKIE)?.value);

  if (isUnlock) {
    if (adminGatePasswordConfigured() && isAdminGateOpen(gate)) {
      const redirectTo = request.nextUrl.searchParams.get("redirect") || "/admin";
      const safe =
        redirectTo.startsWith("/admin") && !redirectTo.startsWith("/admin/unlock")
          ? redirectTo
          : "/admin";
      return NextResponse.redirect(new URL(safe, request.url));
    }
    return response;
  }

  if (isAdminPath) {
    if (!adminGatePasswordConfigured() || !isAdminGateOpen(gate)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/unlock";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    await setAdminGateCookie(response, adminGateWhileInside());
    return response;
  }

  if (isAdminApi && !isGateApi) {
    if (!adminGatePasswordConfigured() || !isAdminGateOpen(gate)) {
      return NextResponse.json(
        { error: "Code d’accès admin requis.", code: "admin_gate" },
        { status: 403 },
      );
    }
    await setAdminGateCookie(response, adminGateWhileInside());
    return response;
  }

  if (gate?.inAdmin) {
    await setAdminGateCookie(response, adminGateAfterLeave());
  }

  return response;
}
