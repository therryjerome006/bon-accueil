import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth-api";
import {
  adminGatePasswordConfigured,
  adminGateWhileInside,
  clearAdminGateCookie,
  setAdminGateCookie,
  verifyAdminGatePassword,
} from "@/lib/admin/gate";

export async function POST(request: Request) {
  const auth = await requireAdminApi({ skipGate: true });
  if ("error" in auth && auth.error) return auth.error;

  if (!adminGatePasswordConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_GATE_PASSWORD n’est pas configuré sur le serveur." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  if (!verifyAdminGatePassword(password)) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  await setAdminGateCookie(response, adminGateWhileInside());
  return response;
}

export async function DELETE() {
  const auth = await requireAdminApi({ skipGate: true });
  if ("error" in auth && auth.error) return auth.error;

  const response = NextResponse.json({ ok: true });
  clearAdminGateCookie(response);
  return response;
}
