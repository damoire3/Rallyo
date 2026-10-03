import { FEE_MAX_RATE, FEE_MIN_RATE } from "./fees";

const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Visuels de démonstration (Unsplash) — à remplacer par des visuels propres avant le lancement.
export const IMAGES = {
  heroL1: u("photo-1533174072545-7a4b6ad7a6c3", 1920),
  heroL2: u("photo-1470229722913-7c0e2dbbafd3", 1600),
  murBg: u("photo-1571896349842-33c89424de2d", 1920),
  murPortraitSmile: u("photo-1524504388940-b1c1722653e1", 700),
  murConcertLights: u("photo-1470229722913-7c0e2dbbafd3", 700),
  murStreetArt: u("photo-1533158307587-828f0a76ef46", 700),
  murFestivalDance: u("photo-1533174072545-7a4b6ad7a6c3", 700),
  murMarketColor: u("photo-1555529771-122e5d9f2341", 900),
  murGraffitiColorful: u("photo-1607604760190-88f5b430853a", 700),
  murHandsRaised: u("photo-1521737604893-d14cc237f11d", 700),
  pourquoiBg: u("photo-1533158307587-828f0a76ef46", 1920),
  step1Bg: u("photo-1571896349842-33c89424de2d", 1400),
  step2Bg: u("photo-1607604760190-88f5b430853a", 1400),
  step3Bg: u("photo-1519608487953-e999c86e7455", 1400),
  step4Bg: u("photo-1554672408-730436b60338", 1400),
  galerieBg: u("photo-1607604760190-88f5b430853a", 1920),
  strip: [
    u("photo-1483985988355-763728e1935b", 500),
    u("photo-1470229722913-7c0e2dbbafd3", 500),
    u("photo-1533158307587-828f0a76ef46", 500),
    u("photo-1516450360452-9312f5e86fc7", 500),
    u("photo-1571266028243-e4bb35d5c4ac", 500),
    u("photo-1533174072545-7a4b6ad7a6c3", 500),
    u("photo-1524504388940-b1c1722653e1", 500),
    u("photo-1571896349842-33c89424de2d", 500),
    u("photo-1521737604893-d14cc237f11d", 500),
    u("photo-1607604760190-88f5b430853a", 500),
    u("photo-1519608487953-e999c86e7455", 500),
    u("photo-1555529771-122e5d9f2341", 500),
  ],
  casFamille: u("photo-1524504388940-b1c1722653e1", 700),
  casClub: u("photo-1521737604893-d14cc237f11d", 700),
  casArtiste: u("photo-1470229722913-7c0e2dbbafd3", 700),
  casBg: u("photo-1571896349842-33c89424de2d", 1920),
  pricingBg: u("photo-1607604760190-88f5b430853a", 1920),
  ctaBg: u("photo-1516450360452-9312f5e86fc7", 1800),
};

export const NAV_LINKS = [
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/pourquoi-rallyo", label: "Pourquoi Rallyo" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/securite", label: "Sécurité" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Aide" },
];

export const MARQUEE = [
  "CAGNOTTES", "BILLETTERIE", "MOBILE MONEY", "DONS ANONYMES", "E-BILLETS QR", "FCFA", "AFRIQUE DE L’OUEST",
];

export const WHY_CARDS = [
  { icon: "smartphone", title: "Mobile Money d’abord", text: "Paie et reçois comme tu en as l’habitude : MTN, Moov, Celtiis, Orange Money, Wave, selon ton pays." },
  { icon: "zap", title: "En ligne en 5 minutes", text: "Un titre, un objectif, une photo : ta page est prête à être partagée sur WhatsApp." },
  { icon: "eye-off", title: "Dons anonymes", text: "Certains veulent donner sans être vus. Ton nom n’apparaît ni sur la page ni dans la liste des soutiens." },
  { icon: "qr-code", title: "Billets sans papier", text: "E-billet avec QR code envoyé juste après le paiement, un seul passage par code." },
];

