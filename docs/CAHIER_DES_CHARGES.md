# Rallyo — Cahier des charges

> Document de référence du projet. Mis à jour au fil de l'eau.
> L'avancement détaillé (fait / en cours / à faire) est dans `JOURNAL.md`.

**Dossier du projet :** `C:\Users\HP\Desktop\Arbre\Mes saas\rallyo-next`
**Prototype d'origine (référence, ne pas modifier) :** `C:\Users\HP\Desktop\Arbre\Mes saas\rallyo-pw@`
**Ancienne landing (Vite + GSAP, référence) :** `C:\Users\HP\Desktop\Arbre\Mes saas\Rallyo\rallyo`

---

## 1. Vision

**Rallyo** : cagnottes en ligne et billetterie d'évènements pour l'Afrique de l'Ouest.
Slogan : *Rassemble. Célèbre. Soutiens.*

Une seule plateforme, mobile d'abord, pour :
- **lever des fonds** (solidarité, projets, sport, créativité) ;
- **vendre des billets** (concerts, battles, marchés) avec e-billet QR code ;
- le tout payé en **Mobile Money** (et carte), en **FCFA**.

## 2. Cibles

| Cible | Besoin |
|---|---|
| Familles et proches | Cagnotte pour un évènement de vie (santé, deuil, mariage) |
| Associations, clubs, écoles | Financer un projet, une tournée, du matériel |
| Artistes et organisateurs | Vendre des billets sans billet papier, contrôler l'entrée |
| Donateurs | Donner simplement, éventuellement de façon anonyme |

## 3. Périmètre fonctionnel

### 3.1 Application (`/app`) — PWA mobile
- Accueil, Explorer (filtres), Créer (cagnotte ou billetterie), Mes billets (QR), Profil
- Détail cagnotte, détail évènement, paiement, connexion / inscription
- Dons anonymes, montants suggérés, jauge de progression

### 3.2 Site vitrine / landing (`/`) — SEO et conversion
Style graffiti repris de l'ancienne landing (rose, cyan, jaune acide ; polices Bangers, Permanent Marker, Space Grotesk).
- **Accueil** : hero, bandeau, mur des usages, **démo interactive de l'appli dans un téléphone**, pourquoi, chiffres, étapes, cas d'usage, galerie, confiance, tarifs, FAQ, appel à l'action
- **/comment-ca-marche** : parcours détaillés (cagnotte, billetterie, contributeur)
- **/pourquoi-rallyo** : constat, différences, comparatif, pour qui
- **/tarifs** : grille de frais + simulateur
- **/securite** : confiance et paiements
- **/faq** : questions par catégorie (avec données structurées SEO)
- `sitemap.xml` et `robots.txt`

#### 3.2.1 Hero (spécification, 2026-10-02)
Repris du prototype `rallyo-pw@` : eyebrow **« Rassemble. Célèbre. Soutiens. »**, titre **« Un seul geste pour rassembler ta communauté »**, deux boutons, et à droite deux **pop-ups flottants** (téléphone « évènement » + carte « cagnotte avec jauge »), marqués « Exemple » car ce sont des données de démonstration. Sur mobile : une colonne, pop-ups sous le texte.

#### 3.2.2 Vitrine « Ça se passe chez nous » (spécification, 2026-10-02)
Section sous l'eyebrow « // L'énergie qu'on veut servir ». Défilé horizontal de **cartes-billets** (même format que `rallyo-pw@` : photo, encoches, pointillés, jauge ou prix). Branchée au back :
- **Source :** fonction SQL `public.showcase_popular(max_items)` (migration `0002_showcase.sql`), appelée depuis `src/lib/showcase.ts`.
- **Contenu :** **13 éléments au maximum**, évènements publiés à venir + cagnottes actives, **triés par popularité**.
- **Popularité :** 10 × (billets vendus ou contributions confirmées) + avancement en % (jauge / taux de remplissage) + bonus de fraîcheur (30 points le jour de création, 0 après 30 jours).
- **Repli photos :** tant qu'il n'y a rien (ou si le back est injoignable / non configuré), cartes-photos d'illustration invitant à créer sa page — aucune information inventée. Dès qu'il y a des éléments réels, ils passent en premier ; les photos ne complètent que jusqu'à **8 cartes** minimum (pour que le défilé reste fourni), puis disparaissent. Au-delà de 8 éléments réels : plus de photos.
- **Fraîcheur :** page régénérée toutes les 60 s (`revalidate = 60`).
- **Accessibilité :** défilé en pause au survol / focus, 2e série masquée aux lecteurs d'écran, défilement manuel si « réduire les animations ».

