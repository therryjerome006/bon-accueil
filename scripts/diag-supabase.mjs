import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

console.log("URL loaded:", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log("SERVICE loaded:", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error("Missing URL or service key in .env.local");
  process.exit(1);
}

const admin = createClient(url, service, { auth: { persistSession: false } });
const anonClient = createClient(url, anon);

for (const [label, client] of [
  ["admin", admin],
  ["anon", anonClient],
] ) {
  const { data, error } = await client.from("rooms").select("id, slug, title").limit(3);
  if (error) {
    console.log(`${label} rooms ERROR:`, error.message, error.code, error.details);
  } else {
    console.log(`${label} rooms:`, JSON.stringify(data));
  }
}

const { data: existing } = await admin
  .from("rooms")
  .select("id")
  .eq("slug", "chambre-standard")
  .maybeSingle();
console.log("existing chambre-standard:", existing);

if (!existing) {
  const testInsert = {
    slug: "chambre-standard",
    title: "Chambre Standard",
    price: 80,
    capacity: 2,
    surface: 22,
    description: "test",
    images: ["/images/rooms/standard.jpg"],
    amenities: ["Television"],
    services: ["Acces internet"],
    is_featured: true,
    status: "available",
  };
  const { data: ins, error: insErr } = await admin
    .from("rooms")
    .insert(testInsert)
    .select("id")
    .single();
  if (insErr) {
    console.log("insert ERROR:", insErr.message, insErr.code, insErr.details, insErr.hint);
  } else {
    console.log("insert OK:", ins);
  }
}

console.log("\n--- Résumé ---");
console.log("Si 'service' affiche 'Invalid API key' → regénérez SUPABASE_SERVICE_ROLE_KEY dans Supabase Dashboard.");
console.log("Si 'permission denied' → exécutez supabase/policies.sql dans le SQL Editor (GRANT + RLS).");
console.log("Puis exécutez supabase/seed-rooms.sql si la table rooms est vide.");
console.log("\nStripe webhook local : stripe listen --forward-to localhost:3000/api/webhooks/stripe");
