# Rallyo — Journal de bord

> Mis à jour à chaque étape. Dernière mise à jour : **2026-10-02** (après intégration des spécifications V1)
> Légende : ✅ fait · 🔄 en cours · ⏳ à faire · ⚠️ point d'attention

**Projet :** `C:\Users\HP\Desktop\Arbre\Mes saas\rallyo-next` — voir `CAHIER_DES_CHARGES.md`
**Lancer :** `npm run dev` puis http://localhost:3000 (landing) et http://localhost:3000/app (appli)

---

## 1. Tableau de bord

### 🔄 En cours
- **Contrôle visuel** et **build** de l'ensemble (icônes Lucide + grille de frais) : à faire. Les icônes Lucide (site-icon, icon.tsx, home-sections, securite, pourquoi-rallyo, site.css) sont faites mais **non commitées**.
- **Contrôle visuel** (desktop + mobile) du hero v2 et de la galerie, avec `npm run dev` — personne ne l'a encore fait dans un navigateur.
- **Landing page + pages vitrine** (étape 9 / 10 : build et vérifications)

### ✅ Fait
- Détails cagnotte / évènement / paiement branchés sur Supabase (démo d'abord, UUID ensuite) — `repo.ts`, migration `0003`
- Hero v2 (pop-ups à droite) + galerie « Ça se passe chez nous » : cartes-billets branchées au back, 13 max, popularité, repli photos — migration `0002`
- Dossier projet créé, Next.js 15.5.26 + React 19.1.0 + Tailwind 4 + TypeScript 5.8 installés
- Contournement du problème `NODE_ENV=production` (fichier `.npmrc` du projet)
- Manifest PWA + icônes du prototype
- Schéma de base de données Supabase (`supabase/migrations/0001_init.sql`)
- Appli portée en 9 routes (accueil, explorer, créer, billets, profil, détail cagnotte, détail évènement, paiement, connexion)
- Aperçu de partage (Open Graph) vérifié sur les pages de détail
- Build de production validé, 3 commits git
- Appli déplacée sous `/app` (dossiers + tous les liens mis à jour)
- GSAP installé (animations de la landing)
- Cahier des charges et journal créés

### ⏳ À faire — Landing (prochaines étapes, dans l'ordre)
1. ✅ Layout de l'appli `/app` avec cadre téléphone
2. ✅ Styles de la landing (`src/app/(site)/site.css`, isolés sous `.site`) + polices branchées
3. ✅ Données de contenu (`src/lib/site-data.ts` : images, FAQ, étapes, tarifs, comparatif...)
4. ✅ Composants (`src/components/site/`) : décor graffiti, scène, curseur, animations GSAP, navigation, pied de page, carte inclinable, compteur
5. ✅ **Démo interactive** de l'appli dans un téléphone (iframe vers `/app`) — `phone-demo.tsx`
6. ✅ Sections de l'accueil (hero, bandeau, mur, pourquoi, chiffres, étapes, cas d'usage, galerie, confiance, tarifs, FAQ, CTA)
7. ✅ Pages : `/comment-ca-marche`, `/pourquoi-rallyo`, `/tarifs` (+ simulateur de frais), `/securite`, `/faq` (+ données structurées)
8. ✅ `sitemap.xml` et `robots.txt`
9. 🔄 Build, tests (pages, liens, aperçus), correction des erreurs
10. Commit git + mise à jour du journal

### ⏳ À faire — Produit (après la landing)
- Créer le projet Supabase, appliquer le schéma, brancher l'authentification (téléphone OTP + email)
- Remplacer les données de démonstration (`src/lib/data.ts`) par les vraies données
- Choisir l'agrégateur Mobile Money et brancher le paiement (routes serveur + webhooks)
- Vrai QR code pour les billets + scan à l'entrée
- Formulaire de création réel (images, validation)
- Mentions légales, CGU, confidentialité
- Remplacer les images Unsplash
- Déploiement (Vercel ou autre) + nom de domaine
- Passer sur Node 22 LTS
- Appliquer `0002_showcase.sql`, `0003_public_detail.sql` **et** `0004_sitemap.sql` sur le projet Supabase et renseigner `.env.local` (voir `.env.example`)
- Paiement : la page lit désormais les vraies données, mais le paiement lui-même reste simulé (agrégateur à choisir)

