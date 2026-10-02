import fs from "node:fs";

const out = [];
const edit = (file, fn) => {
  const before = fs.readFileSync(file, "utf8");
  const after = fn(before);
  fs.writeFileSync(file, after, "utf8");
  out.push(`${after !== before ? "OK   " : "RIEN "} ${file}`);
};
const sub = (t, re, str, label) => {
  const next = t.replace(re, () => str);
  out.push(`   ${next !== t ? "ok  " : "RIEN"} ${label}`);
  return next;
};

// ============ CODE : textes publics ============
edit("src/lib/site-data.ts", (t) => {
  t = sub(
    t,
    /^[ \t]*\{ n: "04", title: "Retire ou scanne".*$/m,
    `  { n: "04", title: "Reçois ou scanne", text: "Une fois la collecte terminée, le solde éligible est versé sur ton Mobile Money. Pour une billetterie, scanne les QR codes à l’entrée de ton évènement.", bg: IMAGES.step4Bg },`,
    "étape 04",
  );
  t = sub(
    t,
    /^[ \t]*\{ title: "Retire tes fonds".*$/m,
    `  { title: "Reçois tes fonds", text: "À la fin de la collecte, le solde éligible est versé via notre prestataire de paiement. Besoin d’une partie avant ? Fais une demande de retrait anticipé : elle est examinée avant tout versement." },`,
    "parcours cagnotte étape 5",
  );
  t = sub(
    t,
    /^[ \t]*\{ title: "Publie la billetterie".*$/m,
    `  { title: "Publie la billetterie", text: "Ta page est en ligne, avec le nombre de billets restants. Tu choisis le versement : direct, ou différé jusqu’à une date ou une condition." },`,
    "parcours billetterie étape 2",
  );
  t = sub(
    t,
    /^[ \t]*\{ title: "Suis tes ventes".*$/m,
    `  { title: "Suis tes ventes", text: "Billets vendus, entrées validées, recettes réservées ou versées, en temps réel." },`,
    "parcours billetterie étape 5",
  );
  t = sub(
    t,
    /\{ q: "Que se passe-t-il si l.objectif n.est pas atteint \?".*$/m,
    `{ q: "Que se passe-t-il à la fin d’une cagnotte ?", a: "Les contributions sont réservées jusqu’à la fin de la période ou jusqu’à l’atteinte de l’objectif. Une fois la cagnotte terminée, le solde éligible peut être retiré selon les règles de la cagnotte. Les conditions précises seront détaillées dans nos conditions d’utilisation." },`,
    "FAQ fin de cagnotte",
  );
  t = sub(
    t,
    /\{ q: "Comment retirer mes fonds \?".*$/m,
    `{ q: "Comment retirer mes fonds ?", a: "Pour une cagnotte, les fonds sont réservés jusqu’à la fin de la période ou jusqu’à l’atteinte de l’objectif, puis le solde éligible peut être retiré vers ton Mobile Money ou ton compte bancaire, après vérification de ton identité. Si tu as besoin d’une partie des fonds avant, tu peux faire une demande de retrait anticipé : elle est examinée avant tout versement. Pour une billetterie, tu choisis un versement direct ou différé." },`,
    "FAQ retirer mes fonds",
  );
  t = sub(
    t,
    /\{ q: "Combien coûte Rallyo \?".*$/m,
    `{ q: "Combien coûte Rallyo ?", a: "L’inscription est gratuite. Rallyo prélève une commission uniquement sur ce que tu collectes, avec un taux dégressif : " + FEE_MAX_RATE + " % sur les premières tranches, jusqu’à " + FEE_MIN_RATE + " % sur les grosses collectes. Aucun frais n’est ajouté pour ceux qui paient ou donnent : le prix du billet ou le don reste le même. Détails et simulateur sur la page Tarifs." },`,
    "FAQ combien coûte Rallyo",
  );
  t = sub(
    t,
    /^[ \t]*\{ icon: "badge-check", title: "Organisateurs vérifiés".*$/m,
    `  { icon: "badge-check", title: "Fonds réservés, retraits contrôlés", text: "Les fonds d’une cagnotte restent réservés jusqu’à la fin de la collecte ou l’atteinte de l’objectif. Un retrait anticipé est examiné avant tout versement, et une vérification d’identité est demandée." },`,
    "carte confiance fonds réservés",
  );
  const n = (t.match(/"Frais du prestataire Mobile Money en sus"/g) || []).length;
  t = t.replace(/"Frais du prestataire Mobile Money en sus"/g, '"Aucun frais ajouté pour ceux qui paient ou donnent"');
  out.push(`   ${n === 2 ? "ok  " : "ATTENTION"} cartes tarifs : ${n} occurrence(s) remplacée(s) (2 attendues)`);
  return t;
});

edit("src/app/(site)/tarifs/page.tsx", (t) =>
  sub(
    t,
    /Les frais du prestataire Mobile Money \(opérateur ou agrégateur\)\s+s’ajoutent à la commission Rallyo et varient selon le moyen de paiement\./,
    "Aucun frais n’est ajouté au prix payé par l’acheteur ni au don : la commission est prélevée sur les sommes collectées. Les frais éventuels du prestataire de paiement (opérateur Mobile Money) seront précisés avant l’ouverture.",
    "note page Tarifs",
  ),
);

edit("src/components/site/fee-calculator.tsx", (t) =>
  sub(
    t,
    /Estimation hors frais du prestataire de paiement Mobile Money,\s+qui varient selon l’opérateur\./,
    "Aucun frais n’est ajouté pour l’acheteur ou le donateur. Les frais éventuels du prestataire de paiement (opérateur Mobile Money) seront précisés avant l’ouverture.",
    "note simulateur",
  ),
);

// ============ DOCS ============
edit("docs/CAHIER_DES_CHARGES.md", (t) => {
  t = sub(
    t,
    /^9\. \*\*Réécrire les textes publics\*\*.*$/m,
    "9. ✅ **Textes publics réécrits le 2026-10-02** (FAQ, étape 04, parcours cagnotte et billetterie, carte « Fonds réservés ») selon le §10. À relire dès que les règles encore ouvertes (§16) seront tranchées.",
    "§7 point 9",
  );
  t = sub(
    t,
    /^10\. \*\*Qui supporte les frais\*\*.*$/m,
    "10. ✅ **Frais tranchés** : aucun frais ajouté à l'acheteur ni au contributeur (§16). **Reste à préciser :** le traitement des frais du prestataire Mobile Money (déduits de la commission ou à la charge de l'organisateur).",
    "§7 point 10",
  );
  t = sub(
    t,
    /\(ex\. 2 × Standard 10 000 F, frais 500 F, \*\*total 10 500 F\*\*\)/,
    "(ex. 2 × Standard à 5 000 F : **total 10 000 F, aucun frais ajouté**)",
    "§13.4 exemple",
  );
  t = sub(
    t,
    /^- ❓ \*\*Qui supporte les frais \?\*\*.*$/m,
    "- ✅ **Frais : aucun frais n'est ajouté à l'acheteur ni au contributeur** (décision du 2026-10-02 ; l'exemple « Frais 500 F » du document est écarté). La commission Rallyo (§6) est **prélevée sur les sommes collectées**, côté organisateur. ❓ Reste à préciser le traitement des frais du prestataire Mobile Money.",
    "§16 frais",
  );
  t = sub(
    t,
    /^\| \*\*Frais\*\* \|.*$/m,
    "| **Frais** | Commission déduite de l'organisateur | **Même principe : aucun frais ajouté à l'acheteur** (l'exemple « Frais 500 F » est écarté) | Aucun changement de `fees.ts` ; les récapitulatifs de paiement affichent exactement le prix du billet ou le montant du don |",
    "§18 frais",
  );
  t = sub(
    t,
    /^\| \*\*Textes publics\*\* \|.*$/m,
    "| **Textes publics** | ✅ Réécrits le 2026-10-02 : FAQ « fin d'une cagnotte » et « retirer mes fonds », étape 04, parcours cagnotte et billetterie, carte « Fonds réservés, retraits contrôlés », cartes et notes de tarifs | Fonds réservés jusqu'à la fin ou à l'objectif, retrait anticipé contrôlé, aucun frais ajouté | À relire quand les décisions ouvertes du §16 seront prises |",
    "§18 textes publics",
  );
  const rows = [...t.matchAll(/^\| 2026-10-02 \|.*$/gm)];
  if (rows.length) {
    const last = rows[rows.length - 1];
    const end = last.index + last[0].length;
    t =
      t.slice(0, end) +
      "\n| 2026-10-02 | ✅ **Aucun frais ajouté à l'acheteur ni au contributeur** (l'exemple « Frais 500 F » est écarté) ; la commission est prélevée sur les sommes collectées |" +
      t.slice(end);
    out.push("   ok   §8 décision frais");
  }
  return t;
});

edit("docs/JOURNAL.md", (t) => {
  t = sub(t, /, \*\*qui supporte les frais\*\*/, "", "journal : retire « qui supporte les frais » des décisions ouvertes");
  t = sub(t, /^11\. \*\*Réécrire les textes publics\*\*.*$/m, "11. ✅ **Textes publics réécrits** (2026-10-02). À relire quand les règles ouvertes du §16 seront tranchées.", "journal : item 11");
  t = sub(t, /^- \*\*Textes publics en décalage :\*\*.*\r?\n/m, "", "journal : retire l'alerte textes");
  t = sub(t, /^- \*\*Frais :\*\* grille actuelle.*\r?\n/m, "", "journal : retire l'alerte frais");
  const marker = "## 2. Journal chronologique (le plus récent en haut)\n";
  const entry =
    "\n### 2026-10-02 — Frais tranchés et textes publics corrigés\n" +
    "**Décision :** **aucun frais ajouté à l'acheteur ni au contributeur** (exemple « Frais 500 F » du document écarté). La commission (grille 10 % → 3 %) reste prélevée sur les sommes collectées.\n\n" +
    "**Docs :** cahier §7 (points 9 et 10), §13.4 (exemple : 2 × 5 000 F = 10 000 F), §16, §18, §8 ; journal (décisions ouvertes, alertes résolues).\n\n" +
    "**Code (textes publics)**\n" +
    "- `site-data.ts` : étape 04 « Reçois ou scanne » ; parcours cagnotte (« Reçois tes fonds », retrait anticipé examiné) ; parcours billetterie (versement direct ou différé, recettes réservées ou versées) ; FAQ « Que se passe-t-il à la fin d'une cagnotte ? », « Comment retirer mes fonds ? », « Combien coûte Rallyo ? » ; carte « Fonds réservés, retraits contrôlés » ; cartes Tarifs (« Aucun frais ajouté pour ceux qui paient ou donnent »).\n" +
    "- `tarifs/page.tsx` et `fee-calculator.tsx` : notes alignées (aucun frais ajouté à l'acheteur).\n" +
    "- L'appli (`/app`) n'ajoutait déjà aucun frais : rien à changer côté paiement.\n\n" +
    "**Reste ouvert :** frais du prestataire Mobile Money (qui les supporte ?), et les décisions du §16 (pays, qui organise, objectif non atteint ou dépassé, versement différé, plafond du retrait anticipé, slogan). Les textes publics ne promettent rien sur ces points.\n";
  if (t.includes(marker)) {
    t = t.replace(marker, () => marker + entry);
    out.push("   ok   journal : entrée chronologique");
  } else out.push("   RIEN journal : marqueur");
  return t;
});

console.log(out.join("\n"));