export const STATS = [
  { target: 0, suffix: " FCFA", label: "à l’inscription" },
  { target: 5, suffix: " min", label: "pour lancer ta page" },
  { target: 6, suffix: "", label: "pays d’Afrique de l’Ouest visés" },
  { target: 24, suffix: "/7", label: "collecte ouverte, partage par lien" },
];

export const STEPS_PIN = [
  { n: "01", title: "Crée ta page", text: "Titre, histoire, objectif ou prix du billet, photo de couverture. Pas besoin d’être développeur.", bg: IMAGES.step1Bg },
  { n: "02", title: "Partage le lien", text: "WhatsApp, Facebook, Instagram : chaque page a un aperçu soigné avec la jauge de progression.", bg: IMAGES.step2Bg },
  { n: "03", title: "Ils paient en Mobile Money", text: "Les contributeurs paient en quelques secondes, avec ou sans compte, en public ou en anonyme.", bg: IMAGES.step3Bg },
  { n: "04", title: "Reçois ou scanne", text: "Reçois les fonds de ta cagnotte à la fin de la collecte (ou par retrait anticipé), reçois les recettes de ta billetterie et scanne les QR codes à l’entrée.", bg: IMAGES.step4Bg },
];

export const CASES = [
  { label: "Scénario · Solidarité", title: "Une famille face à une urgence", text: "Une famille ouvre une cagnotte pour des frais de santé, la partage dans ses groupes WhatsApp et suit la jauge en direct. Les proches éloignés participent depuis l’étranger.", image: IMAGES.casFamille },
  { label: "Scénario · Sport", title: "Un club qui monte une tournée", text: "Un club de quartier finance transport et équipements avec une cagnotte, puis vend des billets pour le match de clôture, au même endroit.", image: IMAGES.casClub },
  { label: "Scénario · Culture", title: "Un collectif qui organise sa soirée", text: "Des artistes vendent leurs e-billets, contrôlent les entrées au scan et voient en temps réel combien de places restent.", image: IMAGES.casArtiste },
];

export const TRUST_CARDS = [
  { icon: "lock", title: "Aucune donnée bancaire chez nous", text: "Les paiements sont traités par des prestataires de paiement agréés. Rallyo ne stocke ni code secret, ni numéro de carte." },
  { icon: "badge-check", title: "Organisateurs vérifiés", text: "Chaque organisateur enregistre son identité et son moyen de recevoir l’argent. Les pages vérifiées affichent un badge." },
  { icon: "chart", title: "Transparence et fonds réservés", text: "Montant collecté, objectif et nombre de soutiens sont publics. L’argent d’une cagnotte est réservé jusqu’à la fin de la collecte ou de l’objectif ; un retrait anticipé passe par une demande contrôlée." },
  { icon: "eye-off", title: "Dons anonymes réels", text: "Un don anonyme n’affiche ni ton nom ni ton numéro sur la page publique, ni dans la liste des soutiens." },
  { icon: "flag", title: "Signalement et modération", text: "Chaque page peut être signalée à l’équipe, qui peut suspendre une cagnotte ou bloquer un retrait suspect." },
  { icon: "ticket-check", title: "Billets infalsifiables", text: "Chaque billet a un code unique, valable une seule fois. Un billet déjà scanné est refusé à l’entrée." },
];

export const PAYMENT_METHODS = ["MTN Mobile Money", "Moov Money", "Celtiis Cash", "Orange Money", "Wave", "Carte bancaire (Visa, Mastercard)"];