### ⏳ À faire — Spécifications V1 (cahier des charges §9 à 18)
Ordre **proposé** :
1. **Valider les décisions ouvertes** (§16) : pays, dépassement de l'objectif, versement différé, plafond du retrait anticipé, frais du prestataire Mobile Money, slogan. *(Tranchés le 2026-10-02 : qui supporte les frais, objectif non atteint, qui organise.)*
2. **Choisir le prestataire de paiement** et vérifier le cadre BCEAO / UMOA (§17).
3. **Refonte du layout `/app` en web responsive** (1440 / 768 / 390 px) ; le cadre téléphone ne reste que pour la démo de la landing.
4. **Évolution du schéma Supabase** (migration `0005`+) : `ticket_types`, `orders`, `order_items`, `withdrawals`, `payout_accounts`, `campaign_updates`, `favorites`, `notifications`, `reports`, `refunds` ; statuts étendus de cagnotte et d'évènement ; champs acheteur invité ; profil public d'organisateur ; **vérification d'identité et moyen de réception de l'organisateur** (`organizer_verifications`, `payout_accounts`).
5. **Parcours A** : achat sans compte, catégories de billets, billet par lien, QR vérifié côté serveur.
6. **Parcours B** : assistant de création en 5 étapes, gestion de cagnotte (5 onglets), retrait anticipé et suivi, écran « objectif atteint ».
7. **Parcours C** : espace organisateur, statistiques, contrôle des entrées.
8. **Authentification** : inscription, OTP, mot de passe oublié ; **inscription organisateur (identité + moyen de réception, §10.9)**.
9. **Détailler les 63 écrans non décrits** (sections E à H : 22 + 8 + 15 + 18).
10. **Back-office** (18 écrans).
11. **Réécrire les textes publics** (FAQ, `/securite`, `/comment-ca-marche`) selon les règles de fonds validées.
12. **Maquettes Figma** selon la structure du §15.

### ⚠️ Points d'attention
- **Textes publics en décalage :** la FAQ, `/securite` et `/comment-ca-marche` décrivent un retrait libre des fonds, incompatible avec le modèle « fonds réservés + retrait anticipé contrôlé » (§10). À réécrire après validation des règles.
- **Format :** le cahier demande un site web responsive ; le code actuel est une PWA dans un cadre de téléphone (§18).
$1
- **Pièces d'identité des organisateurs :** données sensibles (§10.9). Stockage privé, accès restreint, durée de conservation et cadre légal à définir **avant** de collecter la moindre pièce.
- Les éléments **réglementaires (BCEAO) et concurrentiels** cités dans le document source n'ont **pas été vérifiés** (§17).
- Un lien vers un id inexistant (ou une cagnotte non publique) donne bien une 404 ; sans Supabase configuré, seuls les ids de démo (`c1`, `e1`…) fonctionnent
- `NODE_ENV=production` est défini sur la machine : à supprimer dans les variables d'environnement Windows
- Node 25 n'est pas une version LTS
- Les anciens dossiers `rallyo-app` et `rallyo-pwa` sont peut-être des doublons (non supprimés, en attente de ton accord)
- Affirmations de la landing à valider : voir section 7 du cahier des charges

---

## 2. Journal chronologique (le plus récent en haut)

### 2026-10-02 — « Une carte comme sur Paykko » : précisé
**Réponse :** les deux : **identité** et **moyen de recevoir l'argent**.

