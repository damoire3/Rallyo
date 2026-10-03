// Banc d'essai des migrations Supabase : les exécute sur un VRAI PostgreSQL (PGlite, en mémoire) puis teste les droits et les fonctions.
// Utilisation (hors projet, rien n'est ajouté à package.json) :
//   mkdir %TEMP%\pgcheck && cd %TEMP%\pgcheck && npm init -y && npm i @electric-sql/pglite
//   copier ce fichier ici (type: module), puis : node migrations.test.mjs <chemin\vers\supabase\migrations>
// Limite : PGlite n'est pas Supabase (pas de PostgREST) ; auth.users / auth.uid() et les rôles anon / authenticated sont simulés.
// Pense à ajouter ici les tests de chaque nouvelle migration.
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const dir = process.argv[2];
const db = new PGlite();
let pass = 0;
let fail = 0;

const t = async (name, fn) => {
  try {
    await fn();
    pass++;
    console.log(`  OK     ${name}`);
  } catch (e) {
    fail++;
    console.log(`  ECHEC  ${name}\n         -> ${e.message}`);
  }
};
const eq = (a, b, what) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what} : attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`);
};
const as = async (role, sql, params) => {
  await db.exec(`set role ${role}`);
  try {
    return (await db.query(sql, params)).rows;
  } finally {
    await db.exec("reset role");
  }
};
const denied = async (role, sql) => {
  let msg = "";
  let ok = false;
  try {
    await as(role, sql);
  } catch (e) {
    msg = e.message;
    ok = /permission denied|must be owner/i.test(msg);
  }
  if (!ok) throw new Error(msg ? `erreur inattendue : ${msg}` : "accÃ¨s AUTORISÃ‰ (anormal)");
};
const raises = async (role, sql, params, expected) => {
  let msg = "";
  try {
    await as(role, sql, params);
  } catch (e) {
    msg = e.message;
  }
  if (!msg.includes(expected)) throw new Error(`attendu l'erreur Â« ${expected} Â», obtenu Â« ${msg || "aucune erreur"} Â»`);
};

// ---------- Environnement Supabase simulÃ© ----------
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role stranger nologin;
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema public to anon, authenticated, stranger;
`);

console.log("== Application des migrations, dans l'ordre ==");
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
  try {
    await db.exec(fs.readFileSync(path.join(dir, f), "utf8"));
    console.log(`  OK     ${f}`);
  } catch (e) {
    console.log(`  ECHEC  ${f}\n         -> ${e.message}`);
    process.exit(1);
  }
}

// ---------- DonnÃ©es de test ----------
const U1 = "00000000-0000-0000-0000-000000000001";
const U2 = "00000000-0000-0000-0000-000000000002";
const C1 = "c0000000-0000-0000-0000-000000000001"; // active, 3 contributions confirmÃ©es + 1 en attente
const C2 = "c0000000-0000-0000-0000-000000000002"; // brouillon
const C3 = "c0000000-0000-0000-0000-000000000003"; // terminÃ©e
const C4 = "c0000000-0000-0000-0000-000000000004"; // active mais date de fin dÃ©passÃ©e
const E1 = "e0000000-0000-0000-0000-000000000001"; // publiÃ©, capacitÃ© 100
const E2 = "e0000000-0000-0000-0000-000000000002"; // non publiÃ©
await db.exec(`
  insert into auth.users(id) values ('${U1}'), ('${U2}');
  insert into rallyo.profiles(id, full_name, phone) values ('${U1}', 'Famille Kouassi', '+22900000001'), ('${U2}', 'Club ZBC', '+22900000002');
  insert into rallyo.campaigns(id, owner_id, slug, title, category, goal_amount, raised_amount, status, ends_at, created_at) values
    ('${C1}', '${U1}', 'toit-aicha', 'OpÃ©ration Toit pour AÃ¯cha', 'SolidaritÃ©', 2500000, 1680000, 'active', now() + interval '12 days', now() - interval '2 days'),
    ('${C2}', '${U1}', 'brouillon', 'Brouillon secret', 'Autre', 100000, 0, 'draft', null, now()),
    ('${C3}', '${U2}', 'terminee', 'Cagnotte terminÃ©e', 'Sport', 900000, 900000, 'completed', null, now() - interval '40 days'),
    ('${C4}', '${U2}', 'expiree', 'Cagnotte active expirÃ©e', 'Sport', 900000, 100, 'active', now() - interval '1 day', now() - interval '5 days');
  insert into rallyo.contributions(campaign_id, user_id, amount, provider, status) values
    ('${C1}', '${U2}', 5000, 'test', 'succeeded'), ('${C1}', null, 10000, 'test', 'succeeded'),
    ('${C1}', null, 2000, 'test', 'succeeded'), ('${C1}', null, 7000, 'test', 'pending');
  insert into rallyo.events(id, organizer_id, slug, title, category, venue, starts_at, ticket_price, capacity, is_published) values
    ('${E1}', '${U2}', 'nuit-bass', 'Nuit Graffiti & Bass', 'Concert', 'Hangar 12, Cotonou', now() + interval '10 days', 5000, 100, true),
    ('${E2}', '${U2}', 'prive', 'Ã‰vÃ¨nement non publiÃ©', 'Autre', 'Quelque part', now() + interval '10 days', 1000, 50, false);
  insert into rallyo.tickets(event_id, holder_name, code, amount_paid, status) values
    ('${E1}', 'A', 'RLY-0001', 5000, 'valid'), ('${E1}', 'B', 'RLY-0002', 5000, 'valid'),
    ('${E1}', 'C', 'RLY-0003', 5000, 'valid'), ('${E1}', 'D', 'RLY-0004', 5000, 'used'),
    ('${E1}', 'E', 'RLY-0005', 5000, 'cancelled');