export const FLOW_CAGNOTTE = [
  { title: "Crée ton compte", text: "Avec ton numéro de téléphone ou ton email. Moins d’une minute." },
  { title: "Raconte ton histoire", text: "Titre, description, catégorie, objectif en FCFA, photo de couverture et date de fin." },
  { title: "Enregistre ton identité et ton moyen de réception", text: "Une pièce d’identité et ta carte bancaire ou ton compte Mobile Money, pour recevoir les fonds en toute sécurité. Les moyens de paiement sont enregistrés chez notre prestataire, pas chez Rallyo." },
  { title: "Partage ton lien", text: "Une page publique avec aperçu pour WhatsApp, avec jauge et compteur de soutiens." },
  { title: "Reçois tes fonds", text: "L’argent est réservé jusqu’à la fin de la collecte ou jusqu’à l’objectif. Tu le reçois ensuite, ou tu demandes un retrait anticipé, vérifié avant le versement. Si l’objectif n’est pas atteint, tu gardes ce qui a été collecté." },
];

export const FLOW_EVENT = [
  { title: "Crée ton évènement", text: "Nom, lieu, date, prix du billet et nombre de places. Tu enregistres aussi ton identité et ton moyen de recevoir l’argent." },
  { title: "Publie la billetterie", text: "Ta page est en ligne, avec le nombre de billets restants." },
  { title: "Vends en Mobile Money", text: "Chaque acheteur reçoit son e-billet avec QR code juste après le paiement." },
  { title: "Scanne à l’entrée", text: "Chaque code ne fonctionne qu’une fois : les doublons sont refusés." },
  { title: "Suis tes ventes et reçois tes recettes", text: "Billets vendus, entrées validées, recettes en temps réel. Tu choisis le versement : direct, ou différé jusqu’à une date que tu définis." },
];

export const FLOW_DONOR = [
  { title: "Ouvre le lien", text: "Depuis WhatsApp ou n’importe quel réseau, sans rien installer." },
  { title: "Choisis ton montant", text: "2 000, 5 000, 10 000 FCFA ou un autre montant. Public ou anonyme." },
  { title: "Paie en quelques secondes", text: "Mobile Money ou carte. Tu reçois un reçu dans l’onglet Billets." },
];

export const AUDIENCES = [
  { icon: "family", title: "Familles et proches", text: "Santé, deuil, mariage, scolarité : rassemble ton entourage au même endroit." },
  { icon: "handshake", title: "Associations et clubs", text: "Finance un projet, du matériel ou une tournée avec une page claire et transparente." },
  { icon: "mic", title: "Artistes et organisateurs", text: "Vends tes billets, contrôle les entrées, oublie les tickets papier et les faux." },
  { icon: "graduation", title: "Écoles et jeunes", text: "Un voyage, un projet étudiant, un gala : collecte et billetterie dans un seul outil." },
];

export const COMPARE_COLS = ["Collectes informelles (WhatsApp, virements)", "Plateformes internationales", "Rallyo"];

export const COMPARE_ROWS: { label: string; cells: { v: "yes" | "mid" | "no"; t: string }[] }[] = [
  { label: "Paiement Mobile Money", cells: [{ v: "mid", t: "Manuel, un par un" }, { v: "mid", t: "Rarement natif" }, { v: "yes", t: "Natif, au cœur du parcours" }] },
  { label: "Cagnotte et billetterie ensemble", cells: [{ v: "no", t: "Non" }, { v: "mid", t: "Souvent séparées" }, { v: "yes", t: "Un seul outil" }] },
  { label: "Suivi et transparence", cells: [{ v: "no", t: "Captures d’écran" }, { v: "yes", t: "Oui" }, { v: "yes", t: "Jauge et soutiens publics" }] },
  { label: "Dons anonymes", cells: [{ v: "no", t: "Difficile" }, { v: "mid", t: "Selon la plateforme" }, { v: "yes", t: "Prévus dès le départ" }] },
  { label: "Pensé pour l’Afrique de l’Ouest", cells: [{ v: "yes", t: "Oui, mais sans outils" }, { v: "no", t: "Rarement" }, { v: "yes", t: "FCFA, français, habitudes locales" }] },
  { label: "Coût", cells: [{ v: "yes", t: "Aucun, mais aucune protection" }, { v: "mid", t: "Frais élevés ou en devises" }, { v: "yes", t: "Inscription gratuite, commission claire" }] },
];

