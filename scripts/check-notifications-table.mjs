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

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { error } = await admin.from("notifications").select("id").limit(1);
if (error) {
  console.log("MISSING:", error.code, "-", error.message);
  process.exit(1);
}
console.log("OK: table notifications accessible");
