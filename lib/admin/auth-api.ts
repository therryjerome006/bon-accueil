import { getUser, getProfile } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_GATE_COOKIE,
  adminGatePasswordConfigured,
  isAdminGateOpen,
  parseAdminGate,
} from "@/lib/admin/gate";

type RequireAdminApiOptions = {
  /** Pour /api/admin/gate (connexion au second verrou) */
  skipGate?: boolean;
};

export async function requireAdminApi(options: RequireAdminApiOptions = {}) {
  const user = await getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Non authentifié." }, { status: 401 }) };
  }

  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 }) };
  }

  if (!options.skipGate && adminGatePasswordConfigured()) {
    const jar = await cookies();
    const gate = await parseAdminGate(jar.get(ADMIN_GATE_COOKIE)?.value);
    if (!isAdminGateOpen(gate)) {
      return {
        error: NextResponse.json(
          { error: "Code d’accès admin requis.", code: "admin_gate" },
          { status: 403 },
        ),
      };
    }
  }

  return { user, profile };
}
