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

> **Mise à jour 2026-10-02 :** le périmètre détaillé de la V1 (espaces, 119 écrans, règles de fonds, états) est décrit aux **sections 9 à 18**, qui prévalent en cas de divergence avec les sections 3 à 6.

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

#### 3.2.3 Page Contact et aide (spécification, 2026-10-02)
`/contact` (lien « Aide » dans le menu et le pied de page) : 6 cartes d'aide vers la FAQ, questions les plus posées, canaux de contact, formulaire, conseils de prudence et signalement.
- **Coordonnées :** jamais écrites en dur ; variables `NEXT_PUBLIC_CONTACT_EMAIL / WHATSAPP / PHONE / HOURS`, canal masqué si vide.
- **Formulaire :** `POST /api/contact` ; anti-robots (champ piège, délai minimal), limite de 5 messages par 10 minutes et par IP, validation partagée client/serveur ; stockage dans `contact_messages` (migration `0005`), **insertion seule** pour le public, lecture réservée à l'équipe.
- **Reste à définir :** délai de réponse annoncé, outil de traitement et alerte à l'équipe, durée de conservation des messages (données personnelles).

### 3.3 Hors périmètre (pour l'instant)
Application native, multi-devises, **remboursements automatiques** (la *demande* de remboursement suivie manuellement est dans le périmètre, §10.6), **portefeuille interne Rallyo** (§10.1), programme d'affiliation.

## 4. Stack technique (versions stables, figées)

| Brique | Choix | Raison |
|---|---|---|
| Framework | **Next.js 15.5.26** (App Router) | SEO, aperçus de partage WhatsApp, routes serveur pour les paiements |
| UI | **React 19.1.0** | Version stable associée à Next 15 |
| Style | **Tailwind CSS 4** + CSS dédié pour la landing | Palette en variables, landing isolée sous `.site` |
| Langage | **TypeScript 5.8** | Typage strict |
| Animations | **GSAP** (landing uniquement) | ScrollTrigger, défilement horizontal épinglé |
| Base de données / Auth | **Supabase** (PostgreSQL + RLS) | Schéma déjà écrit : `supabase/migrations/0001_init.sql` |
| Paiement | Mobile Money via un agrégateur : **FedaPay** (choix du porteur, 2026-10-03 ; voir §20) | Clés secrètes côté serveur, webhooks |
| Node | Recommandé : **22 LTS** (la machine a Node 25, version « Current ») | Stabilité |

Règles : versions exactes (`save-exact`), pas de Turbopack en build, pas de bibliothèque instable.

## 5. Modèle de données (résumé)

`profiles` → `campaigns` → `contributions` ; `profiles` → `events` → `tickets`.
Montants en **entiers FCFA**. Sécurité par **Row Level Security** ; paiements et émission de billets uniquement côté serveur.

## 6. Modèle économique (décision du porteur, 2026-10-03)