- Décision organisateur passée de 🟡 à ✅ : toute personne avec un compte, qui enregistre ses informations, une **pièce d'identité** et un **moyen de réception** (carte bancaire ou compte Mobile Money).
- Nouveau **§10.9** du cahier : onboarding de l'organisateur, statuts de vérification, et conception : la carte est **enregistrée chez le prestataire** (jeton), pas chez Rallyo, pour rester cohérent avec « aucune donnée bancaire stockée ».
- Ajouts : §7 point 12 (protection des données), §18 (profil organisateur : `organizer_verifications`, bucket privé, `payout_accounts`), §8, §16.
- **Reste ouvert :** moment de l'enregistrement (compte, première publication ou premier versement), publication non vérifiée visible ou bloquée, même exigence pour les cagnottes ?
- Paykko n'a toujours pas été identifié : la décision ne dépend plus de cette référence.
- Aucun code modifié.

### 2026-10-02 — Trois décisions enregistrées
| Question | Décision |
|---|---|
| Qui supporte les frais ? | ✅ **L'organisateur** : commission déduite de ses recettes. Aucun changement de `fees.ts`. L'exemple d'achat du document source (frais ajoutés à l'acheteur) est écarté. |
| Cagnotte qui n'atteint pas son objectif | ✅ **Le créateur garde tout ce qui a été collecté.** Le texte actuel de la FAQ va déjà dans ce sens. |
| Qui peut organiser un évènement | 🟡 **Toute personne avec un compte**, qui enregistre ses informations et « une carte comme sur Paykko ». |

