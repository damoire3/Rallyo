# Sécurité, stack figée et bonnes pratiques

> Document de référence à réutiliser sur chaque projet.
> Partie A : la stack à ne pas casser. Partie B : leçons de la panne de connexion.
> Partie C : points constatés dans SIVEP. Partie D : checklist sécurité complète.

---

# A. Stack figée (versions qui fonctionnent ensemble)

Versions vérifiées le 28/09/2026, connexion testée de bout en bout.

| Élément                 | Version                    | Remarque                                                   |
| ----------------------- | -------------------------- | ---------------------------------------------------------- |
| Next.js                 | 15.5.26                    | Le projet utilise `next.config.ts` : Next 14 ne le lit pas |
| React / React DOM       | 19.x                       | Requis par Next 15                                         |
| next-auth               | **4.24.x (v4 uniquement)** | Le code utilise `getServerSession`, absent de la v5        |
| bcryptjs                | 2.4.x                      | + `@types/bcryptjs` 2.x                                    |
| Prisma / @prisma/client | 6.19.x                     | Lancer `npx prisma generate` après réinstallation          |
| Tailwind CSS            | 4.x                        | Fourni par create-next-app                                 |
| Base de données         | PostgreSQL (Supabase)      | `DATABASE_URL` dans `.env`                                 |
| Node.js                 | 25.x (local)               | Préférer une version LTS en production                     |

**Règle d'or : ne jamais changer de version majeure sans le décider.**
Quand on demande à une IA ou à un outil d'installer un package, préciser la version :

```bash
npm install next-auth@4        # et NON  npm install next-auth  (=> v5 beta)
```

---

# B. Compétences à surveiller pour ne plus perdre du temps

## B1. Cohérence package.json / package-lock.json / node_modules

Cause de la panne : `node_modules` contenait `next-auth 5.0.0-beta`, `bcryptjs 3` alors que le code
et le `package.json` visaient la v4 et bcryptjs 2. Résultat : erreur 500 sur `/api/auth/*`,
donc impossible de se connecter, alors que la base et les comptes étaient corrects.

Réflexes :

- [ ] Après un clone, un changement de branche ou une réinstallation : `npm ci` (respecte exactement le lockfile).
- [ ] Vérifier les versions réelles : `npm ls next next-auth react react-dom bcryptjs @prisma/client`
- [ ] Versions **exactes** (sans `^`) pour les paquets critiques : next, next-auth, prisma.
- [ ] Toujours commiter `package.json` ET `package-lock.json` ensemble.
- [ ] Ne jamais lancer `npm install <paquet>` sans version pour un paquet d'authentification.
- [ ] Attention aux paquets dont `latest` est une bêta (ex. `next-auth`).
- [ ] Lire les warnings `Attempted import error` ou `is not exported from` : ils signalent presque toujours une mauvaise version.

## B2. Variable d'environnement NODE_ENV

- [ ] Ne jamais définir `NODE_ENV` globalement dans Windows.
- [ ] `next dev` gère `NODE_ENV` tout seul (`development`). Avec `production`, le middleware plante (`EvalError`).
- [ ] Vérifier : `echo $env:NODE_ENV` (PowerShell) — doit être vide.
- [ ] Si besoin : `$env:NODE_ENV='development'` puis `npm run dev`.

## B3. Méthode de diagnostic "je n'arrive pas à me connecter"

