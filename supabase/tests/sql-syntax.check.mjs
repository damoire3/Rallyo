// Contrôle de syntaxe SQL avec l'analyseur officiel de PostgreSQL (libpg-query).
// Utilisation : npm i libpg-query (dans un dossier temporaire, type: module), puis : node sql-syntax.check.mjs <chemin\vers\supabase\migrations>
import fs from "node:fs";
import path from "node:path";
import * as pg from "libpg-query";

const dir = process.argv[2];
if (pg.loadModule) await pg.loadModule();
const parse = pg.parseSync ?? pg.parse;
const parsePl = pg.parsePlPgSQLSync ?? pg.parsePlPgSQL;
console.log("API libpg-query :", Object.keys(pg).join(", "), "\n");

let failures = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
  const sql = fs.readFileSync(path.join(dir, f), "utf8");
  try {
    const ast = await parse(sql);
    const stmts = ast.stmts ?? [];
    const kinds = {};
    for (const s of stmts) {
      const k = Object.keys(s.stmt ?? {})[0] ?? "?";
      kinds[k] = (kinds[k] ?? 0) + 1;
    }
    // Corps plpgsql : le premier passage ne lit pas l'intÃ©rieur de $$ ... $$, on les contrÃ´le sÃ©parÃ©ment.
    let plNote = "";
    const fnRe = /create\s+(?:or\s+replace\s+)?function[\s\S]*?language\s+plpgsql[\s\S]*?\$\$[\s\S]*?\$\$\s*;/gi;
    for (const m of sql.match(fnRe) ?? []) {
      try {
        await parsePl(m);
        plNote += " Â· corps plpgsql OK";
      } catch (e) {
        failures++;
        plNote += ` Â· corps plpgsql ERREUR : ${e.message}`;
      }
    }
    console.log(`OK     ${f} : ${stmts.length} instructions (${Object.entries(kinds).map(([k, v]) => `${k.replace("Stmt", "")}Ã—${v}`).join(", ")})${plNote}`);
  } catch (e) {
    failures++;
    console.log(`ERREUR ${f} : ${e.message}${e.cursorPosition ? ` (position ${e.cursorPosition})` : ""}`);
  }
}
console.log(failures === 0 ? "\nAucune erreur de syntaxe." : `\n${failures} erreur(s).`);
process.exit(failures === 0 ? 0 : 1);