**Point bloquant :** « une carte comme sur Paykko » n'est pas clair. Recherche web : **Paykko n'a pas été identifié** (aucun résultat pertinent). La nature de la carte (pièce d'identité, carte bancaire, carte Mobile Money) change le parcours et les obligations de vérification : question posée au porteur.

Mis à jour dans le cahier : §7 (points 2 et 10), §9.1, §10.2, §13.4, §16, §18, §8. Aucun code modifié.

### 2026-10-02 — Spécifications V1 intégrées au cahier des charges
**Demande :** ajouter au cahier des charges les documents « Architecture complète de l'application » et « Rallyo — architecture définitive V1 ».

**Fait**
- `docs/CAHIER_DES_CHARGES.md` : **sections 9 à 18** ajoutées : architecture (5 espaces, navigation, droits visiteur / compte) · règles de fonds (cagnottes, billetterie, retrait anticipé, indicateurs, remboursements, états, sécurité du billet) · parcours A/B/C · **inventaire des 119 écrans** (détail des sections A à D, 56 écrans) · contenu des pages clés · modales et états · structure Figma · décisions à figer · conformité · écarts avec le code.
- Retouches ciblées des sections existantes : pointeur au §3, §3.3 (remboursements, portefeuille), §7 (points 2 et 8 à 11), §8 (5 décisions), numérotation 10.8.
- Chaque affirmation est marquée ✅ (choix du porteur), 🟡 (proposition) ou ❓ (ouvert).

**Constats**
- 4 décisions sont déjà prises : web responsive, achat sans compte, pas de portefeuille Rallyo, fonds réservés avec retrait anticipé contrôlé.
- Le document ne tranche pas : pays, qui organise, objectif dépassé / non atteint, versement différé, **qui paie les frais**, slogan.
- Détail fourni pour 56 écrans sur 119 ; **63 écrans (sections E à H) restent à détailler**.
- Aucun code modifié dans cette entrée.

### 2026-10-02 — Grille de frais dégressive 10 % → 3 %
**Décision :** de 10 % à 3 %, même grille pour cagnottes et billetterie. **Tranches progressives** (choix de l'assistant : avec des seuils « tout ou rien », collecter 100 000 FCFA aurait coûté moins que 99 999).

| Part de la collecte | Taux |
|---|---|
| jusqu'à 100 000 FCFA | 10 % |
| 100 001 à 500 000 | 8 % |
| 500 001 à 1 000 000 | 6 % |
| 1 000 001 à 2 500 000 | 4 % |
| au-delà de 2 500 000 | 3 % |

**Fichiers**
- `src/lib/fees.ts` (nouveau) : `FEE_TIERS`, `computeFee()`, `tierLabel()`. Source unique, réutilisable côté serveur pour le calcul réel.
- `src/lib/site-data.ts` : cartes Tarifs (« 10 → 3 % dégressif »), FAQ « Combien coûte Rallyo ? » ; `FEE_RATES` supprimé.
- `src/components/site/fee-calculator.tsx` : montant **exact**, taux moyen réel, détail par tranche.
- `src/app/(site)/tarifs/page.tsx` : tableau des tranches + simulateur.
- `src/app/(site)/site.css` : 10 lignes ajoutées en fin de fichier (détail du simulateur).

**Vérifié :** `computeFee` testé à la main (0, 50 000, 99 999, 100 000, 500 000, 1 M, 2,5 M, 5 M, 10 M) et sur 6 millions de montants : **0 cas où la commission baisse quand le montant monte**. Valeurs : 100 000 → 10 000 ; 500 000 → 42 000 ; 5 000 000 → 207 000.

**⚠️ À savoir**
- Le taux **moyen** ne tombe jamais à 3 % : 4,1 % à 5 M FCFA, 3,6 % à 10 M. Le 3 % ne s'applique qu'à la tranche au-delà de 2,5 M.
- Taux intermédiaires (8 / 6 / 4 %) et seuils proposés par l'assistant, à valider ; modifiables dans `FEE_TIERS` uniquement.
- À 10 %, la billetterie égale le taux cité pour Tikerama (10 %, non vérifié) ; les petites cagnottes sont au double des 5 % cités pour leurs cotisations.
- Vérifier que 3 % couvre les frais Mobile Money.
- **Build validé** : `tsc` 0 erreur, `npm run build` OK (26 pages, icônes Lucide incluses). Serveur de production testé : `/tarifs` affiche la grille, 22 000 FCFA de commission pour 250 000 collectés (taux moyen 8,8 %), la FAQ ne contient plus les anciens taux ; `/`, `/app`, `/app/explorer`, `/securite`, `/pourquoi-rallyo`, `/comment-ca-marche` répondent 200.
- **Reste à faire : contrôle visuel dans un navigateur** (desktop + mobile), jamais fait.

### 2026-10-02 — Sitemap sur les vraies données
- `supabase/migrations/0004_sitemap.sql` — fonction `sitemap_entries(max_items)` (SECURITY DEFINER, id + type + date de création seulement, mêmes règles de visibilité que `0003`, 5 000 max).
- `src/app/sitemap.ts` — asynchrone, régénéré toutes les heures. **Règle :** si `NEXT_PUBLIC_SUPABASE_URL` et `..._ANON_KEY` sont renseignées → seules les vraies cagnottes / évènements sont listés (la démo n'est pas indexée en production) ; sinon → pages de démo (développement local).
- Vérifications : `tsc` OK, `build` OK (26 pages). Non testé contre une vraie base.
- ⚠️ `NEXT_PUBLIC_SITE_URL` ajouté à `.env.example` : à renseigner en production (sinon le sitemap pointe vers `http://localhost:3000`).

### 2026-10-02 — Pages de détail et paiement branchés sur Supabase
**Pourquoi :** les cartes réelles de la vitrine de la landing renvoyaient vers `/app/cagnottes/{uuid}` et `/app/evenements/{uuid}`, qui lisaient seulement les données de démo → 404.

**Fichiers créés**
- `supabase/migrations/0003_public_detail.sql` — fonctions `campaign_public(p_id)` et `event_public(p_id)` (`SECURITY DEFINER`, mêmes règles de visibilité que la RLS : cagnotte `active`/`completed`, évènement publié). Renvoient les agrégats (nombre de soutiens, billets restants) sans ouvrir la lecture de `contributions` ni `tickets`.
- `src/lib/supabase-rest.ts` — helper `rpc()` (timeout 3 s, ne lève jamais d'erreur) + `isUuid()`.
- `src/lib/repo.ts` — `getCagnotteAny(id)` / `getEventAny(id)` : démo d'abord (ids `c1`, `e1`…), puis Supabase si l'id est un UUID. **Mêmes types `Cagnotte` / `EventItem`** que la démo → aucune vue modifiée.

**Fichiers modifiés**
- `src/app/app/(flow)/cagnottes/[id]/page.tsx`, `evenements/[id]/page.tsx`, `paiement/page.tsx` — utilisent `repo.ts`. Cagnotte sans date limite : la phrase « Il reste N jours » devient « Cette cagnotte n'a pas de date limite ».
- `src/lib/showcase.ts` — utilise `rpc()`, exporte `gradientFor`.
- `.gitignore` — `.env.example` est maintenant versionné, `*.log` ignorés.

**Vérifications :** `tsc --noEmit` OK ; `npm run build` OK (26 pages, accueil en régénération toutes les minutes). Commit précédent : `5d13eef` (landing + hero v2 + vitrine).

**À savoir :** dates des évènements affichées en heure du Bénin (UTC+1). Non testé contre une vraie base (pas encore de projet Supabase) : à vérifier dès qu'il existera, en créant une cagnotte et un évènement de test puis en suivant les cartes de la galerie.

**Prochaine action :** contrôle visuel de la landing, puis création du projet Supabase.

### 2026-10-02 — Hero v2 & vitrine « Ça se passe chez nous » branchée au back
**Demande :** reprendre du prototype `rallyo-pw@` les pop-ups à droite et les textes « Rassemble. Célèbre. Soutiens. » / « Un seul geste pour rassembler ta communauté » ; remplacer la bande d'images sous « // L'énergie qu'on veut servir — Ça se passe chez nous » par le défilé de cartes-billets, relié au back (13 max, par popularité, photos tant qu'il n'y a rien).

**Fichiers créés**
- `supabase/migrations/0002_showcase.sql` — fonction `public.showcase_popular(max_items)` : évènements publiés à venir + cagnottes actives, score de popularité, 13 max. `SECURITY DEFINER` (n'expose que des agrégats), exécutable par `anon`.
- `src/lib/showcase.ts` — appel REST du back (timeout 3 s, cache 60 s, **jamais d'erreur levée**), règle de remplacement photos → réel, 12 cartes-photos d'illustration.
- `src/components/site/showcase.tsx` — carte-billet + défilé (2e série dupliquée, masquée aux lecteurs d'écran).
- `.env.example` — `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Fichiers modifiés**
- `src/components/site/home-sections.tsx` — `Hero` (2 colonnes + `HeroPopups`) et `GalleryStrip` (devenu asynchrone).
- `src/app/(site)/site.css` — styles hero v2, pop-ups, cartes-billets (`.show-*`, `.pop-*`), responsive mobile ; ancienne `.strip` supprimée.
- `src/app/(site)/page.tsx` — `revalidate = 60`.
- `docs/CAHIER_DES_CHARGES.md` — sections 3.2.1, 3.2.2 et décisions.

**Vérifications :** `tsc --noEmit` OK ; `npm run build` OK (26 pages). **Pas encore vérifié visuellement dans le navigateur** (voir à faire).

**À savoir pour l'équipe**
- Tant que `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` ne sont pas renseignées, la galerie affiche les photos : c'est le comportement voulu.
- Pour activer : créer le projet Supabase, exécuter `0001_init.sql` **puis** `0002_showcase.sql`, remplir `.env.local`.
- ✅ (corrigé dans l'entrée suivante « Pages de détail… ») Les cartes réelles pointent vers `/app/cagnottes/{id}` et `/app/evenements/{id}` ; ces pages lisaient d'abord uniquement la démo, ce qui donnait une 404 — désormais branchées sur Supabase.
- ⚠️ Les pop-ups du hero sont des données d'exemple (`EVENTS[0]`, `CAGNOTTES[0]`), étiquetées « Exemple ».
- Les photos d'illustration viennent d'Unsplash (même chantier « remplacer les images » que le reste du site).
- Le défilé ajuste sa vitesse au nombre de cartes ; 8 cartes minimum, 13 maximum.

**Prochaine action :** contrôle visuel desktop + mobile (`npm run dev`), puis commit.

### 2026-10-02 — Landing : pages dédiées et SEO (étapes 7 et 8)
- `/comment-ca-marche` : 3 parcours (cagnotte, billetterie, contributeur).
- `/pourquoi-rallyo` : constat, différence, comparatif (3 colonnes), publics visés.
- `/tarifs` : 3 offres + **simulateur de frais** + questions sur les frais.
- `/securite` : 6 engagements, moyens de paiement, FAQ sécurité.
- `/faq` : 15 questions en 5 catégories + données structurées `FAQPage` (Google).
- `sitemap.ts` et `robots.ts` (pages du site, appli, détails des cagnottes et évènements).
- Prochaine action : build de production et vérifications (pages, liens, démo iframe, aperçus).

### 2026-10-02 — Landing : composants et accueil (étapes 4 à 6)
- `src/components/site/` : `decor` (stickers, soulignés, scène), `cursor` (curseur spray, souris uniquement), `animations` (GSAP : apparitions, parallaxe, défilement horizontal épinglé), `nav` (avec **menu mobile**, absent avant), `footer` (vrais liens), `interactive` (carte inclinable, compteur), `phone-demo`, `fee-calculator`, `blocks` (FAQ, bandeau de page, appel à l'action), `home-sections` (12 sections).
- Accessibilité : animations coupées si « réduire les animations » est activé ; curseur personnalisé masqué sur écrans tactiles ; rien n'est caché en CSS (contenu visible sans JavaScript).
- `src/app/(site)/layout.tsx` (polices Space Grotesk, Bangers, Permanent Marker) et `page.tsx` (accueil, SEO, données structurées).
- Remplacé : avis inventés → scénarios illustratifs ; chiffres inventés → 0 FCFA, 5 min, 6 pays visés, 24/7.
- Prochaine action : pages `/comment-ca-marche`, `/pourquoi-rallyo`, `/tarifs`, `/securite`, `/faq`.

### 2026-10-02 — Landing : cadre, styles, contenu
- `src/app/app/layout.tsx` : cadre téléphone déplacé ici (plein écran sur mobile, cadre sur ordinateur).
- `src/app/(site)/site.css` : styles de la landing (305 lignes), isolés sous `.site`, avec les nouveaux blocs : menu mobile, démo téléphone, FAQ, comparatif, simulateur de frais, pages internes.
- `src/lib/site-data.ts` : tout le contenu (FAQ en 5 catégories, étapes des 3 parcours, comparatif, tarifs, cas d'usage).
- Prochaine action : composants (décor, scène, curseur, animations GSAP, navigation, pied de page).

### 2026-10-02 — Cahier des charges et journal
- Création de `docs/CAHIER_DES_CHARGES.md` et `docs/JOURNAL.md`.
- Engagement : ce journal est mis à jour après chaque action.

### 2026-10-02 — Landing : restructuration des routes
- Analyse de l'ancienne landing (projet Vite, 14 sections, GSAP, style graffiti).
- Constat : tarifs = tableau interne de pistes ; avis et chiffres inventés → à remplacer.
- Décision : landing sur `/`, appli sous `/app`.
- Dossiers `(app)` et `(flow)` déplacés sous `src/app/app/`, tous les liens corrigés (aucun oubli).
- `layout.tsx` racine allégé (le cadre téléphone en sera sorti).
- `gsap` installé.

### 2026-09-30 — Portage du design de l'appli
- 9 routes Next.js, composants partagés (icônes, carte « ticket », barre de navigation).
- Build OK (18 pages), aperçu de partage vérifié, paiement : 404 sur identifiant invalide, montant repris.
- Commit `feat: portage du design Rallyo en routes Next.js`.

### 2026-09-30 — Fondations
- Découverte du bug `NODE_ENV=production` (npm ignorait les outils de développement) → corrigé dans `.npmrc`.
- Next.js 15.5.26 / React 19.1.0 figés ; Turbopack retiré des scripts.
- Manifest PWA, icônes, schéma Supabase.
- Commits `chore: scaffold...` et `feat: manifest PWA, icones, schema Supabase initial`.
- Dossier `rallyo-next` choisi pour ne pas écraser l'ancien projet Vite présent dans `Rallyo`.
