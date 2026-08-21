/**
 * Remet à zéro les données de test pour repartir sur une base propre.
 *
 * Usage:
 *   node scripts/reset-test-data.mjs           # aperçu (dry-run)
 *   node scripts/reset-test-data.mjs --confirm # exécution réelle
 *
 * Conserve : chambres, activités, tables restaurant, comptes admin
 * Supprime : réservations, inscriptions activités, utilisateurs non-admin
 */

import { readFileSync } from "fs";

function loadEnv() {
  const env = readFileSync(".env.local", "utf8").replace(/^\uFEFF/, "");
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnv();

const { createClient } = await import("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const confirm = process.argv.includes("--confirm");

if (!url || !service) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
  process.exit(1);
}

const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

async function count(table) {
  const { count: n, error } = await admin.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return n ?? 0;
}

async function listAuthUsers() {
  const users = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}

console.log(confirm ? "🔄 Remise à zéro en cours…\n" : "👀 Aperçu (dry-run) — ajoutez --confirm pour exécuter\n");

const before = {
  reservations: await count("reservations"),
  table_reservations: await count("table_reservations"),
  activity_bookings: await count("activity_bookings"),
  profiles: await count("profiles"),
  rooms: await count("rooms"),
  activities: await count("activities"),
  restaurant_tables: await count("restaurant_tables"),
};

const { data: adminProfiles, error: adminErr } = await admin
  .from("profiles")
  .select("id, email")
  .eq("role", "admin");

if (adminErr) throw adminErr;

const adminIds = new Set((adminProfiles ?? []).map((p) => p.id));
const authUsers = await listAuthUsers();
const usersToDelete = authUsers.filter((u) => !adminIds.has(u.id));

console.log("État actuel :");
console.log(`  Réservations chambres : ${before.reservations}`);
console.log(`  Réservations restaurant : ${before.table_reservations}`);
console.log(`  Inscriptions activités : ${before.activity_bookings}`);
console.log(`  Profils : ${before.profiles} (${adminProfiles?.length ?? 0} admin)`);
console.log(`  Catalogue : ${before.rooms} chambres, ${before.activities} activités, ${before.restaurant_tables} tables`);
console.log(`  Comptes auth à supprimer : ${usersToDelete.length}`);

if (usersToDelete.length > 0) {
  console.log("  →", usersToDelete.map((u) => u.email ?? u.id).join(", "));
}

if (!confirm) {
  console.log("\nPour appliquer : node scripts/reset-test-data.mjs --confirm");
  console.log("  ou : npm run reset:test");
  console.log("\nSi erreur 'permission denied', exécutez supabase/grants-reset.sql dans le SQL Editor.");
  console.log("Alternative SQL directe : supabase/reset-test-data.sql");
  console.log("\nNote Stripe : les paiements test restent dans le dashboard Stripe (mode test).");
  console.log("Les codes transaction en base seront supprimés avec les réservations.");
  process.exit(0);
}

for (const table of ["activity_bookings", "table_reservations", "reservations"]) {
  const { error } = await admin.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(`delete ${table}: ${error.message}`);
  console.log(`✓ ${table} vidée`);
}

const { error: profileDeleteErr } = await admin.from("profiles").delete().neq("role", "admin");
if (profileDeleteErr) throw profileDeleteErr;
console.log("✓ profils non-admin supprimés");

for (const user of usersToDelete) {
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.warn(`⚠ impossible de supprimer ${user.email ?? user.id}: ${error.message}`);
  } else {
    console.log(`✓ auth supprimé : ${user.email ?? user.id}`);
  }
}

const after = {
  reservations: await count("reservations"),
  table_reservations: await count("table_reservations"),
  activity_bookings: await count("activity_bookings"),
  profiles: await count("profiles"),
};

console.log("\n✅ Remise à zéro terminée");
console.log(`  Réservations chambres : ${after.reservations}`);
console.log(`  Réservations restaurant : ${after.table_reservations}`);
console.log(`  Inscriptions activités : ${after.activity_bookings}`);
console.log(`  Profils restants : ${after.profiles}`);
console.log("\nPensez à vider les cookies du navigateur (session test) et relancer npm run dev.");
