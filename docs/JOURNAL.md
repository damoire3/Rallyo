# Rallyo — Journal de bord

> Mis à jour à chaque étape. Dernière mise à jour : **2026-10-02** (après Hero v2 & vitrine)
> Légende : ✅ fait · 🔄 en cours · ⏳ à faire · ⚠️ point d'attention

**Projet :** `C:\Users\HP\Desktop\Arbre\Mes saas\rallyo-next` — voir `CAHIER_DES_CHARGES.md`
**Lancer :** `npm run dev` puis http://localhost:3000 (landing) et http://localhost:3000/app (appli)

---

## 1. Tableau de bord

### 🔄 En cours
- **Landing page + pages vitrine** (étape 9 / 10 : build et vérifications)
- **Hero v2 + galerie « Ça se passe chez nous » branchée au back** : code écrit, `tsc` et `build` OK ; **reste le contrôle visuel desktop/mobile** puis commit (entrée du 2026-10-02 « Hero v2 & vitrine »). ⚠️ Fichiers touchés : `home-sections.tsx` (Hero, GalleryStrip), `site.css`, `page.tsx`, `src/lib/showcase.ts`, `src/components/site/showcase.tsx`, `supabase/migrations/0002_showcase.sql`. **Merci de ne pas modifier ces fichiers en parallèle sans prévenir.**

### ✅ Fait
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
- Brancher les pages de détail `/app/cagnottes/[id]` et `/app/evenements/[id]` sur Supabase (la vitrine de la landing y renvoie déjà avec les vrais ids) + `sitemap.ts` sur les vraies données
- Appliquer `0002_showcase.sql` sur le projet Supabase et renseigner `.env.local` (voir `.env.example`)

### ⚠️ Points d'attention
- Vitrine de la landing : tant que le détail n'est pas branché à Supabase, un clic sur un vrai évènement/cagnotte mène à une 404 (voir entrée « Hero v2 & vitrine »)
- `NODE_ENV=production` est défini sur la machine : à supprimer dans les variables d'environnement Windows
- Node 25 n'est pas une version LTS
- Les anciens dossiers `rallyo-app` et `rallyo-pwa` sont peut-être des doublons (non supprimés, en attente de ton accord)
- Affirmations de la landing à valider : voir section 7 du cahier des charges

---

## 2. Journal chronologique (le plus récent en haut)

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
- ⚠️ Les cartes réelles pointent vers `/app/cagnottes/{id}` et `/app/evenements/{id}`, mais ces pages lisent encore `src/lib/data.ts` (démo, ids `c1`, `e1`…) : un clic sur un vrai évènement donnera une 404 tant que le détail n'est pas branché à Supabase.
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