### 3.3 Hors périmètre (pour l'instant)
Application native, multi-devises, remboursements automatiques, programme d'affiliation.

## 4. Stack technique (versions stables, figées)

| Brique | Choix | Raison |
|---|---|---|
| Framework | **Next.js 15.5.26** (App Router) | SEO, aperçus de partage WhatsApp, routes serveur pour les paiements |
| UI | **React 19.1.0** | Version stable associée à Next 15 |
| Style | **Tailwind CSS 4** + CSS dédié pour la landing | Palette en variables, landing isolée sous `.site` |
| Langage | **TypeScript 5.8** | Typage strict |
| Animations | **GSAP** (landing uniquement) | ScrollTrigger, défilement horizontal épinglé |
| Base de données / Auth | **Supabase** (PostgreSQL + RLS) | Schéma déjà écrit : `supabase/migrations/0001_init.sql` |
| Paiement | Mobile Money via un agrégateur (FedaPay, Kkiapay ou CinetPay — **à choisir**) | Clés secrètes côté serveur, webhooks |
| Node | Recommandé : **22 LTS** (la machine a Node 25, version « Current ») | Stabilité |

Règles : versions exactes (`save-exact`), pas de Turbopack en build, pas de bibliothèque instable.

## 5. Modèle de données (résumé)

`profiles` → `campaigns` → `contributions` ; `profiles` → `events` → `tickets`.
Montants en **entiers FCFA**. Sécurité par **Row Level Security** ; paiements et émission de billets uniquement côté serveur.

## 6. Modèle économique (à confirmer)

Commission à l'usage, inscription gratuite :
- Cagnotte : **3–5 %**
- Billetterie : **5–8 %**
- Frais du prestataire Mobile Money en sus
- Piste future : abonnement « Pro » pour organisateurs réguliers (commission réduite)

## 7. Points à valider avant mise en ligne

Ces affirmations apparaissent dans la landing et la FAQ : elles doivent correspondre à la réalité.
1. Taux de commission exacts (3–5 % et 5–8 %).
2. Politique si l'objectif n'est pas atteint (fonds versés au créateur ?).
3. Délai de retrait annoncé et vérification d'identité des organisateurs.
4. Liste des moyens de paiement réellement disponibles par pays.
5. Pays de lancement (Bénin d'abord ?).
6. Remplacer les images de démonstration (Unsplash) par des visuels libres de droits ou propres.
7. Mentions légales, CGU et politique de confidentialité (non rédigées).

## 8. Décisions prises

| Date | Décision |
|---|---|
| 2026-09-30 | Stack **Next.js + Supabase** (SEO et paiement serveur) |
| 2026-09-30 | Versions stables figées ; Next 15 plutôt que 16 |
| 2026-09-30 | Nouveau dossier `rallyo-next` (ne pas écraser l'ancien projet Vite) |
| 2026-10-02 | Landing sur `/`, appli sous `/app`, un seul projet |
| 2026-10-02 | Pas de faux avis ni de faux chiffres : scénarios d'usage et chiffres vérifiables |
| 2026-10-02 | Section « Tarifs » publique (l'ancienne était un tableau interne de pistes) |
| 2026-10-02 | Hero repris de `rallyo-pw@` (texte + pop-ups à droite) ; vitrine « Ça se passe chez nous » = cartes-billets branchées au back, 13 max, tri par popularité, repli sur photos |
| 2026-10-02 | Popularité calculée **côté base** (fonction SQL `SECURITY DEFINER`, agrégats uniquement) : les billets restent illisibles publiquement |
