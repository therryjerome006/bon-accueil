/**
 * Remet à zéro les données de test pour repartir sur une base propre.
 *
 * Usage:
 *   node scripts/reset-test-data.mjs           # aperçu (dry-run)
 *   node scripts/reset-test-data.mjs --confirm # exécution réelle
 *
 * Conserve : comptes utilisateurs (auth + profiles), chambres, activités, tables restaurant
 * Supprime : réservations chambres/restaurant, inscriptions activités, notifications
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
  if (error) {
    if (error.message.includes("Could not find")) return 0;
    throw new Error(`${table}: ${error.message}`);
  }
  return n ?? 0;
}

console.log(confirm ? "🔄 Remise à zéro en cours…\n" : "👀 Aperçu (dry-run) — ajoutez --confirm pour exécuter\n");

const before = {
  reservations: await count("reservations"),
  table_reservations: await count("table_reservations"),
  activity_bookings: await count("activity_bookings"),
  notifications: await count("notifications"),
  profiles: await count("profiles"),
  rooms: await count("rooms"),
  activities: await count("activities"),
  restaurant_tables: await count("restaurant_tables"),
};

console.log("État actuel :");
console.log(`  Réservations chambres : ${before.reservations}`);
console.log(`  Réservations restaurant : ${before.table_reservations}`);
console.log(`  Inscriptions activités : ${before.activity_bookings}`);
console.log(`  Notifications : ${before.notifications}`);
console.log(`  Profils (conservés) : ${before.profiles}`);
console.log(`  Catalogue (conservé) : ${before.rooms} chambres, ${before.activities} activités, ${before.restaurant_tables} tables`);

if (!confirm) {
  console.log("\nPour appliquer : node scripts/reset-test-data.mjs --confirm");
  console.log("  ou : npm run reset:test");
  console.log("\nSi erreur 'permission denied', exécutez supabase/grants-reset.sql dans le SQL Editor.");
  console.log("Alternative SQL directe : supabase/reset-test-data.sql");
  process.exit(0);
}

for (const table of ["activity_bookings", "table_reservations", "reservations", "notifications"]) {
  const { error } = await admin.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    if (error.message.includes("Could not find") && table === "notifications") {
      console.log(`⊘ ${table} (table absente, ignorée)`);
      continue;
    }
    throw new Error(`delete ${table}: ${error.message}`);
  }
  console.log(`✓ ${table} vidée`);
}

const after = {
  reservations: await count("reservations"),
  table_reservations: await count("table_reservations"),
  activity_bookings: await count("activity_bookings"),
  notifications: await count("notifications"),
  profiles: await count("profiles"),
};

console.log("\n✅ Remise à zéro terminée (utilisateurs inchangés)");
console.log(`  Réservations chambres : ${after.reservations}`);
console.log(`  Réservations restaurant : ${after.table_reservations}`);
console.log(`  Inscriptions activités : ${after.activity_bookings}`);
console.log(`  Notifications : ${after.notifications}`);
console.log(`  Profils : ${after.profiles}`);
