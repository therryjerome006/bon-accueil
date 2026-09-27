import type { NextResponse } from "next/server";

export const ADMIN_GATE_COOKIE = "ba_admin_gate";
/** Délai après avoir quitté l’admin avant de redemander le code */
export const ADMIN_GATE_GRACE_MS = 60_000;

export type AdminGatePayload = {
  until: number;
  inAdmin: boolean;
};

function gateSecret(): string | null {
  return (
    process.env.ADMIN_GATE_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    null
  );
}

function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padLen));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSign(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8(secret) as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8(body) as BufferSource);
  return toBase64Url(sig);
}

export function adminGatePasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_GATE_PASSWORD?.trim());
}

export function getAdminGatePassword(): string {
  return process.env.ADMIN_GATE_PASSWORD?.trim() ?? "";
}

export function verifyAdminGatePassword(input: string): boolean {
  const expected = getAdminGatePassword();
  if (!expected || !input) return false;
  return timingSafeEqualStr(input, expected);
}

export async function signAdminGate(payload: AdminGatePayload): Promise<string | null> {
  const secret = gateSecret();
  if (!secret) return null;
  const body = toBase64Url(utf8(JSON.stringify(payload)));
  const sig = await hmacSign(secret, body);
  return `${body}.${sig}`;
}

export async function parseAdminGate(token: string | undefined): Promise<AdminGatePayload | null> {
  if (!token) return null;
  const secret = gateSecret();
  if (!secret) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacSign(secret, body);
  if (!timingSafeEqualStr(sig, expected)) return null;

  try {
    const json = new TextDecoder().decode(fromBase64Url(body));
    const parsed = JSON.parse(json) as AdminGatePayload;
    if (typeof parsed.until !== "number" || typeof parsed.inAdmin !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isAdminGateOpen(payload: AdminGatePayload | null): boolean {
  return payload !== null && payload.until > Date.now();
}

export async function setAdminGateCookie(
  response: NextResponse,
  payload: AdminGatePayload,
): Promise<void> {
  const signed = await signAdminGate(payload);
  if (!signed) return;
  const maxAge = Math.max(1, Math.ceil((payload.until - Date.now()) / 1000));
  response.cookies.set(ADMIN_GATE_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearAdminGateCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_GATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function adminGateWhileInside(): AdminGatePayload {
  return {
    inAdmin: true,
    until: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

export function adminGateAfterLeave(): AdminGatePayload {
  return {
    inAdmin: false,
    until: Date.now() + ADMIN_GATE_GRACE_MS,
  };
}
