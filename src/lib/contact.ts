/**
 * Page « Contact et aide » : configuration et validation (partagées par le formulaire et la route serveur).
 *
 * Les coordonnées ne sont PAS codées en dur : elles viennent de variables d'environnement
 * (voir .env.example). Un canal non renseigné n'est tout simplement pas affiché.
 */

export const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  /** Numéro WhatsApp au format international, chiffres uniquement (ex. 229XXXXXXXX). */
  whatsapp: (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "").replace(/\D/g, ""),
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "",
  hours: process.env.NEXT_PUBLIC_CONTACT_HOURS?.trim() ?? "",
};

export const TOPICS = [
  { value: "cagnotte", label: "Une cagnotte" },
  { value: "billetterie", label: "La billetterie / un billet" },
  { value: "paiement", label: "Un paiement ou un retrait" },
  { value: "compte", label: "Mon compte ou la sécurité" },
  { value: "signalement", label: "Signaler une cagnotte ou un évènement" },
  { value: "autre", label: "Autre question" },
] as const;

export type TopicValue = (typeof TOPICS)[number]["value"];

export const isTopic = (v: unknown): v is TopicValue => TOPICS.some((t) => t.value === v);

export const LIMITS = { nameMin: 2, nameMax: 80, contactMax: 120, messageMin: 10, messageMax: 2000 } as const;

export type ContactInput = {
  name: string;
  contact: string;
  topic: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]+$/;

/** Renvoie les erreurs par champ (objet vide = valide). Mêmes règles côté navigateur et côté serveur. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const contact = input.contact.trim();
  const message = input.message.trim();

  if (name.length < LIMITS.nameMin) errors.name = "Indique ton nom ou un pseudo.";
  else if (name.length > LIMITS.nameMax) errors.name = `Maximum ${LIMITS.nameMax} caractères.`;

  const digits = contact.replace(/\D/g, "");
  const validPhone = PHONE_RE.test(contact) && digits.length >= 8 && digits.length <= 15;
  if (!contact) errors.contact = "Indique un email ou un numéro pour te répondre.";
  else if (contact.length > LIMITS.contactMax) errors.contact = `Maximum ${LIMITS.contactMax} caractères.`;
  else if (!EMAIL_RE.test(contact) && !validPhone) errors.contact = "Email ou numéro de téléphone invalide.";

  if (!isTopic(input.topic)) errors.topic = "Choisis le sujet de ta demande.";

  if (message.length < LIMITS.messageMin) errors.message = `Écris au moins ${LIMITS.messageMin} caractères.`;
  else if (message.length > LIMITS.messageMax) errors.message = `Maximum ${LIMITS.messageMax} caractères.`;

  return errors;
}

/** Cartes d'aide : chaque thème renvoie vers la bonne section de la FAQ. */
export const HELP_TOPICS = [
  { icon: "hand-coins", title: "Cagnottes", text: "Créer, partager, suivre et retirer les fonds d’une cagnotte.", href: "/faq#faq-cagnottes" },
  { icon: "ticket", title: "Billetterie", text: "Billets, QR code, contrôle des entrées et remboursements.", href: "/faq#faq-billetterie" },
  { icon: "credit-card", title: "Paiements et frais", text: "Moyens de paiement, commission, retraits et reçus.", href: "/faq#faq-paiements-et-frais" },
  { icon: "lock", title: "Sécurité et compte", text: "Protection de tes données, vérification des organisateurs.", href: "/faq#faq-securite" },
  { icon: "zap", title: "Comment ça marche", text: "Les parcours pas à pas, pour organiser comme pour contribuer.", href: "/comment-ca-marche" },
  { icon: "flag", title: "Signaler un contenu", text: "Une cagnotte ou un évènement te semble suspect ? Préviens-nous.", href: "/contact?sujet=signalement#ecrire" },
] as const;

/** Questions choisies pour la page Contact (retrouvées par leur intitulé dans la FAQ). */
export const HELP_QUESTIONS = [
  "Comment retirer mes fonds ?",
  "Quels moyens de paiement sont acceptés ?",
  "Comment l’acheteur reçoit-il son billet ?",
  "Comment signaler une cagnotte suspecte ?",
  "Faut-il un compte pour contribuer ou acheter un billet ?",
];