1. Lire le **terminal du serveur** avant tout (l'erreur réelle y est).
2. Tester `http://localhost:3000/api/auth/providers` : doit renvoyer du JSON (200). Si 500, le problème est côté serveur, pas dans les identifiants.
3. Vérifier que la base répond et que l'utilisateur existe et est `actif`.
4. Vérifier que le hash bcrypt correspond au mot de passe (`bcrypt.compare`).
5. Vérifier `.env` : `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
6. Vérifier les versions installées (B1).
7. Seulement ensuite, regarder le code du formulaire.

## B4. Travailler avec une IA sur ce projet

- [ ] Donner d'entrée la stack figée (partie A) et demander de ne pas changer de version majeure.
- [ ] Demander de proposer avant de modifier `package.json`.
- [ ] Ne jamais coller ou laisser lire un `.env` réel dans une conversation. Utiliser `.env.example`.
- [ ] Si un secret a été exposé (chat, capture, commit) : le régénérer.

---

# C. Points de sécurité constatés dans SIVEP (à traiter avant la production)

Constats issus des fichiers lus (`auth.ts`, `middleware.ts`, page de login, `seed.ts`, `.env`).
Les routes `src/app/api/*` et les pages n'ont **pas** encore été auditées : à faire.

| Priorité | Constat                                                                                                                                                     | Action                                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Critique | La page `/login` affiche les **comptes de démo avec leurs mots de passe** (ADMIN-001, etc.)                                                                 | Supprimer le bloc `COMPTES_DEMO` en production (ou le conditionner à `NODE_ENV === "development"`)                                 |
| Critique | Mots de passe de démo prévisibles dans `seed.ts` (ex. `Admin@2026`)                                                                                         | Changer tous les mots de passe avant la mise en ligne, forcer le changement à la première connexion                                |
| Critique | `.env` contient les vrais accès Supabase et le secret NextAuth ; il a été exposé pendant une session d'aide                                                 | Régénérer le mot de passe DB Supabase et `NEXTAUTH_SECRET` ; vérifier que `.env` est bien dans `.gitignore` et jamais commité      |
| Haute    | Le middleware ne protège que des **pages** (`ROUTES_PROTEGEES`). Les routes `/api/*` (personnes, casier, amendes, agents, sms...) ne sont pas dans la liste | Chaque route API doit vérifier elle-même session + rôle + propriété (voir sections 1 et 4)                                         |
| Haute    | Pas de limitation de tentatives sur le login                                                                                                                | Ajouter un rate limit (ex. 5 essais/minute par IP + matricule)                                                                     |
| Haute    | Données sensibles (casier judiciaire, NPI, identités)                                                                                                       | Contrôle d'accès par rôle et par poste, journal d'audit de chaque consultation                                                     |
| Moyenne  | Le JWT n'est pas revérifié : un compte désactivé (`actif=false`) reste connecté jusqu'à expiration                                                          | Réduire la durée de session et/ou revérifier `actif` dans le callback `jwt`                                                        |
| Moyenne  | Session JWT de 30 jours par défaut                                                                                                                          | Définir `session.maxAge` plus court pour une application policière                                                                 |
| Moyenne  | Message d'erreur unique au login (bien), mais aucune journalisation des échecs                                                                              | Journaliser tentatives réussies et échouées (sans mot de passe)                                                                    |
| Moyenne  | `public/uploads` : dossier public                                                                                                                           | Vérifier type, taille, nom de fichier généré côté serveur ; préférer un stockage privé avec URLs signées pour les pièces sensibles |
| Basse    | `SMS` et `PDF` : entrées utilisateur injectées                                                                                                              | Valider et échapper les données avant envoi/génération                                                                             |

Modules SIVEP concernés par l'autorisation : véhicules, personnes (+ casier), amendes, alertes,
objets trouvés, signalements citoyens, journal, rapports, agents.
Rôles : AGENT, INSPECTEUR, COMMISSAIRE, DIRECTEUR_REGIONAL, ADMIN — définir noir sur blanc
ce que chaque rôle peut lire, créer, modifier, supprimer.

---

# D. Checklist sécurité d'une application (réutilisable pour chaque projet)

## 1. Routes / endpoints API

Pour chaque route, vérifier :

- [ ] La route doit-elle être publique ?
- [ ] Si elle est privée : authentification obligatoire.
- [ ] L'utilisateur connecté a-t-il le droit d'utiliser cette route ?
- [ ] Vérification du rôle (user, admin, manager, etc.).
- [ ] Vérification de la propriété de la ressource (`/users/123/orders` ne doit pas être lisible par l'utilisateur 456).
- [ ] Validation de tous les paramètres : body, query params, path params.
- [ ] Limitation du nombre de requêtes.
- [ ] Gestion correcte des erreurs.
- [ ] Ne jamais retourner de données inutiles.
- [ ] Ne jamais retourner de mots de passe, tokens, secrets, etc.
- [ ] Vérifier les méthodes HTTP autorisées.
- [ ] Vérifier les uploads.
- [ ] Ajouter des logs pour les opérations sensibles.

Mauvais exemple : `GET /api/users/123` qui renvoie `password`, `resetToken`, `role`...
Même authentifié, c'est dangereux.

## 2. Authentification

- [ ] Hashage des mots de passe avec Argon2id ou bcrypt correctement configuré.
- [ ] Jamais de mot de passe en clair.
- [ ] Politique de mot de passe raisonnable.
- [ ] Protection contre le brute-force et rate limiting sur le login.
- [ ] Protection contre l'énumération des comptes.
- [ ] Vérification email si nécessaire.
- [ ] 2FA/MFA pour les comptes sensibles.
- [ ] Reset password sécurisé : tokens à durée limitée et à usage unique.
- [ ] Déconnexion correcte, révocation et expiration des sessions.
- [ ] Gestion des appareils/sessions actives.

## 3. JWT / Sessions / Tokens

- [ ] Jamais de secret JWT dans le frontend.
- [ ] Secret suffisamment robuste.
- [ ] Expiration courte pour les access tokens.
- [ ] Refresh token protégé, avec rotation et révocation possible.
- [ ] Vérification de l'algorithme.
- [ ] Ne jamais faire confiance au contenu d'un JWT sans vérifier la signature.
- [ ] Aucune information sensible dans le JWT.
- [ ] Vérifier issuer, audience, expiration lorsque pertinent.
- [ ] Web : cookies HttpOnly + Secure + SameSite plutôt que tokens sensibles dans localStorage.

## 4. Autorisation (partie la plus importante)

Il ne suffit pas de vérifier « est-ce que cette personne est connectée ? ».
Il faut vérifier « a-t-elle le droit de faire **cette** action ? ».

- `GET /api/admin/users` : authentifié **et** rôle admin.
- `DELETE /api/orders/458` : authentifié **et** (propriétaire OU admin autorisé).

- [ ] RBAC (rôles) et permissions.
- [ ] Ownership.
- [ ] Accès horizontal et vertical.
- [ ] IDOR / BOLA.
- [ ] Accès aux ressources supprimées.
- [ ] Accès aux ressources d'une autre organisation/entreprise (pour SIVEP : autre poste, autre pays).

## 5. Base de données

- [ ] Utilisateur DB avec permissions minimales, jamais root/superuser depuis l'application.
- [ ] Requêtes paramétrées, ORM correctement utilisé, protection SQL injection.
- [ ] Contraintes DB, foreign keys, transactions pour opérations critiques.
- [ ] Backups, backups chiffrés, **test de restauration**.
- [ ] Pas de données sensibles dans les logs.
- [ ] Pas de DB exposée directement à Internet.
- [ ] Chiffrement au repos lorsque nécessaire.

## 6. Injection

Tester : SQL, NoSQL, Command, LDAP, Template, XPath, Path Traversal, Header Injection.

```js
// Dangereux
db.query(`SELECT * FROM users WHERE email = '${email}'`);
// Préférer
db.query("SELECT * FROM users WHERE email = $1", [email]);
```

## 7. Frontend

Le frontend n'est jamais une zone de confiance : tout peut être modifié dans le navigateur.

- [ ] Ne jamais faire confiance au `role`, au prix, au `userId` ni aux permissions envoyés par le frontend.
- [ ] Aucun secret ni clé API privée dans le frontend.
- [ ] Minifier/bundler n'est pas une protection.
- [ ] Protection XSS, CSP, échappement des données affichées, sanitization du HTML autorisé.
- [ ] Protection CSRF lorsque nécessaire.
- [ ] CORS correctement configuré.

## 8. CORS

Éviter `Access-Control-Allow-Origin: *` sur une API privée. Définir précisément les origines
(`https://monapp.com`, `https://admin.monapp.com`).

- [ ] Origins, Methods, Headers, Credentials, Preflight.
- [ ] Pas de wildcard inutile.

## 9. Rate limiting

Limiter : `POST /login`, `/register`, `/forgot-password`, `/verify-code`, `/payment`, `/upload`,
`/send-message`, et certaines routes de lecture.

Exemple : login = 5 tentatives / minute / IP + compte. Limites différentes pour utilisateurs authentifiés.

---

## 10. Upload de fichiers

Images, PDF, vidéos, documents, ZIP :

- [ ] Taille maximale et limitation du nombre de fichiers.
- [ ] Type MIME, extension, signature réelle (magic bytes).
- [ ] Nom de fichier généré côté serveur.
- [ ] Pas d'exécution directe des fichiers uploadés.
- [ ] Stockage hors du répertoire public si possible.
- [ ] Antivirus/malware scanning selon le risque.
- [ ] Autorisation d'accès au fichier, URLs temporaires pour fichiers privés.

## 11. Secrets

Jamais de `const STRIPE_SECRET = "sk_live_..."` dans le code ou sur GitHub.
`.env` en développement, gestionnaire de secrets sécurisé en production.

- [ ] API keys, DB passwords, JWT secrets, encryption keys, OAuth secrets, payment secrets, SSH keys, cloud credentials.
- [ ] `.env` dans `.gitignore`.

## 12. GitHub / Git

Avant de publier :

- [ ] Aucun `.env`, mot de passe, token, clé privée, certificat privé.
- [ ] Aucun dump de DB ni fichier contenant des données clients.
- [ ] Scanner les secrets dans Git et vérifier l'historique.

Supprimer un secret du dernier commit ne suffit pas : il reste dans l'historique Git. Le régénérer.

## 13. HTTPS / réseau

- [ ] HTTPS obligatoire, redirection HTTP vers HTTPS, TLS correct.
- [ ] Cookies Secure, HSTS.
- [ ] Aucune donnée sensible via HTTP.
- [ ] Vérification des certificats côté mobile lorsque pertinent.

## 14. Headers HTTP

`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, et protections anti-framing/clickjacking.

## 15. Validation des données

Tout input utilisateur est potentiellement hostile. Valider : email, username, password, phone,
date, price, quantity, IDs, URLs, JSON, HTML, files, search, filters.

Exemple : `quantity = -999999` ou `"DROP TABLE..."` doit être géré par le backend.

## 16. Paiements

- [ ] Ne jamais faire confiance au frontend : vérifier montant et devise côté serveur.
- [ ] Vérifier le statut de transaction auprès du prestataire.
- [ ] Vérifier les webhooks et leur signature.
- [ ] Idempotency keys, empêcher les doubles paiements.
- [ ] Journaliser les transactions.
- [ ] Ne pas stocker inutilement les données de carte.
- [ ] Séparer environnements test/live.

## 17. Webhooks

Ne jamais faire simplement `if (body.status === "paid") giveProduct();`.
Vérifier que la requête vient réellement du prestataire :

- [ ] Signature, secret, timestamp lorsque disponible.
- [ ] ID de transaction, idempotence.
- [ ] Montant, devise, destinataire.
- [ ] État actuel de la transaction.

## 18. Logs

Logger : login, logout, échec de login, changement de mot de passe/email/permission, actions admin,
paiements, remboursements, erreurs API.

Ne jamais logger : password, OTP, access token, refresh token, API secret, carte bancaire.

## 19. Monitoring

- [ ] Monitoring serveur et API, alertes.
- [ ] Erreurs 500, tentatives de connexion anormales, trafic inhabituel, pics de requêtes.
- [ ] CPU/RAM, DB, stockage.
- [ ] Expiration des certificats.

## 20. Application mobile

- [ ] Aucun secret dans l'application.
- [ ] Stockage sécurisé des tokens (Android Keystore / iOS Keychain), pas de mot de passe en clair.
- [ ] HTTPS, permissions minimales.
- [ ] Protéger les deep links, vérifier les WebViews, ne pas exposer de composants Android inutilement.
- [ ] Désactiver les logs sensibles en production, vérifier les données en cache.
- [ ] Protéger les captures d'écran sur les écrans sensibles si nécessaire.
- [ ] Certificate/public-key pinning selon le niveau de menace.

## 21. Dépendances

- [ ] `npm audit` avant production.
- [ ] Packages obsolètes, abandonnés, vulnérables, inutiles.
- [ ] Versions verrouillées, lockfile présent.
- [ ] Même démarche pour Python/Kotlin/etc.

---

## 22. Serveur / Docker / VPS

- [ ] SSH par clé, login root désactivé si possible.
- [ ] Firewall, ports minimaux, DB non exposée.
- [ ] Docker non exposé inutilement, containers non privilégiés, images à jour.
- [ ] Secrets hors de l'image.
- [ ] Backups, monitoring, mises à jour de sécurité.

## 23. Cloud / stockage (S3, Supabase, Firebase, Cloudflare...)

- [ ] Vérifier les permissions (Supabase : RLS, clés `anon` vs `service_role`).
- [ ] Bucket privé par défaut, pas de données publiques accidentelles.
- [ ] URLs signées pour données privées.
- [ ] Clés API limitées, permissions minimales.
- [ ] Logs d'accès, backups.

## 24. Admin panel

- [ ] URL `/admin` correctement protégée, MFA, sessions courtes.
- [ ] Permissions granulaires, confirmation pour opérations destructives.
- [ ] Logs des actions administrateur.
- [ ] Protection contre brute-force.
- [ ] Pas de compte admin partagé, possibilité de révoquer un compte admin.

## 25. Tests de sécurité (avant production)

- **Auth** : login, logout, register, reset password, change password, 2FA, sessions.
- **API** : 401, 403, 404, 400, 429, 500.
- **Autorisation** : User A vers données User B ; user vers endpoint admin ; modification d'une ressource d'autrui.
- **Injection** : inputs inattendus.
- **XSS** : champs qui affichent du contenu utilisateur.
- **Upload** : gros fichier, mauvaise extension, faux MIME, fichier inattendu.

## 26. Tests automatisés (CI/CD)

```
Lint -> Unit tests -> Integration tests -> Dependency scan -> Secret scan -> SAST -> Build -> Deploy
```

Éventuellement DAST sur un environnement de staging.

## 27. Le principe le plus important

> Ne jamais faire confiance aux données venant du client.

Si le frontend envoie `{ "userId": 15, "price": 500, "role": "admin" }`, le backend doit tout
considérer comme non fiable et déterminer lui-même :

```
Qui est l'utilisateur ? -> Est-il authentifié ? -> Quel est son rôle ?
-> A-t-il accès à cette ressource ? -> Quel est le vrai prix ?
-> L'opération est-elle autorisée ? -> Exécuter
```

---

# E. La checklist ultime (à copier dans `SECURITY.md` de chaque projet)

- [ ] Authentication
- [ ] Authorization
- [ ] Sessions
- [ ] JWT
- [ ] Passwords
- [ ] Rate limiting
- [ ] CORS
- [ ] CSRF
- [ ] XSS
- [ ] SQL Injection
- [ ] NoSQL Injection
- [ ] IDOR / BOLA
- [ ] SSRF
- [ ] Path Traversal
- [ ] Command Injection
- [ ] File Upload
- [ ] API validation
- [ ] Error handling
- [ ] Secrets
- [ ] Environment variables
- [ ] Git history
- [ ] Database
- [ ] Backups
- [ ] Encryption
- [ ] HTTPS
- [ ] HTTP headers
- [ ] Cookies
- [ ] Logs
- [ ] Monitoring
- [ ] Webhooks
- [ ] Payments
- [ ] Admin
- [ ] Mobile security
- [ ] Dependencies
- [ ] Docker
- [ ] VPS
- [ ] Cloud permissions
- [ ] CI/CD
- [ ] SAST
- [ ] DAST
- [ ] Penetration testing
- [ ] Privacy
- [ ] Data deletion
- [ ] Data retention
- [ ] Incident response

La sécurité ne se limite pas à « sécuriser les routes ». Une application peut avoir des routes
parfaitement protégées et rester vulnérable à cause d'un mauvais contrôle d'autorisation, d'une
clé API exposée, d'un bucket public, d'un webhook falsifiable ou d'une dépendance compromise.

Checklist adaptée à la stack : Next.js/React + Node (Fastify/Express) + PostgreSQL + mobile.