`);

// ---------- 1. Les tables sont inaccessibles aux rÃ´les publics ----------
console.log("\n== 1. Tables protÃ©gÃ©es (visiteur anonyme et connectÃ©) ==");
for (const tbl of ["profiles", "campaigns", "contributions", "events", "tickets", "contact_messages"]) {
  await t(`anon ne peut pas lire rallyo.${tbl}`, () => denied("anon", `select * from rallyo.${tbl}`));
}
await t("authenticated ne peut pas lire rallyo.campaigns", () => denied("authenticated", "select * from rallyo.campaigns"));
await t("authenticated ne peut pas lire rallyo.profiles (tÃ©lÃ©phones)", () => denied("authenticated", "select * from rallyo.profiles"));
await t("anon ne peut pas Ã©crire dans rallyo.contact_messages", () =>
  denied("anon", "insert into rallyo.contact_messages(name,contact,topic,message) values ('Bot','bot@x.com','autre','message de test')"));
await t("anon ne peut pas modifier une cagnotte", () => denied("anon", `update rallyo.campaigns set raised_amount = 999999999 where id = '${C1}'`));

// ---------- 2. Fonctions publiques ----------
console.log("\n== 2. DÃ©tail d'une cagnotte ==");
await t("cagnotte active : agrÃ©gats corrects, aucun champ sensible", async () => {
  const r = await as("anon", "select * from public.rallyo_campaign_public($1)", [C1]);
  eq(r.length, 1, "nombre de lignes");
  eq(r[0].supporters, 3, "soutiens (la contribution en attente ne compte pas)");
  eq(r[0].owner_name, "Famille Kouassi", "organisateur");
  eq(r[0].goal_amount, 2500000, "objectif");
  eq(Object.keys(r[0]).some((k) => /phone|owner_id|email/i.test(k)), false, "colonnes sensibles absentes");
});
await t("cagnotte terminÃ©e : visible", async () => eq((await as("anon", "select * from public.rallyo_campaign_public($1)", [C3])).length, 1, "lignes"));
await t("brouillon : invisible", async () => eq((await as("anon", "select * from public.rallyo_campaign_public($1)", [C2])).length, 0, "lignes"));
await t("identifiant inconnu : aucune ligne", async () =>
  eq((await as("anon", "select * from public.rallyo_campaign_public($1)", ["99999999-9999-9999-9999-999999999999"])).length, 0, "lignes"));

console.log("\n== 3. DÃ©tail d'un Ã©vÃ¨nement ==");
await t("Ã©vÃ¨nement publiÃ© : billets restants = 100 - 3 valides - 1 utilisÃ© = 96", async () => {
  const r = await as("anon", "select * from public.rallyo_event_public($1)", [E1]);
  eq(r.length, 1, "lignes");
  eq(r[0].tickets_left, 96, "billets restants (annulÃ© non comptÃ©)");
  eq(r[0].ticket_price, 5000, "prix");
});
await t("Ã©vÃ¨nement non publiÃ© : invisible", async () => eq((await as("anon", "select * from public.rallyo_event_public($1)", [E2])).length, 0, "lignes"));

console.log("\n== 4. Galerie de la landing ==");
await t("ne renvoie que le contenu public en cours", async () => {
  const r = await as("anon", "select * from public.rallyo_showcase_popular()");
  const ids = r.map((x) => x.id);
  eq(ids.includes(C1), true, "cagnotte active prÃ©sente");
  eq(ids.includes(E1), true, "Ã©vÃ¨nement publiÃ© prÃ©sent");
  eq(ids.includes(C2), false, "brouillon absent");
  eq(ids.includes(C3), false, "cagnotte terminÃ©e absente");
  eq(ids.includes(C4), false, "cagnotte expirÃ©e absente");
  eq(ids.includes(E2), false, "Ã©vÃ¨nement non publiÃ© absent");
});
await t("triÃ©e par popularitÃ© dÃ©croissante", async () => {
  const r = await as("anon", "select * from public.rallyo_showcase_popular()");
  const pops = r.map((x) => Number(x.popularity));
  eq(pops, [...pops].sort((a, b) => b - a), "ordre");
});
await t("progression de la cagnotte = 67 %", async () => {
  const r = await as("anon", "select * from public.rallyo_showcase_popular()");
  eq(r.find((x) => x.id === C1).progress_pct, 67, "progress_pct");
});
await t("max_items bornÃ© : 1 â†’ 1 ligne ; 999 â†’ au plus 13 ; 0 â†’ au moins 1", async () => {
  eq((await as("anon", "select * from public.rallyo_showcase_popular(1)")).length, 1, "max_items=1");
  eq((await as("anon", "select * from public.rallyo_showcase_popular(999)")).length <= 13, true, "max_items=999");
  eq((await as("anon", "select * from public.rallyo_showcase_popular(0)")).length >= 1, true, "max_items=0");
});

console.log("\n== 5. Sitemap ==");
await t("cagnottes actives ou terminÃ©es et Ã©vÃ¨nements publiÃ©s uniquement", async () => {
  const r = await as("anon", "select * from public.rallyo_sitemap_entries()");
  const ids = r.map((x) => x.id);
  eq([C1, C3, C4, E1].every((i) => ids.includes(i)), true, "contenu public prÃ©sent");
  eq([C2, E2].some((i) => ids.includes(i)), false, "brouillon et non publiÃ© absents");
  eq(Object.keys(r[0]).sort(), ["created_at", "id", "kind"], "colonnes");
});

// ---------- 6. Formulaire de contact ----------
console.log("\n== 6. Formulaire de contact ==");
const submit = (n, c, tp, m) => as("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", [n, c, tp, m]);
await t("message valide enregistrÃ©, texte nettoyÃ©, statut Â« new Â»", async () => {
  await submit("  AÃ¯cha  ", " aicha@example.com ", "paiement", "  Bonjour, j'ai un souci de paiement.  ");
  const r = (await db.query("select name, contact, topic, message, status from rallyo.contact_messages")).rows;
  eq(r.length, 1, "lignes");
  eq(r[0], { name: "AÃ¯cha", contact: "aicha@example.com", topic: "paiement", message: "Bonjour, j'ai un souci de paiement.", status: "new" }, "contenu");
});
await t("nom trop court â†’ invalid_input", () => raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["A", "a@x.com", "autre", "message assez long"], "invalid_input"));
await t("sujet inconnu â†’ invalid_input", () => raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Alice", "a@x.com", "piratage", "message assez long"], "invalid_input"));
await t("message trop court â†’ invalid_input", () => raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Alice", "a@x.com", "autre", "court"], "invalid_input"));
await t("message trop long (2 001 car.) â†’ invalid_input", () => raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Alice", "a@x.com", "autre", "x".repeat(2001)], "invalid_input"));
await t("valeurs nulles â†’ invalid_input (pas de plantage)", () => raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", [null, null, null, null], "invalid_input"));
await t("rien n'est enregistrÃ© par les envois invalides", async () => eq((await db.query("select count(*)::int as n from rallyo.contact_messages")).rows[0].n, 1, "lignes"));
await t("limite par contact : 5 acceptÃ©s puis rate_limited (insensible Ã  la casse)", async () => {
  for (let i = 0; i < 4; i++) await submit("Bob", i % 2 ? "BOB@x.com" : "bob@x.com", "autre", `message numÃ©ro ${i} pour Bob`);
  await submit("Bob", "Bob@X.com", "autre", "cinquiÃ¨me message de Bob");
  await raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Bob", "bob@x.com", "autre", "sixiÃ¨me message de Bob"], "rate_limited");
});
await t("limite globale : 100 messages / 10 min â†’ rate_limited pour tout le monde", async () => {
  await db.exec(`insert into rallyo.contact_messages(name, contact, topic, message)
                 select 'Spam', 'spam' || g || '@x.com', 'autre', 'message de remplissage ' || g from generate_series(1, 100) g`);
  await raises("anon", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Carla", "carla@x.com", "autre", "un message lÃ©gitime"], "rate_limited");
});
await t("authenticated peut aussi envoyer (aprÃ¨s vidage)", async () => {
  await db.exec("delete from rallyo.contact_messages");
  await as("authenticated", "select public.rallyo_contact_submit($1,$2,$3,$4)", ["Dina", "dina@x.com", "compte", "question sur mon compte"]);
});

// ---------- 7. Configuration de sÃ©curitÃ© ----------
console.log("\n== 7. Configuration de sÃ©curitÃ© ==");
await t("5 fonctions SECURITY DEFINER avec search_path vide", async () => {
  const r = (await db.query(`select p.proname, p.prosecdef, p.proconfig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                              where n.nspname = 'public' and p.proname like 'rallyo\\_%' order by 1`)).rows;
  eq(r.length, 5, "nombre de fonctions");
  for (const f of r) {
    eq(f.prosecdef, true, `${f.proname} security definer`);
    eq((f.proconfig ?? []).some((c) => /^search_path=("")?$/.test(c) || c === 'search_path=""'), true, `${f.proname} search_path vide (${JSON.stringify(f.proconfig)})`);
  }
});
await t("EXECUTE retirÃ© Ã  PUBLIC, accordÃ© Ã  anon et authenticated", async () => {
  const fns = ["rallyo_campaign_public(uuid)", "rallyo_event_public(uuid)", "rallyo_showcase_popular(int)", "rallyo_sitemap_entries(int)", "rallyo_contact_submit(text,text,text,text)"];
  for (const fn of fns) {
    const r = (await db.query(`select has_function_privilege('anon','public.${fn}','execute') a, has_function_privilege('authenticated','public.${fn}','execute') b,
                                      has_function_privilege('stranger','public.${fn}','execute') c`)).rows[0];
    eq([r.a, r.b, r.c], [true, true, false], `${fn} (anon, authenticated, rÃ´le quelconque)`);
  }
});
await t("RLS activÃ©e sur les 5 tables mÃ©tier + contact ; 10 politiques", async () => {
  const r = (await db.query(`select c.relname, c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace
                              where n.nspname = 'rallyo' and c.relkind = 'r' order by 1`)).rows;
  eq(r.every((x) => x.relrowsecurity), true, `RLS sur ${r.map((x) => x.relname).join(", ")}`);
  eq((await db.query("select count(*)::int n from pg_policies where schemaname = 'rallyo'")).rows[0].n, 10, "nombre de politiques");
});
await t("aucun droit de table pour anon / authenticated dans le schÃ©ma rallyo", async () => {
  const r = (await db.query(`select grantee, table_name, privilege_type from information_schema.role_table_grants
                              where table_schema = 'rallyo' and grantee in ('anon','authenticated','PUBLIC')`)).rows;
  eq(r, [], "droits rÃ©siduels");
});
await t("contraintes : sujet invalide refusÃ© mÃªme en insertion directe", async () => {
  let msg = "";
  try {
    await db.exec("insert into rallyo.contact_messages(name,contact,topic,message) values ('Zed','z@x.com','nimporte','message de test ok')");
  } catch (e) {
    msg = e.message;
  }
  eq(/check constraint|violates/i.test(msg), true, `contrainte CHECK (${msg || "aucune erreur"})`);
});
await t("rejouer 0002 Ã  0005 est sans danger (create or replace)", async () => {
  for (const f of fs.readdirSync(dir).filter((x) => /^000[2-5]/.test(x)).sort()) await db.exec(fs.readFileSync(path.join(dir, f), "utf8").replace(/create table rallyo\.contact_messages[\s\S]*?\);\n/, "").replace(/create index [^;]*;/g, "").replace(/alter table[^;]*;/g, "").replace(/revoke all on rallyo[^;]*;/g, ""));
});

console.log(`\n== RÃ©sultat : ${pass} rÃ©ussis, ${fail} Ã©chec(s) ==`);
process.exit(fail === 0 ? 0 : 1);

