# Sécurité et bonnes pratiques

> Document de référence à réutiliser sur chaque projet.


# Checklist sécurité d'une application (réutilisable pour chaque projet)

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