export const PROBLEMS = [
  { icon: "receipt", title: "La preuve par capture d’écran", text: "Chacun envoie sa preuve de transfert. Personne ne sait combien a vraiment été collecté." },
  { icon: "trend-down", title: "La confiance qui s’érode", text: "Sans transparence, les donateurs hésitent, surtout quand ils sont loin ou ne connaissent pas l’organisateur." },
  { icon: "ticket", title: "Des billets papier faciles à copier", text: "Faux billets, doublons, files d’attente : le contrôle à l’entrée est lent et peu fiable." },
  { icon: "globe", title: "Des outils pensés ailleurs", text: "Frais en devises, paiement par carte uniquement, interface sans les habitudes locales." },
];

export const PRICING = [
  { label: "Cagnotte", amount: FEE_MAX_RATE + " → " + FEE_MIN_RATE + " %", small: "dégressif", items: ["Plus tu collectes, plus le taux baisse", "Aucun frais fixe, aucun frais d’inscription", "Frais du prestataire Mobile Money en sus"], highlight: false, soon: false },
  { label: "Billetterie", amount: FEE_MAX_RATE + " → " + FEE_MIN_RATE + " %", small: "dégressif", items: ["Inclut e-billets QR et contrôle d’accès", "Même grille dégressive que les cagnottes", "Frais du prestataire Mobile Money en sus"], highlight: true, soon: false },
  { label: "Rallyo Pro", amount: "Bientôt", small: "abonnement", items: ["Pour les organisateurs réguliers", "Commission réduite et statistiques avancées", "Tarif communiqué au lancement"], highlight: false, soon: true },
];

export type FaqItem = { q: string; a: string };
export type FaqGroup = { category: string; items: FaqItem[] };

