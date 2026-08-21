/**
 * Exécute un fichier SQL Supabase (DDL / policies).
 *
 * Prérequis (une des deux options) :
 * 1. DATABASE_URL dans .env.local (Settings → Database → Connection string → URI)
 * 2. Supabase CLI lié : npx supabase link --project-ref VOTRE_REF
 *    puis mot de passe DB demandé une fois
 *
 * Usage :
 *   node scripts/run-supabase-sql.mjs supabase/notifications.sql
 *   npm run supabase:sql -- supabase/notifications.sql
 */

import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { resolve } from "path";

function loadEnv() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  const env = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
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

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: node scripts/run-supabase-sql.mjs <fichier.sql>");
  process.exit(1);
}

const sqlPath = resolve(fileArg);
if (!existsSync(sqlPath)) {
  console.error("Fichier introuvable:", sqlPath);
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
console.log("Fichier:", sqlPath);

async function runWithPg() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
  if (!databaseUrl) return false;

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error("Installez pg : npm install pg");
    process.exit(1);
  }

  const client = new pg.default.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log("SQL exécuté avec succès (connexion directe PostgreSQL).");
    return true;
  } finally {
    await client.end();
  }
}

function runWithSupabaseCli() {
  const result = spawnSync("npx", ["supabase", "db", "execute", "--file", sqlPath], {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  });
  if (result.status === 0) {
    console.log("SQL exécuté avec succès (Supabase CLI).");
    return true;
  }
  return false;
}

const viaPg = await runWithPg();
if (viaPg) process.exit(0);

console.log("DATABASE_URL absent — tentative via Supabase CLI…");
const viaCli = runWithSupabaseCli();
if (viaCli) process.exit(0);

console.error(`
Impossible d'exécuter le SQL automatiquement.

Ajoutez dans .env.local la connection string PostgreSQL :
  DATABASE_URL=postgresql://postgres.[ref]:[MOT_DE_PASSE]@aws-0-us-east-2.pooler.supabase.com:6543/postgres

(Supabase Dashboard → Project Settings → Database → Connection string → URI)

Puis relancez :
  node scripts/run-supabase-sql.mjs ${fileArg}
`);
process.exit(1);