Inscription gratuite, pas d'abonnement, **aucun palier** :
- **Frais total = 5 % (Rallyo) + pourcentage du prestataire de paiement (FedaPay) selon le moyen de paiement.** Rien d'autre. Identique pour les cagnottes et la billetterie. Source unique : `src/lib/fees.ts`.
- Pourcentages FedaPay retenus (publiés par FedaPay le 2026-10-03, **à reconfirmer**) : **1,8 %** (Mobile Money Bénin : MTN, Moov, Celtiis) → total **6,8 %** ; **4 %** (Coris Money, BMO, MTN Côte d'Ivoire) → total **9 %**. Cartes bancaires : tarif non trouvé, non proposé pour l'instant.
- **Hypothèse à confirmer :** le total est **déduit des recettes de l'organisateur** (décision du 2026-10-02), jamais ajouté au prix payé par l'acheteur.
- Non inclus dans le calcul : les frais fixes de versement FedaPay (150 à 2 500 F par virement vers Mobile Money, §20.2).
- Cette règle **remplace** l'ancienne grille progressive de 10 % à 3 %, qui est abandonnée.
- Offres futures (FREE / PRO / BUSINESS, commission réduite, limites d'API) : à étudier avec l'architecture « Widget + API » (voir `docs/ARCHITECTURE_WIDGET_API.md`, à venir).

## 7. Points à valider avant mise en ligne

Ces affirmations apparaissent dans la landing et la FAQ : elles doivent correspondre à la réalité.
1. Frais : **5 % + pourcentage FedaPay** (§6). Vérifier les pourcentages de FedaPay et le tarif des cartes ; confirmer que le total est déduit de l'organisateur. Comparer avec la concurrence (Tikerama : 10 % billets, 5 % cotisations, vérifiés sur leur site le 2026-10-02). **Textes encore à mettre à jour dans `src/lib/site-data.ts`** (cartes Tarifs et FAQ « Combien coûte Rallyo ? », « Qui paie les frais de Rallyo ? »).
2. Règles de fonds (§10) : fonds réservés jusqu'à la fin ou à l'objectif, retrait anticipé contrôlé. **À trancher :** dépassement de l'objectif, plafond et justificatifs du retrait anticipé, date du versement différé en billetterie.
3. Délai de retrait annoncé et vérification d'identité des organisateurs.
4. Liste des moyens de paiement réellement disponibles par pays.
5. Pays de lancement (Bénin d'abord ?).
6. Remplacer les images de démonstration (Unsplash) par des visuels libres de droits ou propres.
7. Mentions légales, CGU et politique de confidentialité (non rédigées).
8. **Prestataire de paiement agréé par pays** et cadre réglementaire BCEAO / UMOA : à vérifier (§17). Les éléments du document source n'ont pas été vérifiés.
9. **Réécrire les textes publics** (FAQ « objectif non atteint » et « retirer mes fonds », `/securite`, `/comment-ca-marche`) : ils décrivent aujourd'hui un retrait libre, incompatible avec les fonds réservés du §10.
10. **Tranché :** la commission est déduite des recettes de l'organisateur (§16). **Reste à préciser :** qui supporte les frais du prestataire Mobile Money.
11. Arbitrer le **message d'accueil** (« Les moments commencent ici. » ou « Rassemble. Célèbre. Soutiens. ») et la **direction visuelle** (§16).
12. **Protection des données des pièces d'identité** des organisateurs (§10.9) : stockage, durée de conservation, consentement, cadre légal du pays de lancement.

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
| 2026-10-02 | Pages de détail et paiement : données de démo d'abord (`c1`, `e1`…), puis Supabase pour les UUID, via `src/lib/repo.ts` (mêmes types, vues inchangées) ; lecture publique par fonctions SQL `campaign_public` / `event_public` (migration `0003`) |
| 2026-10-02 | Frais : grille dégressive de 10 % à 3 %, en **tranches progressives** (la commission ne baisse jamais quand le montant monte), même grille cagnotte et billetterie. ⚠️ **Remplacée le 2026-10-03** (ligne suivante) |
| 2026-10-03 | ✅ **Frais : 5 % pour Rallyo + pourcentage FedaPay selon le moyen de paiement, pour tout** (cagnottes et billetterie), sans palier ni autre frais. Remplace la grille de 10 % à 3 %. Hypothèse : total déduit des recettes de l'organisateur (§6) |
| 2026-10-02 | Spécifications V1 intégrées (§9 à 18) à partir des documents « Architecture complète » et « Architecture définitive V1 » |
| 2026-10-02 | ✅ Plateforme **web responsive** ; achat et contribution **sans compte**, compte requis pour créer, gérer et retirer |
| 2026-10-02 | ✅ **Pas de portefeuille Rallyo** : fonds versés via un prestataire de paiement agréé |
| 2026-10-02 | ✅ Cagnotte : fonds réservés jusqu'à la fin ou à l'objectif, **retrait anticipé sur demande avec contrôle** ; billetterie : versement **différé ou direct** |
| 2026-10-02 | ✅ Page publique transparente : objectif, montant, nombre de contributions ou de billets, dates, statut |
| 2026-10-02 | ✅ **Frais supportés par l'organisateur** (commission déduite de ses recettes) |
| 2026-10-02 | ✅ **Cagnotte sous l'objectif à la date de fin : le créateur garde tout ce qui a été collecté** |
| 2026-10-02 | ✅ **Organisateur d'évènement : toute personne avec un compte**, qui enregistre **identité + moyen de recevoir l'argent** (carte bancaire ou compte Mobile Money), enregistré chez le prestataire (§10.9) |
| 2026-10-03 | ✅ **Prestataire de paiement : FedaPay** (choix du porteur ; intégration à faire plus tard, après l'authentification et le schéma V1). Voir §20 : le coût FedaPay est répercuté dans le modèle « 5 % + FedaPay » (§6), donc la marge de Rallyo ne dépend plus du moyen de paiement |
| 2026-10-03 | ✅ **Chaque évènement et chaque cagnotte a une page de présentation publique et partageable** (couverture, galerie, sections, bouton d'action), personnalisable simplement par son créateur. Voir §19 |


---

# SPÉCIFICATIONS V1 (ajout du 2026-10-02)

> **Source :** documents « Architecture complète de l'application » et « Rallyo — architecture définitive V1 », fournis par le porteur du projet (rédigés avec un assistant IA).
> **Légende :** ✅ choix exprimé par le porteur dans ces documents · 🟡 proposition à valider · ❓ décision ouverte (voir §16).
> Les sections 9 à 18 **précisent et complètent** les sections 3 à 6. En cas de divergence, elles prévalent. Les points de conformité réglementaire et de concurrence cités viennent du document et **n'ont pas été vérifiés**.

## 9. Architecture générale

### 9.1 Principes retenus
- ✅ Plateforme **web responsive** (ordinateur, tablette, mobile). ⚠️ Le code actuel est une PWA dans un cadre de téléphone : voir §18.
- ✅ **Transparence publique** : chaque évènement et chaque cagnotte a une page publique avec objectif, montant collecté ou encaissé, nombre de contributions ou de billets vendus, dates et statut.
- ✅ **Achat et contribution sans compte.** Compte obligatoire pour créer, gérer, demander un retrait, consulter son historique et publier des mises à jour.
- ✅ Paiement par **Mobile Money et cartes bancaires** (moyens disponibles selon le pays et le prestataire).
- ✅ **Frais : l'organisateur les supporte** (décision du 2026-10-02) : la commission Rallyo est **déduite de ses recettes**, jamais ajoutée au prix payé par l'acheteur ou le contributeur. ❓ Reste à préciser qui supporte les frais du prestataire Mobile Money.
- ✅ **Pas de portefeuille Rallyo** : les fonds sont versés au bénéficiaire via un **prestataire de paiement agréé** (§10.1, §17).
- 🟡 Direction visuelle **festive et colorée** (message d'accueil « Les moments commencent ici. », visuel très festif) : à confirmer (§16).

### 9.2 Les 5 espaces

```
RALLYO
├── ESPACE PUBLIC           Accueil, Évènements, Cagnottes, Recherche, Détail évènement, Détail cagnotte
├── ACHAT / CONTRIBUTION    Billetterie, Paiement, Confirmation, Billet / Reçu
├── ESPACE UTILISATEUR      Tableau de bord, Mes billets, Mes contributions, Mes cagnottes,
│                           Mes évènements, Transactions, Profil
├── CRÉATION / GESTION      Créer évènement, Gérer évènement, Créer cagnotte, Gérer cagnotte
└── ADMINISTRATION          Dashboard, Utilisateurs, Évènements, Cagnottes, Paiements,
                            Retraits, Signalements, Modération
```

### 9.3 Navigation
- **Ordinateur :** Logo Rallyo · Évènements · Cagnottes · Rechercher · Créer · Connexion / Profil. Le bouton **Créer** ouvre « Créer un évènement » ou « Créer une cagnotte ». Une fois connecté, le menu utilisateur donne accès au tableau de bord.
- **Mobile (barre basse) :** Accueil · Évènements · Cagnottes · Activité · Profil. Le bouton « + » est au centre ou dans Profil selon la direction artistique.
- **Pied de page :** À propos, Aide, Conditions, Confidentialité, Politique de remboursement, Contact, Réseaux sociaux, Pays / devise.
- Principe : ne pas tout mettre dans un seul menu ; l'utilisateur doit voir tout de suite où acheter un billet, où contribuer et où retrouver ses opérations.

### 9.4 Qui peut faire quoi

| Action | Visiteur (sans compte) | Compte |
|---|:---:|:---:|
| Consulter évènements et cagnottes | ✅ | ✅ |
| Acheter un billet | ✅ | ✅ |
| Contribuer à une cagnotte | ✅ | ✅ |
| Recevoir son billet / reçu (lien, e-mail) | ✅ | ✅ |
| Créer et gérer une cagnotte ou un évènement | ❌ | ✅ |
| Demander un retrait | ❌ | ✅ |
| Historique, mises à jour, favoris | ❌ | ✅ |

## 10. Règles métier : fonds, retraits, remboursements

### 10.1 Principe général
- ✅ Rallyo **ne détient pas les fonds** des utilisateurs ; les paiements et versements passent par un prestataire agréé.
- 🟡 Un **portefeuille interne** (solde, retraits) est déconseillé : il impose des exigences de sécurité, de rapprochement comptable et de conformité (§17). À écarter sauf avis juridique favorable.

### 10.2 Cagnottes
- ✅ Les contributions sont enregistrées dans Rallyo et les fonds sont **réservés** jusqu'à la fin de la période **ou** jusqu'à l'atteinte de l'objectif.
- ✅ Le créateur peut demander un **retrait anticipé**, soumis à demande et contrôle avant versement.
- ✅ Une fois la cagnotte terminée, le solde éligible devient retirable selon les règles définies.
- ✅ Le bénéficiaire reçoit les fonds via le prestataire de paiement.
- 🟡 **Condition de clôture** (choisie à la création) : à la date de fin · lorsque l'objectif est atteint · **à la date de fin ou à l'objectif atteint (recommandé)**.
- ❓ Une cagnotte peut-elle **dépasser son objectif** ? Si oui, prévoir l'état « Objectif atteint, contributions toujours ouvertes ».
- ✅ **Cagnotte qui n'atteint pas son objectif à la date de fin : le créateur garde tout ce qui a été collecté** (décision du 2026-10-02), sous réserve des règles de versement et de contrôle (§10.4).

### 10.3 Billetterie
✅ Deux modes proposés à l'organisateur :
- **Versement différé** : les recettes restent réservées jusqu'à une date ou une condition définie.
- **Versement direct** : les recettes éligibles sont transférées au bénéficiaire via le prestataire.

❓ Date et condition du versement différé (ex. fin de l'évènement + délai) ; conditions du versement direct.

### 10.4 Retrait anticipé (cagnotte)
Écran « Retirer des fonds » : fonds collectés, déjà retirés, montant disponible, montant à retirer, compte de réception, **montant demandé / frais éventuels / montant reçu**, puis « Demander le retrait ».
- Confirmation : « Votre demande de retrait a été enregistrée. »
- **Statuts :** En vérification → Approuvé → En cours → Versé (trace complète conservée). Cas de rejet ou « à compléter » prévus.
- ❓ Montant ou pourcentage maximal retirable en anticipé, justificatifs demandés, vérification d'identité (KYC).

### 10.5 Indicateurs financiers : « collecté » ≠ « retirable »
À afficher côté créateur pour éviter de laisser croire que tout l'argent collecté est disponible :

| Indicateur | Exemple (cagnotte de 2 000 000 FCFA) |
|---|---|
| Total collecté | 2 000 000 F |
| Déjà retiré | 500 000 F |
| En attente / réservé | 1 500 000 F |
| Disponible pour retrait anticipé | 0 ou montant autorisé |
| Frais | selon le prestataire |

### 10.6 Remboursements
- Le **parcours de demande** (éligibilité, motif, statut, suivi) est dans le périmètre.
- Les **remboursements automatiques** restent hors périmètre (§3.3).
- Le transfert de billet à un tiers n'est possible que si l'organisateur l'autorise.
- ❓ Politique de remboursement (page dédiée dans le pied de page).

### 10.7 Cycle de vie (états à maquetter et à coder)

**Cagnotte :** Brouillon → *(En attente de vérification)* → Active → Objectif atteint → Terminée → Retrait en attente → Retrait en cours → Fonds versés. États complémentaires : Suspendue, Signalée.

**Évènement :** Brouillon → En attente de validation → Publié → Ventes ouvertes → Complet → Évènement terminé.

**Billet :** Valide → Utilisé · Annulé · Remboursé · Transféré.

### 10.8 Billet : règles de sécurité
- Le QR code n'est **pas** valide parce qu'il s'affiche sur un téléphone : sa validité est **vérifiée par le système de contrôle** (statut en base, usage unique).
- Un billet déjà utilisé est refusé ; messages dédiés (billet déjà utilisé, session expirée, compte suspendu).
- Le billet est accessible par **lien reçu** (acheteur sans compte) : télécharger, ajouter au calendrier, partager, voir l'évènement.

### 10.9 Inscription de l'organisateur (identité et moyen de réception)
- ✅ **Toute personne avec un compte** peut organiser un évènement. **Dans tous les cas**, elle enregistre : ses **informations**, une **pièce d'identité** et **un moyen de recevoir l'argent** (**carte bancaire** ou **compte Mobile Money**).
- **Rôle :** vérifier l'organisateur (badge « Vérifié »), sécuriser les versements (§10.3, §10.4) et répondre aux exigences du prestataire de paiement (§17).
- 🟡 **Statuts de vérification :** Non renseigné → En vérification → Vérifié · Refusé · À compléter.
- **Conception :** Rallyo ne stocke aucune donnée bancaire (§9.1). La carte ou le compte Mobile Money est donc **enregistré chez le prestataire de paiement** ; Rallyo ne conserve qu'une **référence (jeton)** et les derniers chiffres affichables.
- ⚠️ **Pièces d'identité = données personnelles sensibles :** stockage privé et chiffré, accès réservé à l'administration, durée de conservation limitée, consentement explicite, cadre légal de protection des données du pays de lancement à vérifier avant ouverture (§17).
- ❓ **Moment de l'enregistrement :** à la création du compte organisateur, avant la première publication, ou avant le premier versement ?
- ❓ **Une publication non vérifiée** est-elle visible (avec mention « non vérifié ») ou bloquée jusqu'à vérification ?
- ❓ **Cagnottes :** la même exigence s'applique-t-elle aux créateurs de cagnottes, ou seulement au moment du retrait (§10.4) ?

## 11. Parcours utilisateurs (à maquetter de bout en bout)

- **A — Acheter un billet :** Accueil / Recherche → Détail de l'évènement → Choix du billet et récapitulatif → Paiement → Confirmation et billet QR.
- **B — Créer et gérer une cagnotte :** Créer → Informations, objectif, bénéficiaire → Prévisualisation et publication → Partage du lien et contributions → Suivi de la collecte et retrait des fonds.
- **C — Organiser un évènement :** Créer → Informations, lieu, date, affiche → Tarifs et quotas de billets → Publication et vente → Tableau de bord, contrôle des entrées et revenus.

## 12. Inventaire des écrans : 119 écrans et sous-écrans

| Section | Écrans | Statut du détail |
|---|:---:|---|
| A. Démarrage et authentification | 10 | détaillé ci-dessous |
| B. Découverte et recherche | 10 | détaillé |
| C. Achat et gestion des billets | 15 | détaillé |
| D. Cagnottes | 21 | détaillé |
| E. Création et gestion des évènements | 22 | **à détailler** |
| F. Paiements, transactions et reçus | 8 | **à détailler** |
| G. Profil, notifications et assistance | 15 | **à détailler** |
| H. Administration interne (web, back-office) | 18 | **à détailler** |
| **Total** | **119** | |

### A. Démarrage et authentification (10)
1 Écran de lancement (logo, chargement) · 2 Introduction (présentation rapide, ignorable) · 3 Choix du parcours (découvrir, acheter, créer un évènement, lancer une cagnotte) · 4 Connexion (téléphone ou e-mail, mot de passe, récupération) · 5 Inscription (nom, prénom, téléphone/e-mail, mot de passe, conditions) · 6 Vérification du compte (code OTP par SMS ou e-mail) · 7 Mot de passe oublié · 8 Nouveau mot de passe · 9 Compléter le profil (photo facultative, nom public, préférences) · 10 Conditions et confidentialité (CGU, politique de confidentialité, consentements).

### B. Découverte et recherche (10)
1 Accueil (à la une, prochains évènements, catégories, cagnottes mises en avant, accès recherche) · 2 Recherche globale (évènements, cagnottes, organisateurs) · 3 Résultats filtrables et triables · 4 Filtres et tri (date, ville, catégorie, prix, gratuit/payant, disponibilité) · 5 Catégories d'évènements · 6 Évènements à venir (par date ou proximité) · 7 Détail d'un évènement · 8 Profil public d'un organisateur · 9 Évènements favoris · 10 Partager un évènement.

### C. Achat et gestion des billets (15)
1 Choix des billets (catégories, tarifs, quantité, limites, disponibilités) · 2 Informations des participants · 3 Récapitulatif de commande (billets, frais éventuels, total) · 4 Identification ou connexion (ou parcours invité si autorisé) · 5 Choix du paiement (selon pays et intégrations) · 6 Paiement en cours (instructions, attente, état) · 7 Paiement réussi · 8 Paiement échoué ou annulé (motif, nouvelle tentative) · 9 Mes billets (à venir, passés, annulés, remboursés) · 10 Détail d'un billet · 11 Billet numérique (QR, consignes, téléchargement) · 12 Détail d'une commande · 13 Reçu ou facture · 14 Demande de remboursement · 15 Transfert de billet (si autorisé).

### D. Cagnottes (21)
1 Découvrir les cagnottes (publiques, récentes, populaires, proches de l'objectif) · 2 Recherche de cagnottes · 3 Détail d'une cagnotte · 4 Liste des contributions (si visibilité autorisée) · 5 Contribuer (montant libre ou prédéfini, nom public ou anonyme) · 6 Récapitulatif de contribution · 7 Paiement de contribution · 8 Confirmation (référence, reçu) · 9 à 12 Créer une cagnotte, étapes 1 à 4 (titre/catégorie/bénéficiaire/objectif ; description/histoire/couverture ; date de fin/visibilité/paramètres ; vérification et publication ou soumission) · 13 Prévisualisation · 14 Mes cagnottes (brouillons, actives, terminées, suspendues) · 15 Gestion d'une cagnotte · 16 Modifier une cagnotte (champs autorisés, traçabilité) · 17 Publier une mise à jour · 18 Retrait des fonds · 19 Suivi des retraits (en attente, en traitement, payé, rejeté, à compléter) · 20 Clôture d'une cagnotte · 21 Signaler une cagnotte.

### E à H : éléments connus (détail à produire écran par écran)
- **E (22) :** création d'évènement en 3 temps (informations, lieu, date, affiche · tarifs et quotas · publication et vente) ; gestion d'évènement avec onglets *Vue d'ensemble, Billets, Participants, Ventes, Paiements, Statistiques, Paramètres* ; contrôle des entrées.
- **F (8) :** historique des transactions filtrable (billet, contribution, retrait, remboursement), reçus.
- **G (15) :** tableau de bord utilisateur, profil, notifications, assistance.
- **H (18) :** back-office web : *Dashboard, Utilisateurs, Évènements, Cagnottes, Paiements, Retraits, Signalements, Modération*.

## 13. Contenu des pages clés

### 13.1 Accueil
Header (Logo, Évènements, Cagnottes, Recherche, Créer, Connexion). Hero : « **Les moments commencent ici.** » + deux actions *Trouver un évènement* / *Créer une cagnotte*, visuel festif. Section **évènements populaires** (cartes en grille, « Voir tous »). Section **cagnottes** en avant. **Catégories** : évènements (Concert, Festival, Conférence, Sport, Formation, Spectacle, Networking, Autre) ; cagnottes (Anniversaire, Mariage, Projet, Solidarité, Association, Urgence, Études, Autre). Pied de page (§9.3).
🟡 Le message d'accueil proposé diffère du slogan actuel « Rassemble. Célèbre. Soutiens. » : à arbitrer.

### 13.2 Catalogue des évènements (`/events`)
Recherche + filtres (pays, ville, date, catégorie, prix, gratuit/payant, disponibilité) + tri (pertinents, plus récents, date la plus proche, prix). **Carte évènement :** image, catégorie, titre, date, lieu, billets vendus, « à partir de X FCFA », jauge de remplissage éventuelle.

### 13.3 Détail d'un évènement
Grande image, titre, catégorie, organisateur, partager, favoris. Date et heure, lieu, **billets vendus / places disponibles / % vendu**, description. **Catégories de billets** (ex. Pass Standard 5 000 · VIP 15 000 · Premium 30 000, avec « N restants »). Dates de la vente (ouverture, fin). Profil public de l'organisateur. Bouton **Acheter un billet**. *(Cette page devient la « page de présentation » personnalisable de l'évènement : galerie, sections, lien partageable. Voir §19.)*

### 13.4 Achat d'un billet (5 étapes, parcours très court)
1 **Billet** (quantité par catégorie, ± ) · 2 **Informations** (nom, prénom, téléphone, e-mail, selon l'évènement ; achat sans compte autorisé) · 3 **Récapitulatif** (ex. 2 × Standard 10 000 F, **total 10 000 F** : la commission Rallyo est déduite des recettes de l'organisateur, elle n'est pas ajoutée à l'acheteur ; l'exemple du document source, « frais 500 F, total 10 500 F », est écarté) · 4 **Paiement** (Mobile Money : MTN, Moov, autres selon pays ; carte Visa / Mastercard) · 5 **Confirmation** (voir, télécharger, recevoir par e-mail).

### 13.5 Le billet
Marque Rallyo, évènement, **QR code**, titulaire, catégorie, date, ville, référence `RLY-XXXXXX`. Actions : télécharger, ajouter au calendrier, partager, voir l'évènement.

### 13.6 Catalogue des cagnottes (`/fundraisers`)
**Carte :** image, titre, **montant collecté / objectif**, **barre de progression et %**, nombre de contributeurs, jours restants.

### 13.7 Détail d'une cagnotte (page centrale côté collecte)
Image, titre, créateur, catégorie, partager, signaler. **Montant très visible** (ex. 1 250 000 FCFA sur 2 000 000) + barre + « 62 % atteint ». **4 statistiques :** contributeurs, collectés, jours restants, objectif. Dates : créée le, fin prévue le. Bouton **Contribuer**. Histoire. **Contributions** récentes (selon confidentialité : nom, montant, ancienneté, « Anonyme »). **Mises à jour du créateur** (texte + photo éventuelle). *(Cette page devient la « page de présentation » personnalisable de la cagnotte : galerie, sections, lien partageable. Voir §19.)*

### 13.8 Contribuer
Montant (10 000 · 25 000 · 50 000 ou libre) → identité (☑ afficher mon nom / ☐ anonyme) → moyen de paiement (Mobile Money, carte) → récapitulatif → « Contribuer X FCFA ».

### 13.9 Créer une cagnotte : assistant en 5 étapes
01 **Informations** (titre, catégorie, objectif, devise, bénéficiaire) · 02 **Présentation** (couverture, galerie, description, histoire, pourquoi, sections : détail au §19) · 03 **Durée** (début, fin, condition de clôture §10.2) · 04 **Retraits** (versement à la fin / retrait anticipé autorisé, informations du bénéficiaire) · 05 **Prévisualisation** (aperçu exact du public) → Enregistrer comme brouillon ou Publier.

### 13.10 Gestion d'une cagnotte
Résumé (montant, %, contributeurs, jours restants). Actions : modifier, partager, publier une mise à jour, voir les contributions, demander un retrait, paramètres, terminer. **Onglets :** Vue d'ensemble · Contributions · Retraits · Mises à jour · Paramètres.

### 13.11 Écran « Objectif atteint »
« Objectif atteint ! », 100 %, nombre de contributions, « Cagnotte terminée, objectif atteint ». Actions : voir les contributions, publier une mise à jour, demander le retrait, partager les résultats.

### 13.12 Tableau de bord utilisateur
« Bonjour, {prénom} » ; compteurs (billets, cagnottes, évènements, contributions) ; activité récente : derniers billets, dernières contributions, notifications, cagnottes et évènements créés.

### 13.13 Espace organisateur et statistiques (privé)
Vue d'ensemble de l'évènement : billets vendus, revenus, taux de remplissage, ventes du jour.
- **Billetterie :** billets vendus, chiffre d'affaires, billets disponibles, taux de remplissage, ventes par jour / catégorie / période.
- **Cagnotte :** montant collecté, objectif, %, nombre de contributeurs, **contribution moyenne**, évolution quotidienne, contributions par date, retraits, solde disponible, date de création, date d'objectif atteint.

### 13.14 Historique des transactions
Page unique, filtres Billet / Contribution / Retrait / Remboursement. Ligne : date, type, montant (+ / −), statut (Confirmée, Versé…).

### 13.15 Authentification
Connexion, inscription, **OTP**, mot de passe oublié / réinitialisé. Visiteur : consulte, achète, contribue, reçoit son billet ou reçu. Compte : créer, gérer, retirer, historique, mises à jour (§9.4).

## 14. Modales et états de l'interface

**Modales à prévoir (pas des pages) :**
- Billetterie : choisir la quantité, confirmation d'achat, paiement, paiement réussi, paiement échoué, annulation, demande de remboursement, transfert de billet.
- Cagnotte : partager, signaler, confirmer une contribution, contribution anonyme, demande de retrait, confirmation de retrait, terminer la cagnotte, publier une mise à jour.
- Compte : déconnexion, suppression du compte, confirmation d'une action sensible.

**États à maquetter pour chaque écran important :** Normal · Chargement · Vide · Erreur · Succès · Désactivé · En attente · Terminé.

**À ne pas oublier :** chargement (recherche, paiement, génération du billet) · états vides (aucun billet, cagnotte, transaction, résultat) · erreurs (connexion perdue, paiement échoué, formulaire incomplet, serveur indisponible) · états intermédiaires (cagnotte en vérification, retrait en traitement, évènement en attente de publication) · confirmations (publication, achat, contribution, remboursement) · sécurité (billet déjà utilisé, session expirée, compte suspendu, action sensible).

## 15. Maquettes Figma

**Structure du fichier (une page Figma par ensemble) :** 00 Cover · 01 Design System (couleurs, typographie, icônes, boutons, champs, cartes, navigation, modales, alertes, statuts) · 02 Public · 03 Ticket Purchase · 04 Fundraising · 05 Organizer · 06 Account · 07 Auth · 08 Modals & States · 09 Responsive.

**Points d'arrêt :** Desktop **1440 px**, Tablette **768 px**, Mobile **390 px**. Un seul système qui se réorganise, pas trois designs distincts.

## 16. Décisions à figer

Les huit questions du document, avec l'état de chaque réponse d'après les choix exprimés :

| # | Question | Réponse | État |
|:-:|---|---|:-:|
| 1 | Plateformes | **Site web responsive** (le document parle de « plateforme web »). Une appli mobile native n'est pas retenue. | ✅ |
| 2 | Pays au lancement | Non tranché. Le **Bénin** est le seul marché cité pour les prestataires (§17) ; devise FCFA. | ❓ |
| 3 | Types de cagnottes | Les catégories prévues couvrent **personnelles et collectes publiques** (Anniversaire, Mariage, Projet, Solidarité, Association, Urgence, Études, Autre). | 🟡 |
| 4 | Qui peut organiser un évènement | **Toute personne avec un compte.** Dans tous les cas, l'organisateur enregistre ses informations, une **pièce d'identité** et **un moyen de recevoir l'argent** (carte bancaire ou compte Mobile Money) : voir §10.9. L'état « En attente de validation » (§10.7) reste à confirmer. | ✅ |
| 5 | Moyens de paiement | **Mobile Money et cartes bancaires.** | ✅ |
| 6 | Réception des fonds | **Versement via le prestataire**, pas de portefeuille Rallyo. Versement direct ou différé selon l'opération. | ✅ |
| 7 | Compte requis | **Sans compte pour acheter ou contribuer ; compte pour créer et gérer.** | ✅ |
| 8 | Direction visuelle | **Festive et colorée** (hero « très festif »). À confirmer face au style actuel de la landing (graffiti). | 🟡 |

**Autres décisions ouvertes issues du document :**
- ❓ Une cagnotte peut-elle dépasser son objectif ? (§10.2)
- ✅ **Cagnotte qui n'atteint pas son objectif à la date de fin : le créateur garde tout ce qui a été collecté** (décision du 2026-10-02), sous réserve des règles de versement et de contrôle (§10.4).
- ❓ Quand et à quelles conditions les recettes d'un évènement sont-elles versées en mode différé ? (§10.3)
- ❓ Plafond et justificatifs du retrait anticipé ; vérification d'identité. (§10.4)
- ✅ **Frais : l'organisateur les supporte** (décision du 2026-10-02) : la commission Rallyo est **déduite de ses recettes**, jamais ajoutée au prix payé par l'acheteur ou le contributeur. ❓ Reste à préciser qui supporte les frais du prestataire Mobile Money.
- ❓ Politique de remboursement (page du pied de page).
- ❓ Message d'accueil : « Les moments commencent ici. » ou « Rassemble. Célèbre. Soutiens. ».

## 17. Conformité réglementaire et prestataire de paiement

> Éléments **issus du document fourni, non vérifiés** : à confirmer auprès de la BCEAO et d'un conseil juridique avant lancement.

- Dans l'**UMOA**, les services de paiement sont encadrés (document : Instruction n°001-01-2024 de la BCEAO) ; les établissements de paiement doivent être agréés ou enregistrés selon leur activité, et la BCEAO publie la liste des établissements agréés.
- Document, pour le **Bénin** (liste au 28 février 2026) : MTN Mobile Money, Moov Money et ID Money figurent parmi les établissements de monnaie électronique.
- **Conséquences de conception :** Rallyo ne doit pas se positionner comme détenteur des fonds (§10.1) ; il faut choisir un **prestataire agréé par marché visé** (**FedaPay**, choix du porteur du 2026-10-03, voir §20 ; ses pays couverts sont à confronter au pays de lancement, §16 question 2) ; les statuts « réservé », « en vérification », « versé » doivent refléter l'état réel chez le prestataire, pas un solde interne.
- Obligations probables à instruire : vérification d'identité des bénéficiaires, conservation des traces de transaction, CGU et politique de remboursement.

## 18. Écarts avec l'existant et chantiers induits

| Sujet | Existant (code actuel) | Ce que demande la V1 | Chantier |
|---|---|---|---|
| **Format de l'appli** | PWA mobile dans un cadre de téléphone sous `/app` (plein écran sur mobile, cadre sur ordinateur) | Site web responsive 1440 / 768 / 390 px, navigation ordinateur complète | Refondre le layout de `/app` en vrai web responsive (le cadre téléphone ne sert plus qu'à la démo de la landing) |
| **Billets** | `events.ticket_price` unique, une table `tickets` | Catégories (Standard, VIP, Premium) avec quotas et dates de vente ; commandes avec plusieurs billets | Nouvelles tables `ticket_types`, `orders`, `order_items` |
| **Achat sans compte** | `tickets.buyer_id` facultatif, `holder_name` | Nom, prénom, téléphone, e-mail de l'acheteur ; accès au billet par lien | Champs acheteur invité, lien de billet signé |
| **États de cagnotte** | `draft / active / completed / closed` | Objectif atteint, retrait en attente / en cours, fonds versés, suspendue, en vérification | Étendre l'énumération et la machine d'états |
| **États d'évènement** | `is_published` (booléen) | Brouillon, en attente de validation, publié, ventes ouvertes, complet, terminé | Remplacer par un statut |
| **Retraits** | Aucun | Demandes, statuts, comptes de réception, traçabilité | Tables `withdrawals`, `payout_accounts` ; écrans §10.4 |
| **Profil organisateur** | `profiles` : nom, téléphone, avatar, `is_verified` | Identité (pièce) + moyen de réception (carte bancaire ou Mobile Money), statuts de vérification (§10.9) | Table `organizer_verifications`, **bucket privé** pour les pièces, `payout_accounts` (jetons du prestataire, jamais de numéro de carte) |
| **Fonds réservés** | Aucun | Indicateurs total / retiré / réservé / disponible | Calcul côté serveur, lié aux statuts du prestataire |
| **Mises à jour, favoris, notifications, signalements, remboursements** | Aucun | Voir §12 et §14 | Tables `campaign_updates`, `favorites`, `notifications`, `reports`, `refunds` |
| **Organisateur public** | Aucun | Profil public (nom, logo, évènements organisés) | Champs et page de profil public |
| **Visibilité des contributions** | Option « anonyme » seulement | Liste publique selon réglage de confidentialité | Réglage par cagnotte |
| **Back-office** | Aucun | 18 écrans (utilisateurs, paiements, retraits, signalements, modération) | Module d'administration protégé |
| **Écrans** | 9 routes (accueil, explorer, créer, billets, profil, 2 détails, paiement, connexion) | 119 écrans et sous-écrans (§12) | Découpage en lots, voir le journal |
| **Textes publics** | FAQ « Que se passe-t-il si l'objectif n'est pas atteint ? » et « Comment retirer mes fonds ? » décrivent un retrait libre | Fonds réservés jusqu'à la fin ou à l'objectif, retrait anticipé contrôlé | **Réécrire la FAQ, `/securite` et `/comment-ca-marche`** une fois les règles du §10 validées |
| **Frais** | Commission déduite de l'organisateur | Exemple d'achat avec frais ajoutés à l'acheteur | **Tranché : on garde la commission déduite de l'organisateur.** Exemple du document écarté (§13.4). Le modèle de frais lui-même a ensuite changé le 2026-10-03 : **5 % + pourcentage FedaPay** (§6) |
| **Slogan / hero** | « Rassemble. Célèbre. Soutiens. » | « Les moments commencent ici. » (proposé) | Arbitrage §16 |
| **Pages de présentation** | Pages de détail simples (image, texte, bouton), non personnalisables, dans le cadre téléphone de `/app` | Page publique partageable par évènement / cagnotte : couverture, galerie, sections, aperçu, publication (§19) | Tables de présentation et de médias, stockage d'images, éditeur simple, pages publiques hors du cadre `/app`. **Dépend de l'authentification** |
| **Paiement** | Simulé (`/app/paiement`) | FedaPay : transaction, paiement Mobile Money, webhook, versements (§20) | Routes serveur, webhook idempotent, table des commandes, statuts réels du prestataire. **Dépend de l'authentification, du schéma V1 et d'une URL publique** |


---

# AJOUTS DU 2026-10-03

## 19. Pages de présentation (vitrines) des évènements et des cagnottes

> **Statut : spécifié, non démarré.** Origine : demande du porteur (2026-10-03). **Dépend de** l'authentification (le propriétaire doit pouvoir modifier sa page), du stockage d'images et du formulaire de création réel (§13.9). Les choix techniques marqués 🟡 sont des propositions à valider.

### 19.1 Objectif
Chaque évènement et chaque cagnotte possède sa **propre mini-page publique**, présentable et partageable (WhatsApp, réseaux sociaux), que son créateur personnalise **simplement** : une belle couverture, des photos, du texte, quelques sections, les informations pratiques et un bouton d'action. Cela étend les pages de détail des §13.3 et §13.7 et l'étape « Présentation » de l'assistant (§13.9) ; ce n'est pas une troisième page à côté.
**Principe : un système de « page de présentation » simple et élégant, pas un constructeur de site.** Un créateur doit pouvoir obtenir quelque chose de beau en ne remplissant presque rien.

### 19.2 Contenu de la page publique
**Commun :** image de couverture · titre · accroche courte · description · galerie de photos · sections de présentation · informations complémentaires · informations de l'organisateur (nom public, §10.9) · bouton d'action principal · bouton **Partager / Copier le lien**.
**Évènement :** date et heure, lieu, catégories de billets avec prix et « N restants » (§13.3) · bouton **Acheter un billet**.
**Cagnotte :** objectif, montant collecté, barre et %, contributeurs, jours restants (§13.7) · bouton **Contribuer**.
*Hors V1 :* vidéo hébergée (un lien YouTube / Vimeo pourra être ajouté plus tard), thèmes multiples, domaine personnalisé, commentaires.

### 19.3 Création et modification par le créateur
- **Parcours évènement :** Informations → Billetterie → Présentation → Prévisualisation → Publier. **Parcours cagnotte :** Informations → Objectif → Présentation → Prévisualisation → Publier (cohérent avec les 5 étapes du §13.9).
- **Étape « Présentation » :** choisir la couverture · ajouter des photos (envoi, **suppression**, **réorganisation**, choix de l'image principale) · titre et accroche · description avec mise en forme limitée (gras, listes, liens) · **sections** (titre + texte ; liste de type « programme » ; liens) · **Prévisualiser** (rendu identique à la page publique) · **Publier / Dépublier**.
- **Peu d'obligatoire :** seuls le titre et la couverture comptent ; sans couverture, une image par défaut aux couleurs de la catégorie. Les sections et la galerie sont facultatives.
- **Plus tard :** bouton « Modifier ma page » depuis la gestion de l'évènement / de la cagnotte (§13.10). Les changements sont enregistrés ; une page dépubliée disparaît du public (404) mais reste modifiable.
- 🟡 Limites proposées : 10 photos par page, 8 sections, formats JPEG / PNG / WebP, taille maximale par image à fixer.

### 19.4 URL, partage et aperçu sur les réseaux
- 🟡 **Pages publiques partageables hors du cadre `/app`** (elles doivent être indexables et ne pas s'afficher dans un cadre de téléphone) : `/e/[slug]` pour un évènement, `/c/[slug]` pour une cagnotte. Les colonnes `slug` (uniques) existent déjà dans le schéma.
- Les pages `/app/evenements/[id]` et `/app/cagnottes/[id]` actuelles sont reprises par ces pages (ou y redirigent) : **une seule source de vérité**, à trancher à l'implémentation.
- **Aperçu de partage (Open Graph / Twitter)** : couverture, titre, accroche. Bouton « Copier le lien » et partage WhatsApp. Pages publiées intégrées au `sitemap.xml`.

### 19.5 Architecture 🟡
Un seul concept, **« Page de présentation »**, rattaché soit à un évènement, soit à une cagnotte, avec des composants communs (couverture, galerie, sections, bouton d'action) et seulement le bloc de chiffres / d'action qui change :
```
PresentationPage ── Évènement  (billets, date, lieu)
                 └─ Cagnotte   (objectif, jauge, contributeurs)
```
**Données (nouvelle migration `0006`+, même schéma que l'existant : tables dans `rallyo`, jamais exposées) :**
- `rallyo.presentation_pages` : identifiant, type (`event` / `campaign`) et identifiant de l'élément (un seul par élément), couverture, accroche, texte, `sections` (JSON : seul endroit où le JSON est justifié, contenu libre et ordonné), statut (`draft` / `published`), dates.
- `rallyo.presentation_media` : page, chemin du fichier, ordre, texte alternatif, indicateur « couverture ».
- **Lecture publique par une fonction `SECURITY DEFINER` préfixée `rallyo_` dans `public`** qui ne renvoie que les pages **publiées** et leurs champs publics (même méthode que les migrations 0002 à 0005).
- **Écriture réservée au propriétaire** (authentification requise ; règles de sécurité par ligne et contrôle côté serveur).

### 19.6 Images
- **Supabase Storage** : un **bucket public** pour les couvertures et galeries (distinct du **bucket privé** des pièces d'identité, §10.9 et §18).
- Redimensionnement et compression avant envoi ; contrôle du type réel et de la taille **côté serveur** (ne pas se fier au navigateur) ; images servies optimisées (`next/image`, domaine du stockage à autoriser).
- ⚠️ Le projet Supabase `my-portos` est **partagé avec le portfolio** et en plan gratuit : **vérifier le quota de stockage** avant d'ouvrir l'envoi de photos, et prévoir la suppression des fichiers orphelins.

### 19.7 Sécurité et modération
- Seul le **propriétaire** (ou une personne ayant la permission) modifie la page ; tout autre accès en écriture est refusé.
- Une page non publiée n'est **jamais** lisible publiquement ; une page publique n'expose **que** les champs prévus (jamais téléphone, e-mail, pièce d'identité, billets ni contributions individuelles).
- Texte : **aucun HTML brut accepté** (mise en forme limitée et nettoyée, pour éviter l'injection de code) ; liens externes avec `rel="noopener noreferrer nofollow"`.
- Pages et images **signalables** (§14) ; modération depuis le back-office (§18).

### 19.8 Qualité attendue
Mobile d'abord (tablette et ordinateur soignés) · images paresseuses avec texte alternatif · animations légères qui respectent « réduire les animations » · pas de nouvelle dépendance lourde · design cohérent avec l'existant, avec comme **référence d'ambiance** l'image mobile fournie par le porteur (composition, cartes, boutons, rapport image / information) **sans la copier**.

### 19.9 Design de référence (image fournie par le porteur le 2026-10-03)
> Le fichier image est conservé par le porteur (non stocké dans le dépôt). Description fidèle de ce que montre la référence, pour que l'équipe puisse s'en servir. **À utiliser comme direction d'ambiance, pas à copier** ; couleurs et typographies restent celles de Rallyo.
- **Ambiance générale :** thème **sombre**, boutons principaux en **dégradé rose vif → magenta**, accents rose sur fond noir, grandes photos d'ambiance (concert, foule, lumières violettes), coins très arrondis.
- **Écran d'accueil :** en-tête avec localisation et photo de profil ; **barre de recherche** arrondie avec icône de filtres ; section « Évènements près de toi » avec lien « Tout voir » ; **carte d'évènement blanche** : photo, pastille de date en haut à droite, titre, lieu, **prix par personne**, gros bouton « Réserver » en dégradé ; **cartes empilées** derrière pour suggérer d'autres évènements ; rangée « À venir » ; **barre de navigation basse en pastille sombre** avec cinq icônes (accueil actif dans un rond clair).
- **Écran de détail :** photo **plein cadre** qui se fond dans le noir par un dégradé ; titre, **étiquette de catégorie** et « N personnes y vont → » ; lignes d'information avec **icône dans un rond rose sombre** (date et horaires avec bouton « Ajouter à mon calendrier », lieu avec bouton « Voir sur la carte », organisateur) ; **bouton d'action fixe en bas** en dégradé.
- **Écran de billet :** fond noir, en-tête « Billet » avec retour et cloche ; **billet blanc à encoches rondes** sur les côtés, avec photo, titre, lieu, nom du porteur, place, date, heure et **code-barres** ; bouton « Télécharger le billet » en dégradé.
- **Adaptations Rallyo :** montants en **FCFA** ; **QR code** à la place du code-barres (le contrôle d'entrée est prévu en QR) ; textes en français ; **cagnotte** : même composition avec jauge de progression à la place du prix et bouton « Contribuer » ; cohérence avec la palette actuelle (violet, rose, cyan) et le thème sombre déjà en place dans `/app`.
- **Application :** appli (`/app`) et pages de présentation publiques (§19.1 à 19.8), après la reprise des textes publics. Les cartes-billets de la galerie de l'accueil et l'écran « Mes billets » ont déjà un esprit proche (billet à encoches).

## 20. Paiement avec FedaPay

> **Statut : prestataire choisi par le porteur (2026-10-03). Intégration à faire plus tard**, après l'authentification, le schéma V1 (commandes, retraits) et la mise en ligne d'une URL publique (nécessaire au webhook). **Aucun code de paiement n'existe**; `/app/paiement` reste simulé.
> **Sources :** pages officielles fedapay.com (accueil, `tarifications`) et documentation `docs-v1.fedapay.com` (méthodes de paiement, transactions), consultées le 2026-10-03. ⚠️ La page des tarifs semblait datée d'environ onze mois : **tous les chiffres ci-dessous sont à reconfirmer auprès de FedaPay avant toute décision.**

### 20.1 Ce que FedaPay annonce
- **Pays :** Bénin, Côte d'Ivoire, Togo, Sénégal, Niger (cinq pays cités). La page d'accueil parle aussi de « toute la zone UEMOA » : à confirmer avec FedaPay.
- **Moyens :** Mobile Money, cartes bancaires et wallets. **Bénin :** MTN, Moov, Celtiis, Coris Money, BMO. **Côte d'Ivoire :** MTN (dans le tableau des tarifs).
- **Fonctionnement :** création d'une transaction par l'API, puis génération d'un lien et d'un jeton de paiement ; paiement Mobile Money **avec ou sans redirection** (le client valide sur son téléphone avec son code secret) ; **environnements « sandbox » (test) et « live »** ; **webhooks** ; pas d'abonnement.
- **Reversement :** sur compte Mobile Money ou bancaire **après 3 jours ouvrés**.
- Les frais peuvent être configurés **à la charge du client ou du marchand**.

### 20.2 Tarifs publiés (à reconfirmer)
| Moyen | Commission par transaction |
|---|---|
| Bénin : MTN, Moov, Celtiis | **1,8 %** |
| Bénin : Coris Money, BMO | **4 %** |
| Côte d'Ivoire : MTN | **4 %** |
| Cartes bancaires | *non trouvé : à demander* |

**Versements vers un compte Mobile Money (frais fixes par virement) :** 0 à 10 000 F : 150 F · 10 001 à 50 000 : 300 F · 50 001 à 150 000 : 800 F · 150 001 à 500 000 : 2 000 F · plus de 500 000 : 2 500 F. Des frais supplémentaires peuvent s'ajouter entre réseaux différents.

### 20.3 Conséquence sur nos taux : ✅ résolu par le modèle « 5 % + FedaPay » (2026-10-03)
La commission Rallyo (**ancienne** grille de `src/lib/fees.ts`, tranches progressives de 10 % à 3 %, abandonnée le 2026-10-03) devait couvrir le coût FedaPay. Voici l'analyse qui a motivé le changement : le **taux réellement payé** par l'organisateur dépendait du montant :

| Montant collecté | Taux Rallyo réel | Marge si FedaPay à 1,8 % | Marge si FedaPay à 4 % |
|---|---|---|---|
| 100 000 F | 10,00 % | 8,2 pts | 6,0 pts |
| 500 000 F | 8,40 % | 6,6 pts | 4,4 pts |
| 1 000 000 F | 7,20 % | 5,4 pts | 3,2 pts |
| 2 500 000 F | 5,28 % | 3,5 pts | 1,3 pt |
| 5 000 000 F | 4,14 % | 2,3 pts | **0,14 pt** |
| au-delà d'environ 5,7 M F | < 4 % | positive | **négative** |

*(Calcul à partir de l'ancienne grille, avant frais de versement et autres coûts.)*
- Avec les moyens à 1,8 % (Bénin : MTN, Moov, Celtiis), la marge restait confortable partout.
- Avec les moyens à 4 % (Coris, BMO, MTN Côte d'Ivoire), **la marge disparaissait sur les grosses collectes** (≈ 5 M F), et devenait négative au-delà.
- Les **frais fixes de versement** (150 à 2 500 F par virement) pèsent sur les petits retraits répétés (150 F sur 10 000 F = 1,5 %).

**✅ Résolu le 2026-10-03 :** le porteur a remplacé la grille par **5 % + pourcentage FedaPay** (§6). Le coût du prestataire est répercuté, donc **la marge de Rallyo est toujours de 5 %, quel que soit le moyen de paiement ou le montant**. Le tableau ci-dessus est conservé comme historique.
- ❓ **Reste ouvert :** (c) qui supporte les **frais fixes de versement** (150 à 2 500 F par virement) ; le **tarif des cartes bancaires** ; et la confirmation que le total est **déduit de l'organisateur** (l'option « frais à la charge du client » existe chez FedaPay mais contredit la décision du 2026-10-02).

### 20.4 Conséquences sur le produit
- **Délais :** le reversement prend jusqu'à 3 jours ouvrés : les statuts « réservé », « en vérification », « versé » (§10.7, §17) et les délais annoncés aux organisateurs doivent s'aligner sur la réalité du prestataire.
- **Pays :** ne pas promettre « toute l'Afrique de l'Ouest » dans les textes publics tant que les pays réellement ouverts ne sont pas confirmés (§16 question 2).
- **Remboursements (§10.6) et versements (§10.4) :** à vérifier dans la documentation FedaPay (existence et conditions des API de remboursement et de transfert).
- **Conformité :** FedaPay détient et reverse les fonds, ce qui va dans le sens du §10.1 (pas de portefeuille Rallyo). Conditions d'ouverture d'un compte « live » (pièces, activité) à vérifier.
- **Montant minimum :** nos contributions démarrent à 100 F ; le minimum accepté par FedaPay est à vérifier.

### 20.5 Intégration proposée 🟡
1. **Uniquement côté serveur** (routes Next.js). Clés dans des variables d'environnement **non publiques** (jamais `NEXT_PUBLIC_`) : clé secrète, secret du webhook, environnement `sandbox` ou `live`.
2. **Le montant est toujours recalculé côté serveur** (jamais celui envoyé par le navigateur) ; la commission est calculée avec `fees.ts`.
3. **Flux :** le visiteur lance le paiement → création d'une ligne en statut `pending` (`contributions` ou commande) → création de la transaction FedaPay et du lien → le client paie → **webhook** (`/api/webhooks/fedapay`) : **vérification de la signature** (méthode à lire dans la documentation officielle), mise à jour du statut, ajout au montant collecté, émission des billets.
4. **Idempotence :** les colonnes `provider_ref` de `contributions` et `tickets` sont déjà **uniques** ; un webhook rejoué ne doit jamais créer deux billets ni deux contributions.
5. **Jamais de confirmation depuis le navigateur :** la page de retour relit l'état côté serveur.
6. **Tests en « sandbox » d'abord :** paiement réussi, échoué, annulé, expiré, webhook rejoué, doublon, signature invalide.
7. Le **webhook exige une adresse publique** : à prévoir après le déploiement (ou un tunnel de test).

### 20.6 À faire par le porteur
- Créer un compte FedaPay, obtenir les **clés de test (sandbox)** ; le compte « live » demandera probablement des vérifications (à confirmer).
- Poser à FedaPay les questions du §20.2 à §20.4 (tarif cartes, pays ouverts, remboursements, versements, minimum, signature du webhook).
- Trancher les décisions du §20.3.
