# Rallyo — Journal de bord

> Mis à jour à chaque étape. Dernière mise à jour : **2026-10-03** (après checklist d'avancement)
> Légende : ✅ fait · 🔄 en cours · ⏳ à faire · ⚠️ point d'attention

**Projet :** `C:\Users\HP\Desktop\Arbre\Mes saas\rallyo-next` — voir `CAHIER_DES_CHARGES.md`
**Lancer :** `npm run dev` puis http://localhost:3000 (landing) et http://localhost:3000/app (appli)

---

## 0. Règle critique et checklist d'avancement

> **⚠️ RÈGLE CRITIQUE**
> Ce fichier doit être lu et mis à jour par **toute personne ou IA** qui intervient sur le projet.
> - **AVANT** de commencer : lire les dernières entrées + ajouter `🔄 EN COURS` (avec la liste des fichiers touchés)
> - **APRÈS** avoir terminé : passer l'entrée en `✅ TERMINÉ` ou `⚠️ INCOMPLET` (et dire ce qui reste)
> - **Ne jamais modifier un fichier marqué `🔄 EN COURS` par quelqu'un d'autre**
> - En cas de conflit, le `CAHIER_DES_CHARGES.md` fait foi pour les décisions
> - Jamais de clé secrète, mot de passe ou jeton dans ce fichier (uniquement `.env.local`, non versionné)

**Format d'une entrée (pour toutes les nouvelles entrées) :**
```
### [DATE] — [NOM / IA] — [sujet]
**Statut :** 🔄 EN COURS | ✅ TERMINÉ | ⚠️ INCOMPLET | ❌ ANNULÉ
**Fichiers touchés :** liste des fichiers modifiés / créés
**Description :** ce qui est fait / en cours
**Reste :** ce qui n'a pas été fait dans cette session
```

### Index des fichiers critiques
| Fichier | Rôle |
|---|---|
| `docs/CAHIER_DES_CHARGES.md` | Référence : spécifications et décisions |
| `docs/JOURNAL.md` | Ce fichier |
| `src/lib/fees.ts` | Grille de frais dégressive — source unique (simulateur, tarifs, FAQ) |
| `src/lib/showcase.ts` | Défilé « Ça se passe chez nous » : 13 max, popularité, repli photos |
| `src/lib/repo.ts` | Lecture cagnotte / évènement : démo d'abord, Supabase ensuite |
| `src/lib/supabase-rest.ts` | Seul point d'appel de Supabase côté serveur |
| `src/lib/contact.ts` | Validation du formulaire de contact (client + serveur) |
| `src/lib/site-data.ts` | Textes et données de la landing (FAQ, tarifs, menu) |
| `src/lib/data.ts` | Données de démonstration de l'appli |
| `src/app/(site)/site.css` | Styles de la landing |
$1
| `supabase/tests/` | Banc d'essai des migrations (PostgreSQL réel en mémoire, 37 tests) et contrôle de syntaxe SQL |
| `.env.example` | Liste des variables d'environnement |

### Checklist — Site (landing)
| Page | Route | Code | Contrôle visuel |
|---|---|---|---|
| Accueil (hero v2, galerie, simulateur) | `/` | ✅ | ⏳ |
| Comment ça marche | `/comment-ca-marche` | ✅ ⚠️ texte à réécrire | ⏳ |
| Pourquoi Rallyo | `/pourquoi-rallyo` | ✅ | ⏳ |
| Tarifs | `/tarifs` | ✅ ⚠️ grille à confirmer | ⏳ |
| Sécurité | `/securite` | ✅ ⚠️ texte à réécrire | ⏳ |
| FAQ | `/faq` | ✅ ⚠️ texte à réécrire | ⏳ |
| Contact et aide | `/contact` | ✅ | ⏳ |
| Mentions légales / CGU / confidentialité | — | ⏳ à créer (gabarits à faire valider) | — |

### Checklist — Appli (`/app`)
| Écran | Route | Statut |
|---|---|---|
| Accueil | `/app` | ✅ données de démo |
| Explorer | `/app/explorer` | ✅ données de démo |
| Créer | `/app/creer` | ⚠️ maquette, n'enregistre rien |
| Mes billets | `/app/billets` | ✅ données de démo |
| Profil | `/app/profil` | ✅ données de démo |
| Détail cagnotte | `/app/cagnottes/[id]` | ✅ démo + Supabase (UUID), non testé sur vraie base |
| Détail évènement | `/app/evenements/[id]` | ✅ démo + Supabase (UUID), non testé sur vraie base |
| Paiement | `/app/paiement` | ⚠️ simulé (FedaPay choisi, intégration à faire : CDC §20) |
| Page de présentation (couverture, galerie, sections, lien partageable) | `/e/[slug]`, `/c/[slug]` (proposé) | ⏳ spécifiée (CDC §19), non démarrée ; dépend de l'authentification |
| Connexion | `/app/connexion` | ⚠️ maquette, authentification non faite |

### Checklist — API
| Route | Méthodes | Statut |
|---|---|---|
| `/api/contact` | POST | ✅ testée (validation, anti-robots, limite 5 / 10 min) ; 503 tant que Supabase n'est pas configuré |
| Cagnottes, évènements, billets, commandes, retraits | — | ⏳ à définir avec les parcours A / B / C (spécification V1) |
| Authentification (OTP téléphone, e-mail) | — | ⏳ |
| Webhook de paiement | — | ⏳ FedaPay choisi ; à faire après l'auth, le schéma V1 et une URL publique (CDC §20.5) |

### Checklist — Base de données (Supabase, projet `my-portos`)
| Élément | Statut |
|---|---|
| Projet choisi, actif, sans collision, 0 utilisateur | ✅ vérifié par le porteur |
| Migrations `0001` à `0005` adaptées au schéma `rallyo` + fonctions `rallyo_*` dans `public` | ✅ terminé (repris par Claude le 2026-10-03) : syntaxe validée par l'analyseur PostgreSQL, **37 tests réussis sur un vrai PostgreSQL** (voir `supabase/tests/`) |
| `0001_init.sql` : schéma initial (profils, cagnottes, évènements, billets, contributions) | ⏳ non appliquée sur Supabase · ✅ testée sur PostgreSQL réel |
| `0002_showcase.sql` : popularité de la galerie | ⏳ non appliquée sur Supabase · ✅ testée sur PostgreSQL réel |
| `0003_public_detail.sql` : lecture publique cagnotte / évènement | ⏳ non appliquée sur Supabase · ✅ testée sur PostgreSQL réel |
| `0004_sitemap.sql` : liste des pages pour le sitemap | ⏳ non appliquée sur Supabase · ✅ testée sur PostgreSQL réel |
| `0005_contact.sql` : messages de contact (insertion seule) | ⏳ non appliquée sur Supabase · ✅ testée sur PostgreSQL réel |
| `0006`+ : nouveau schéma V1 (catégories de billets, commandes, retraits, vérification d'identité, signalements, favoris) | ⏳ à écrire |
| Réglage « Exposed schemas » | ✅ **inutile** avec l'approche « tables dans `rallyo`, fonctions dans `public` » (le schéma `rallyo` n'apparaît pas dans la liste tant qu'il n'est pas créé) |

### Checklist — À faire par le porteur (dans l'ordre)
- [x] Choisir le projet Supabase (`my-portos`) et vérifier qu'il est actif
- [x] Lister le contenu du projet, vérifier l'absence d'utilisateurs
- [ ] Exécuter les migrations `0001` à `0005` **une par une, dans l'ordre**, dans le SQL Editor (adaptation terminée et testée le 2026-10-03). Elles sont conçues pour s'appliquer sur une base où `rallyo` n'existe pas encore
- [ ] Copier l'URL du projet et la clé publique (Settings → API) dans `.env.local` — **jamais** la clé `service_role`
- [ ] Définir `NEXT_PUBLIC_SITE_URL` (adresse publique du site) quand le domaine existe
- [ ] Renseigner les coordonnées de contact (`NEXT_PUBLIC_CONTACT_EMAIL / WHATSAPP / PHONE / HOURS`)
- [x] Grille de frais **tranchée : 10 % → 3 %**, en tranches progressives (un seul fichier : `src/lib/fees.ts`)
- [x] Prestataire de paiement : **FedaPay** (choisi par le porteur le 2026-10-03)
- [ ] Créer un compte FedaPay et récupérer les **clés de test (sandbox)** — cahier des charges §20.6
- [ ] Poser à FedaPay les questions du §20 (tarif des cartes, pays ouverts, remboursements, versements, montant minimum, signature du webhook) et **reconfirmer les tarifs**
- [ ] Trancher le §20.3 : le coût FedaPay (jusqu'à 4 %) dépasse la commission Rallyo sur les grosses collectes (≈ 5 M F et plus) pour Coris, BMO et MTN Côte d'Ivoire
- [ ] Fournir le lien de **Ticketmania** (tarifs introuvables) pour compléter la comparaison
- [ ] Faire le contrôle visuel de la landing avec `npm run dev` (ordinateur + mobile)
- [ ] Répondre aux décisions ouvertes du cahier des charges (§16)

### Checklist — Tests à faire après les migrations
- [ ] Envoyer un message depuis `/contact` → une ligne apparaît dans `rallyo.contact_messages`
- [ ] Créer une cagnotte et un évènement de test → ils apparaissent dans la galerie de l'accueil (≤ 60 s)
- [ ] Cliquer sur leurs cartes → la page de détail s'ouvre (pas de 404)
- [ ] Vérifier le sitemap (`/sitemap.xml`) : seules les vraies pages sont listées
- [ ] Vérifier qu'aucune table `rallyo.*` n'est lisible avec la clé publique

---

## 1. Tableau de bord

### 📥 Demandes du porteur (registre — 2026-10-03)
| # | Demande | Statut | Qui |
|:-:|---|:-:|---|
| 1 | **Frais : 5 % pour Rallyo + le pourcentage de FedaPay en plus, pour tout** (remplace la grille progressive 10 % → 3 %). *Hypothèse retenue faute de réponse : montant **déduit des recettes de l'organisateur** (décision du 2026-10-02), pas ajouté au prix payé par l'acheteur. À confirmer.* | 🔄 EN COURS | Claude |
| 2 | **Appli : les champs sont trop espacés entre eux** | 🔄 EN COURS | Claude |
| 3 | **Terminer le travail de l'autre IA** : textes publics selon les règles de fonds (CDC §10), pages légales (mentions légales, CGU, confidentialité), `.gitattributes` | ⏳ à reprendre dès son ✅ ou sur ordre du porteur (un seul intervenant à la fois) | Claude (reprise) |
| 4 | **Terminer le travail du prompt « pages de présentation »** (CDC §19) : d'abord les pages publiques avec données de démo (couverture, galerie, sections, aperçu, partage) ; l'éditeur et l'envoi de photos viendront avec l'authentification et le stockage d'images | ⏳ après le point 3 | Claude |
| 5 | Prestataire de paiement : **FedaPay**, intégration « après » | ✅ consigné (CDC §20) ; intégration plus tard | — |
| 6 | Ajouter les nouveautés au cahier des charges (pages de présentation, FedaPay) | ✅ fait | Claude |
| 7 | Règle de travail : **notifier avant et après** chaque tâche, travailler **à tour de rôle** | ✅ en vigueur (section 0) | tous |
| 8 | Base de données : **rester sur Supabase** (projet `my-portos`) | ✅ | — |

### 🔄 En cours
- **🔄 EN COURS — Claude, demandes 1 et 2 (2026-10-03).** (1) Frais « 5 % + FedaPay » : `src/lib/fees.ts`, `src/components/site/fee-calculator.tsx`, page `/tarifs`, `docs/CAHIER_DES_CHARGES.md` (§6, §8, §18, §20.3), tests éventuels. **`src/lib/site-data.ts` est verrouillé par l'autre IA** : je ne l'édite pas ; les lignes de tarifs/FAQ qui y mentionnent des taux sont listées dans mon entrée de fin pour être corrigées par elle (ou par moi à la reprise du point 3). (2) Espacement des champs de l'appli : composants et formulaires sous `src/components/` et `src/app/app/` (liste exacte dans mon entrée de fin). **Aucune migration, aucun fichier de l'autre IA.**
- **Contrôle visuel** (desktop + mobile) de l'ensemble de la landing : hero v2, galerie, icônes Lucide, simulateur de frais, page Contact — avec `npm run dev`. Personne ne l'a encore fait dans un navigateur (les vérifications faites jusqu'ici sont `tsc`, `build` et des requêtes HTTP).
- **Landing page + pages vitrine** (étape 9 / 10 : build et vérifications)

### ✅ Fait
- **✅ TERMINÉ (2026-10-03) — Cahier des charges : pages de présentation (§19) et FedaPay (§20)**, plus mises à jour de §4, §8, §13.3, §13.7, §13.9, §17 et §18. Documentation uniquement : aucun code, aucune migration. Voir l'entrée chronologique du 2026-10-03 « Claude — Cahier des charges ».
- **✅ TERMINÉ (2026-10-03) — Migrations Supabase adaptées au schéma `rallyo`** (reprise par Claude du travail inachevé de l'autre IA, sur décision du porteur). Approche : tables dans `rallyo` (non exposé), fonctions `SECURITY DEFINER` préfixées `rallyo_` dans `public`. **Contrôles :** syntaxe validée par l'analyseur officiel de PostgreSQL ; **37 tests réussis** sur un vrai PostgreSQL (tables inaccessibles à `anon` / `authenticated`, fonctions correctes, formulaire de contact protégé, RLS, `search_path`) ; `tsc` 0 erreur ; build 28 pages ; route `/api/contact` testée (400 / 413 / 429 / 503, robots ignorés). **Rien n'est appliqué sur Supabase** : c'est au porteur d'exécuter les migrations.
- **✅ TERMINÉ — Choix du projet Supabase : `my-portos`** (ex-« Drop » abandonné). Projet actif, 0 utilisateur, aucune collision ; isolation par le schéma `rallyo`. (Détails des décisions et vérifications conservés dans le journal chronologique.)
- **✅ TERMINÉ (2026-10-03) — Checklist d'avancement au format SIVEP** : règle critique « avant / après », format d'entrée, index des fichiers critiques et tableaux d'état (site, appli, API, base de données, tâches du porteur, tests après migrations) dans la section 0 de ce fichier. Aucun fichier de code touché. **Reste :** tenir ces tableaux à jour à chaque tâche terminée.
- **✅ TERMINÉ — Page « Contact et aide »** (`/contact`) : 6 cartes d'aide, questions les plus posées, formulaire, canaux de contact, bloc prudence ; route `POST /api/contact` ; menu « Aide » et colonne « Aide » du pied de page ; migration `0005_contact.sql` (voir entrée du 2026-10-02 « Page Contact et aide »)
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
- Appliquer `0002_showcase.sql`, `0003_public_detail.sql`, `0004_sitemap.sql` **et `0005_contact.sql`** sur le projet Supabase et renseigner `.env.local` (voir `.env.example`)
- Page Contact : renseigner `NEXT_PUBLIC_CONTACT_EMAIL`, `..._WHATSAPP`, `..._PHONE`, `..._HOURS` (vides = canal masqué) ; prévoir **où lire les messages** (aujourd'hui : tableau de bord Supabase uniquement) et une alerte à l'équipe
- Paiement : la page lit désormais les vraies données, mais le paiement lui-même reste simulé (agrégateur à choisir)

### ⏳ À faire — Spécifications V1 (cahier des charges §9 à 18)
Ordre **proposé** :
1. **Valider les décisions ouvertes** (§16) : pays, dépassement de l'objectif, versement différé, plafond du retrait anticipé, frais du prestataire Mobile Money, slogan. *(Tranchés le 2026-10-02 : qui supporte les frais, objectif non atteint, qui organise.)*
2. **Choisir le prestataire de paiement** et vérifier le cadre BCEAO / UMOA (§17).
3. **Refonte du layout `/app` en web responsive** (1440 / 768 / 390 px) ; le cadre téléphone ne reste que pour la démo de la landing.
4. **Évolution du schéma Supabase** (migration `0006`+, la `0005` étant prise par le contact) : `ticket_types`, `orders`, `order_items`, `withdrawals`, `payout_accounts`, `campaign_updates`, `favorites`, `notifications`, `reports`, `refunds` ; statuts étendus de cagnotte et d'évènement ; champs acheteur invité ; profil public d'organisateur ; **vérification d'identité et moyen de réception de l'organisateur** (`organizer_verifications`, `payout_accounts`).
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
- **Grille de frais à confirmer :** le code applique **10 % → 3 %** (entrée « Grille de frais dégressive »), alors que le porteur a ensuite évoqué **9 % → 3 %**. Une seule valeur à changer dans `src/lib/fees.ts` une fois tranché. Les tarifs du marché (Tikerama : 10 % billets, 5 % cotisations ; Tikehub : 5 %) ont été vérifiés sur leurs sites officiels le 2026-10-02 ; **Ticketmania** (Côte d'Ivoire) n'a pas pu être trouvé.
- **Pièces d'identité des organisateurs :** données sensibles (§10.9). Stockage privé, accès restreint, durée de conservation et cadre légal à définir **avant** de collecter la moindre pièce.
- Les éléments **réglementaires (BCEAO) et concurrentiels** cités dans le document source n'ont **pas été vérifiés** (§17).
- Un lien vers un id inexistant (ou une cagnotte non publique) donne bien une 404 ; sans Supabase configuré, seuls les ids de démo (`c1`, `e1`…) fonctionnent
- `NODE_ENV=production` est défini sur la machine : à supprimer dans les variables d'environnement Windows
- Node 25 n'est pas une version LTS
- Les anciens dossiers `rallyo-app` et `rallyo-pwa` sont peut-être des doublons (non supprimés, en attente de ton accord)
- Affirmations de la landing à valider : voir section 7 du cahier des charges

---

## 2. Journal chronologique (le plus récent en haut)

### 2026-10-03 — Claude — Cahier des charges : pages de présentation et FedaPay
**Statut :** ✅ TERMINÉ
**Fichiers touchés :** `docs/CAHIER_DES_CHARGES.md` (ajouts), `docs/JOURNAL.md` (checklists et cette entrée). **Aucun code, aucune migration.**
**Description :**
- **Contexte :** demande du porteur (« ajoute dans le cahier des charges », « je vais utiliser FedaPay après »). À mon arrivée, l'autre IA avait déjà terminé et testé les migrations (commit `363f57f`) et travaillait sur les textes publics et les pages légales : **je n'ai pas touché à ses fichiers**.
- **§19 Pages de présentation :** chaque évènement et chaque cagnotte a une page publique partageable (couverture, galerie, sections, aperçu, publication). Traduction en exigences du texte fourni par le porteur, **adaptée à l'architecture réelle** : tables dans `rallyo` (non exposé) + fonctions `rallyo_*`, bucket public d'images distinct du bucket privé des pièces d'identité, pas de HTML brut, URL proposées `/e/[slug]` et `/c/[slug]` hors du cadre `/app`. Les choix techniques sont marqués « à valider ».
- **§20 FedaPay** (sources officielles fedapay.com et docs-v1.fedapay.com, consultées le 2026-10-03) : 5 pays, Mobile Money + cartes, sandbox/live, webhooks, reversement sous 3 jours ouvrés. Tarifs publiés : **1,8 %** (Bénin : MTN, Moov, Celtiis), **4 %** (Coris, BMO, MTN Côte d'Ivoire), frais fixes de 150 à 2 500 F par versement. Intégration proposée (serveur uniquement, webhook idempotent via `provider_ref`, montants recalculés côté serveur).
- **Mises à jour :** §4 (stack), §8 (2 décisions), §13.3 / §13.7 / §13.9 (renvois), §17 (prestataire), §18 (2 écarts).
**⚠️ Découverte importante (à trancher) :** avec nos tranches progressives (10 % → 3 %), le **taux réel payé** par l'organisateur vaut 5,28 % à 2,5 M F et **4,14 % à 5 M F**, puis passe **sous 4 % au-delà d'environ 5,7 M F**. Pour les moyens à 4 % (Coris, BMO, MTN Côte d'Ivoire), la **marge devient quasi nulle puis négative** sur les grosses collectes, avant les frais fixes de versement. Avec les moyens à 1,8 % la marge reste confortable. Détail et options : CDC §20.3. `fees.ts` **n'a pas été modifié**.
**Points à vérifier :** la page de tarifs FedaPay semblait datée d'environ onze mois ; tarif des **cartes bancaires** non trouvé ; pays réellement ouverts, remboursements, versements, montant minimum et méthode de signature du webhook à confirmer auprès de FedaPay.
**Observation (non corrigée, entrée de l'autre IA en cours) :** le titre de son entrée ci-dessous affiche un `$1` parasite à la place de « ### 2026-10-03 — Claude — … » (même défaut que celui déjà corrigé plus tôt : remplacement de texte avec un `$1` littéral). À réparer par son auteur à la fin de son tour.
**Reste :** rien pour ce tour. Prochaines étapes qui en découlent : authentification, schéma V1 (commandes), puis pages de présentation, puis intégration FedaPay.

### Archive — décisions Supabase de l'autre IA et du porteur (déplacées depuis « En cours »)
- (archive, ex-« En cours ») **▶️ DÉBUT — Utiliser le projet Supabase « Drop » existant pour Rallyo** (décision du porteur, 2026-10-02). **Analyse faite :** le dossier `Desktop\Drop\client` n'utilise pas encore Supabase (aucune dépendance, aucun `.env`, aucun appel de table ; seul un commentaire prévoit d'y brancher le stockage d'images). Le contenu en ligne du projet n'est pas lisible (le connecteur Supabase n'expose aucun outil). **Décision technique : isoler Rallyo dans son propre schéma Postgres `rallyo`** (pas de collision possible avec Drop). Étape 2 en cours : adapter `supabase/migrations/0001`–`0005` (`public.` → `rallyo.`, types et fonctions dans le schéma), `src/lib/supabase-rest.ts` et `src/app/api/contact/route.ts` (en-tête `Content-Profile: rallyo`), `.env.example`. **Aucune migration appliquée à la base.** ⚠️ Merci de ne pas toucher à ces fichiers en parallèle.
- (archive, ex-« En cours ») **✅ DÉCISION DU PORTEUR (2026-10-02) — le projet Supabase cible n'est plus « Drop » mais « my-portos »** (référence `eitylrvshhrflcywhigo`, tableau de bord : https://supabase.com/dashboard/project/eitylrvshhrflcywhigo, URL d'API attendue : `https://eitylrvshhrflcywhigo.supabase.co`). L'isolation dans le schéma `rallyo` reste valable. **À faire avant d'appliquer quoi que ce soit :** vérifier que le projet est actif (non en pause), lister son contenu (requête `information_schema`), vérifier s'il a de vrais utilisateurs (comptes `auth` partagés), ajouter `rallyo` aux « Exposed schemas » de l'API. Aucune clé n'est notée ici : elles vont uniquement dans `.env.local` (non versionné). **✅ VÉRIFIÉ par le porteur (2026-10-02) :** projet actif ; `public` contient seulement `blog_posts`, `projects`, `reviews`, `site_settings` (portfolio) et **aucune fonction** ; **0 utilisateur** `auth` → **aucune collision** avec Rallyo, ni dans `rallyo` ni dans `public` (noms de tables et de fonctions Rallyo tous différents) ; comptes partagés sans conséquence aujourd'hui (⚠️ à revoir si le portfolio ajoute un jour une connexion). **⚠️ Blocage :** le porteur n'arrive pas à accéder au réglage « Exposed schemas ». **Recommandation à l'IA qui adapte les migrations :** ne pas dépendre de ce réglage — garder les **tables dans le schéma `rallyo` (jamais exposées par l'API)** et ne publier que des **fonctions `SECURITY DEFINER` préfixées `rallyo_` dans `public`** (search_path fixé), y compris pour l'insertion du formulaire de contact (ex. `rallyo_contact_submit`) ; `supabase-rest.ts` n'aurait alors plus besoin de l'en-tête `Content-Profile`. Plus sûr (tables non atteignables en direct) et sans réglage manuel. Ne jamais modifier les 4 tables du portfolio.

$1 — Fin des migrations Supabase, puis textes publics et pages légales
**Statut :** 🔄 EN COURS
**Décision du porteur :** « reprends son travail inachevé et termine, puis on continue le travail si tu as des suggestions et fais-les ».
**Fichiers touchés (prévus) :**
- Reprise de l'autre IA : `supabase/migrations/0001`–`0005`, `src/lib/showcase.ts`, `src/lib/repo.ts`, `src/app/sitemap.ts`, `src/app/api/contact/route.ts`, `.env.example`, suppression de `tmp-schema.cjs` (obsolète).
- Mes suggestions : `src/lib/site-data.ts` (FAQ), pages `/securite` et `/comment-ca-marche`, nouvelles pages légales + `footer.tsx` + `sitemap.ts`, `.gitattributes`, `docs/`.
**Plan :** (1) relire les 3 migrations non lues en entier + **contrôle de syntaxe SQL** hors base ; (2) corriger ce qui doit l'être ; (3) tsc + build + tests HTTP ; (4) commit ; (5) réécrire les textes publics selon les règles de fonds du cahier §10 ; (6) gabarits légaux **à faire valider** ; (7) `.gitattributes`.
**Avancement :**
- ✅ **Partie 1 — reprise des migrations : TERMINÉE.** Relecture complète de `0001`–`0005` ; syntaxe SQL validée (analyseur PostgreSQL) ; **37 tests sur un vrai PostgreSQL (PGlite)** : tables protégées, fonctions exactes (cagnotte, évènement, galerie, sitemap), contact (validation, limite par contact et globale, nettoyage du texte), `search_path` vide, `EXECUTE` retiré à `PUBLIC`, RLS sur 6 tables / 10 politiques, aucun droit résiduel. **Aucune correction nécessaire.** Les noms de paramètres code ↔ SQL concordent. `tsc` 0 erreur, build **28 pages**, HTTP : 13 pages en 200, ancres FAQ, `/sitemap.xml`, `/api/contact` (JSON invalide 400, champs invalides 400, robots 200 silencieux, trop gros 413, 6ᵉ envoi 429, non configuré 503). `tmp-schema.cjs` supprimé (obsolète). `supabase/tests/` ajouté (banc d'essai réutilisable pour `0006`+).
- ⚠️ **Rien n'a été appliqué sur Supabase** (aucun accès à la base).
- ⚠️ Limites des tests : PGlite n'est pas Supabase (pas de PostgREST ; `auth.users`, `auth.uid()` et les rôles sont simulés).
- 🔄 **Partie 2 — mes suggestions : EN COURS** (textes publics selon les règles de fonds, pages légales, `.gitattributes`).
**Reste :** parties 2 et suivantes, puis commit.

### 2026-10-03 — Claude (revue) — Relecture du travail de l'autre IA (migrations Supabase)
**Statut :** ✅ TERMINÉ (lecture seule)
**Fichiers touchés :** `docs/JOURNAL.md` uniquement (cette entrée). **Aucun** fichier de code, de migration ni l'entrée « 🔄 EN COURS » de l'autre IA n'a été modifié.
**Description :** à la demande du porteur, vérification de l'avancement de l'autre IA avant de reprendre la main.

**État constaté**
- 11 fichiers modifiés et **non commités** (migrations `0001`–`0005`, `showcase.ts`, `repo.ts`, `sitemap.ts`, `api/contact/route.ts`, journal, README-SECURE). Dernière modification de code : 09:31, rien depuis. **Son ✅ TERMINÉ n'est pas posé.**
- `tsc --noEmit` : **0 erreur**. `npm run build` **non relancé** (pour ne pas entrer en collision avec `.next` si l'autre IA travaille encore).

**Relu et conforme à l'approche annoncée** (tables dans `rallyo`, fonctions `rallyo_*` dans `public`)
- `0003` et `0005` lus en entier ; `0001`, `0002`, `0004` contrôlés sur les points critiques.
- Schéma `rallyo` créé puis `revoke` pour public / anon / authenticated ; **RLS activée sur les 5 tables** ; aucune fonction `SECURITY DEFINER` sans `search_path` vide ; `execute` retiré à `public`, accordé à `anon` / `authenticated`.
- Lecture publique limitée aux cagnottes `active` / `completed` et aux évènements publiés.
- Formulaire de contact : validation **refaite en SQL** (la clé publique étant visible, la route peut être contournée) + limite de débit côté base.
- **Code ↔ SQL :** 5 fonctions définies = 5 fonctions appelées, aucun ancien nom sans préfixe, **aucun appel direct** `rest/v1/<table>` ; les erreurs `rate_limited` / `invalid_input` de la route correspondent à celles de la fonction.

**Non vérifié :** exécution réelle du SQL (aucune migration appliquée, pas d'accès à la base), build, rendu visuel.

**Remarques (non bloquantes)**
1. La limite **globale** de 100 messages / 10 min dans `rallyo_contact_submit` permet à un abus de bloquer le formulaire pour tout le monde pendant 10 min. Compromis à confirmer.
2. `revoke all on all tables in schema rallyo` (fin de `0001`) rend inopérantes les politiques RLS d'écriture (« créer sa cagnotte »…) pour `authenticated`. Cohérent avec « tout passe par des fonctions », mais à retenir quand l'authentification sera ajoutée : il faudra de nouvelles fonctions `rallyo_*` (ou des `GRANT` explicites).
3. Si le SQL répond `invalid_input`, la route renvoie 400 **sans** détail par champ : le formulaire affiche le message générique « n'a pas pu être envoyé » (cas rare, le client valide avant).
4. Migration `0005` non appliquée → PostgREST 404 → la route répond 502 (message générique). Comportement attendu.
5. `docs/README-SECURE.md` : version de travail **raccourcie à 23:41** (≈12 Ko, contre ≈19,8 Ko commités en `0078827`) : sections **A** (stack figée), **B** (NODE_ENV, diagnostic de connexion, « travailler avec une IA ») et **C** (points SIVEP) absentes. Version complète **conservée dans git**. Non modifié par moi ; **à confirmer par le porteur** (suppression voulue ou accident).
6. `tmp-schema.cjs` (non suivi par git) est obsolète selon ce journal : à supprimer par son auteur.
7. Git avertit « LF will be replaced by CRLF » : sans effet fonctionnel ; un `.gitattributes` éviterait les diffs de fins de ligne.

**Reste :** attendre le ✅ TERMINÉ de l'autre IA (ou la décision du porteur de considérer son tour comme fini) → build, commit de ses fichiers, puis le porteur applique les migrations **une par une, dans l'ordre**.

### 2026-10-02 — Décision : on garde Supabase ✅ TERMINÉ
- **Contexte :** le porteur a atteint la limite du plan gratuit Supabase (2 projets actifs, pause après 7 jours d'inactivité) et a demandé une alternative.
- **Comparatif fait (sources officielles, vérifié le 2026-10-02) :** Neon (Postgres, pas de pause de projet mais base seule : ni auth ni fichiers), Appwrite Cloud (2 projets, pause après 1 semaine : pas mieux), Cloudflare D1 (limites quotidiennes bloquantes depuis le 2026-09-01), Turso (SQLite, moins adapté à l'argent), Firebase (stockage retiré du plan gratuit en 02/2026).
- **Décision du porteur : on reste sur Supabase.** Aucun code modifié. Ne pas proposer de migration vers Neon/autre sans nouvelle demande du porteur.
- **À prévoir :** un seul projet Supabase pour Rallyo (libérer un emplacement en supprimant ou en passant en pause un ancien projet inutile). Le code n'appelle Supabase que par `supabase-rest.ts`, `api/contact/route.ts` et `sitemap.ts`.
- ⚠️ Projet gratuit = **pause après 7 jours sans activité** : acceptable en développement, pas pour un site public. Prévoir le plan Pro avant le lancement, ou un appel régulier de maintien d'activité en attendant.

### 2026-10-02 — Page « Contact et aide » ✅ TERMINÉ
**Demande :** reprendre le travail commencé par l'autre IA (page contact avec aide) et le terminer. **Début notifié** avant d'agir, **fin notifiée** ici (nouvelle règle de l'équipe : on prévient avant, on prévient après).

**État trouvé :** 5 fichiers créés mais ni câblés, ni testés, ni commités, plus un script `_wire.mjs` jamais exécuté, et rien dans le journal.

**Ce que fait la page** (`/contact`)
- En-tête « On est là, écris-nous » avec boutons « Nous écrire » et « Voir la FAQ ».
- **6 cartes d'aide** : Cagnottes, Billetterie, Paiements et frais, Sécurité et compte (vers les rubriques de la FAQ, ancres vérifiées dans le HTML généré), Comment ça marche, Signaler un contenu.
- **« Les plus posées »** : questions tirées de la FAQ existante (`HELP_QUESTIONS`), affichées en accordéon.
- **Nous écrire** : canaux de contact + formulaire (nom, e-mail ou téléphone, sujet, message de 10 à 2 000 caractères, compteur, erreurs par champ). `?sujet=signalement` pré-sélectionne le sujet.
- **Bloc « Reste prudent »** : ne jamais communiquer mot de passe, code SMS ou code secret Mobile Money ; lien pour signaler une page suspecte.
- **Canaux masqués tant qu'ils ne sont pas configurés** : e-mail, WhatsApp, téléphone, horaires viennent de variables d'environnement `NEXT_PUBLIC_CONTACT_*` (aucune coordonnée inventée). Sans aucun canal, la page dit que le formulaire est le moyen le plus simple de joindre l'équipe.

**Route `POST /api/contact`** (`src/app/api/contact/route.ts`) — ordre des contrôles : taille (8 000 car.) → JSON → robots (champ piège + formulaire envoyé en moins de 2,5 s : réponse « ok » sans rien enregistrer) → validation (`src/lib/contact.ts`, partagée client/serveur) → limite de 5 messages / 10 min / IP → configuration → enregistrement. Les erreurs internes ne sont jamais détaillées au visiteur.

**Base de données** (`0005_contact.sql`) : table `contact_messages`, RLS activée, **insertion seule** pour le public ; aucune lecture, modification ou suppression possible via l'API publique. Lecture : tableau de bord Supabase ou clé `service_role`.

**Câblage exécuté** (script `_wire.mjs`, puis supprimé) : icônes (`site-icon.tsx`), ancres de la FAQ sans espaces ni accents (`blocks.tsx`, corrige aussi `aria-labelledby` invalide), lien **« Aide »** dans le menu, colonne **« Aide »** du pied de page, `/contact` dans le sitemap, styles en fin de `site.css`, variables dans `.env.example`.

**Bug trouvé et corrigé en route :** le script remplaçait la ligne `FAQ` du menu par un littéral `$1` (le lien FAQ disparaissait et `site-data.ts` ne compilait plus). Lien FAQ rétabli. La même erreur avait laissé un `$1` parasite dans ce journal (corrigé).

**Vérifications**
- `tsc --noEmit` OK · `npm run build` OK (28 pages, dont `/contact` et `/api/contact`).
- Test réel sur serveur de production local : pages `/contact`, `/faq`, `/` → 200, menu « Aide » présent, `/contact` dans `sitemap.xml` ; API : JSON invalide 400, robot (champ piège) et formulaire trop rapide → `ok` sans enregistrement, message court / sujet inconnu / contact invalide → 400 avec message par champ, corps trop gros 413, **6ᵉ message en rafale → 429**, message valide sans Supabase configuré → 503 (le formulaire affiche alors « pas encore disponible, utilise les autres moyens »).
- **Non testé :** enregistrement réel (pas de projet Supabase) et rendu visuel (aucun navigateur utilisé).

**À savoir**
- Les messages ne sont lisibles que dans le tableau de bord Supabase : prévoir une vue d'équipe et une alerte (e-mail / WhatsApp) pour ne pas laisser des demandes sans réponse.
- Limite de débit **en mémoire** : suffisante contre un abus simple, pas contre une attaque distribuée ni sur plusieurs instances serveur.
- Migration : la spec V1 (§18) prévoyait `0005`+ pour le nouveau schéma ; elle passe en `0006`+.
- Aucun texte de FAQ réécrit ici (voir point d'attention « textes publics en décalage »).

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