export const FAQ: FaqGroup[] = [
  {
    category: "Général",
    items: [
      { q: "Qu’est-ce que Rallyo ?", a: "Rallyo est une plateforme de cagnottes en ligne et de billetterie d’évènements pensée pour l’Afrique de l’Ouest. Tu rassembles de l’argent ou tu vends des billets, avec paiement en Mobile Money et en FCFA." },
      { q: "Dans quels pays Rallyo est-il disponible ?", a: "Nous démarrons au Bénin et visons une ouverture progressive dans le reste de l’Afrique de l’Ouest. Les moyens de paiement disponibles dépendent de chaque pays." },
      { q: "Faut-il un compte pour contribuer ou acheter un billet ?", a: "Non. Tu peux contribuer à une cagnotte ou acheter un billet sans compte. Un compte est nécessaire pour créer une cagnotte ou un évènement." },
    ],
  },
  {
    category: "Cagnottes",
    items: [
      { q: "Comment créer une cagnotte ?", a: "Crée ton compte, renseigne le titre, ton histoire, l’objectif en FCFA et une photo, puis publie. Ta page est prête à être partagée en quelques minutes." },
      { q: "Puis-je faire un don anonyme ?", a: "Oui. Un don anonyme n’affiche ni ton nom ni ton numéro sur la page publique ni dans la liste des soutiens." },
      { q: "Que se passe-t-il si l’objectif n’est pas atteint ?", a: "Tu gardes tout ce qui a été collecté. À la date de fin, même si l’objectif n’est pas atteint, le solde te revient, sous réserve des vérifications habituelles (identité et moyen de réception). Les conditions détaillées figureront dans nos conditions d’utilisation." },
      { q: "Quand l’argent d’une cagnotte est-il disponible ?", a: "Les contributions sont réservées jusqu’à la fin de la collecte ou jusqu’à l’atteinte de l’objectif, selon la condition de clôture que tu as choisie. Ensuite, le solde éligible peut être retiré. Un retrait anticipé reste possible : tu en fais la demande, elle est contrôlée avant tout versement." },
    ],
  },
  {
    category: "Billetterie",
    items: [
      { q: "Comment l’acheteur reçoit-il son billet ?", a: "Juste après le paiement, un e-billet avec QR code est disponible dans l’onglet Billets de l’appli." },
      { q: "Comment contrôler les entrées ?", a: "Tu scannes le QR code de chaque billet. Chaque code est unique et ne fonctionne qu’une fois : un billet déjà utilisé est refusé." },
      { q: "Qui peut organiser un évènement ?", a: "Toute personne disposant d’un compte. Dans tous les cas, l’organisateur enregistre ses informations, une pièce d’identité et un moyen de recevoir l’argent (carte bancaire ou compte Mobile Money)." },
      { q: "Quand l’organisateur reçoit-il l’argent des billets ?", a: "L’organisateur choisit entre deux modes : un versement direct, où les recettes éligibles lui sont transférées via le prestataire de paiement, ou un versement différé, où elles sont réservées jusqu’à une date ou une condition qu’il définit." },
      { q: "Un billet peut-il être remboursé ?", a: "En cas d’annulation de l’évènement, les acheteurs sont remboursés. Dans les autres cas, cela dépend de la politique de l’organisateur, indiquée sur sa page." },
    ],
  },
  {
    category: "Paiements et frais",
    items: [
      { q: "Quels moyens de paiement sont acceptés ?", a: "Le Mobile Money (MTN, Moov, Celtiis, Orange Money, Wave selon ton pays) et la carte bancaire. La liste exacte dépend de ton pays et s’élargit au fil du lancement." },
      { q: "Combien coûte Rallyo ?", a: "L’inscription est gratuite. Rallyo prélève une commission uniquement sur ce que tu collectes, avec un taux dégressif : " + FEE_MAX_RATE + " % sur les premières tranches, jusqu’à " + FEE_MIN_RATE + " % sur les grosses collectes. Les frais du prestataire de paiement s’ajoutent. Détails et simulateur sur la page Tarifs." },
      { q: "Qui paie les frais de Rallyo ?", a: "L’organisateur : la commission Rallyo est déduite de ses recettes. L’acheteur ou le contributeur paie le montant affiché, sans frais Rallyo ajoutés. Les éventuels frais du prestataire de paiement dépendent du moyen choisi." },
      { q: "Comment retirer mes fonds ?", a: "Les fonds sont versés via notre prestataire de paiement, vers le moyen de réception que tu as enregistré (carte bancaire ou compte Mobile Money), une fois ton identité vérifiée. Pour une cagnotte, tu peux aussi demander un retrait anticipé : la demande est vérifiée, approuvée, puis versée, et tu suis chaque étape dans ton espace. Les fonds ne sont pas conservés sur un portefeuille Rallyo." },
    ],
  },
  {
    category: "Sécurité",
    items: [
      { q: "Mon argent et mes données sont-ils protégés ?", a: "Les paiements sont traités par des prestataires agréés : Rallyo ne stocke aucune donnée bancaire. Tes informations personnelles ne sont jamais affichées publiquement, pas plus que les pièces d’identité fournies par les organisateurs." },
      { q: "Comment les organisateurs sont-ils vérifiés ?", a: "Chaque organisateur enregistre une pièce d’identité et son moyen de recevoir l’argent. Une fois vérifiés, les organisateurs affichent un badge sur leurs pages." },
      { q: "Comment signaler une cagnotte suspecte ?", a: "Écris-nous depuis la page Contact en choisissant « Signaler une cagnotte ou un évènement », et joins le lien de la page. L’équipe examine le cas et peut suspendre la page ou bloquer les retraits." },
    ],
  },
];

export const FAQ_FLAT = FAQ.flatMap((g) => g.items);
