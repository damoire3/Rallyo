const fs = require("fs");
const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, s) => fs.writeFileSync(p, s);
const must = (cond, msg) => { if (!cond) { console.error("ECHEC : " + msg); process.exit(1); } };

// ---------- 1) Migrations : public -> rallyo ----------
const dir = "supabase/migrations/";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
for (const f of files) {
  let s = read(dir + f);
  const before = (s.match(/public\./g) || []).length;
  s = s.split("public.").join("rallyo.");
  s = s.split("set search_path = public").join("set search_path = rallyo");
  must(!/public\./.test(s), f + " : il reste des 'public.'");

  if (f === "0001_init.sql") {
    const ext = 'create extension if not exists "pgcrypto";';
    must(s.includes(ext), "0001 : ligne pgcrypto introuvable");
    s = s.replace(ext, () => ext + `

-- ---------- Isolation : tout Rallyo vit dans le schéma "rallyo" ----------
-- Ce projet Supabase est partagé avec d'autres applications (ex. Drop) : on n'écrit JAMAIS dans "public".
-- Les types (enum) ci-dessous sont créés dans "rallyo" grâce au search_path.
-- Après exécution : Project Settings > API > "Exposed schemas" : ajouter "rallyo".
create schema if not exists rallyo;
grant usage on schema rallyo to anon, authenticated, service_role;
set search_path = rallyo;`);
    s = s.trimEnd() + `

-- ---------- Droits d'accès (les nouveaux schémas n'ont aucun droit par défaut) ----------
-- Le public (anon) n'accède aux tables QUE par les fonctions SECURITY DEFINER des migrations 0002–0004.
-- Les utilisateurs connectés lisent/écrivent leurs lignes, limités par les politiques RLS ci-dessus.
grant select, insert, update on all tables in schema rallyo to authenticated;
grant all on all tables in schema rallyo to service_role;
alter default privileges in schema rallyo grant all on tables to service_role;
`;
  } else {
    // Les autres migrations qualifient déjà tout ; on rappelle simplement le schéma cible.
    s = "-- Schéma cible : rallyo (voir 0001)\n" + s;
  }
  write(dir + f, s);
  console.log("OK  " + f + " : " + before + " occurrence(s) 'public.' remplacée(s)");
}

// ---------- 2) supabase-rest.ts : en-tête Content-Profile ----------
{
  const p = "src/lib/supabase-rest.ts";
  let s = read(p);
  const hdr = 'headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },';
  must(s.includes(hdr), "supabase-rest.ts : en-têtes introuvables");
  s = s.replace(hdr, () => 'headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Content-Profile": DB_SCHEMA },');
  const anchor = "export const isUuid";
  must(s.includes(anchor), "supabase-rest.ts : ancre introuvable");
  s = s.replace(anchor, () => `/** Schéma Postgres de Rallyo (le projet Supabase est partagé avec d'autres applications). Doit être "exposé" dans Project Settings > API. */
export const DB_SCHEMA = "rallyo";

` + anchor);
  write(p, s);
  console.log("OK  src/lib/supabase-rest.ts");
}

// ---------- 3) route contact ----------
{
  const p = "src/app/api/contact/route.ts";
  let s = read(p);
  const k = "        apikey: key,";
  must(s.includes(k), "route.ts : ligne apikey introuvable");
  s = s.replace(k, () => k + '\n        "Content-Profile": DB_SCHEMA,');
  const m = s.match(/^import [^\n]*\n/m);
  must(m, "route.ts : aucun import");
  s = s.replace(m[0], () => m[0] + 'import { DB_SCHEMA } from "@/lib/supabase-rest";\n');
  write(p, s);
  console.log("OK  src/app/api/contact/route.ts");
}

// ---------- 4) .env.example ----------
{
  const p = ".env.example";
  let s = read(p);
  const k = "# Supabase : Project Settings > API";
  must(s.includes(k), ".env.example : ancre introuvable");
  s = s.replace(k, () => k + `
# ⚠️ Projet partagé avec d'autres applications (ex. Drop) : Rallyo utilise le schéma "rallyo".
# Après avoir exécuté les migrations : Project Settings > API > "Exposed schemas" > ajouter "rallyo".
# Ne mets JAMAIS la clé "service_role" ici (elle donnerait tous les droits au navigateur).`);
  write(p, s);
  console.log("OK  .env.example");
}
