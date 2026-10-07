import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal";

// Tant que le texte n'est pas validé par un juriste, la page n'est pas indexée par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Rallyo collecte, pourquoi, combien de temps, et comment exercer tes droits.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/confidentialite" },
};

const sections: LegalSection[] = [
  {
    title: "Qui est responsable de tes données ?",
    paragraphs: [
      "Le responsable du traitement est [[dénomination sociale]], dont le siège est situé [[adresse]]. Pour toute question sur tes données, écris-nous depuis la page Contact ou à [[adresse e-mail dédiée aux données personnelles]].",
    ],
  },
  {
    title: "Les données que nous collectons",
    items: [
      "Compte : nom, prénom, numéro de téléphone ou adresse e-mail, mot de passe (jamais conservé en clair).",
      "Contributions et achats : montant, date, référence de transaction, nom affiché ou mention « anonyme ». Pour un achat de billet : nom, prénom, téléphone et e-mail de l’acheteur, afin de lui remettre son billet.",
      "Organisateurs : informations de profil, pièce d’identité et moyen de recevoir l’argent. Les données de carte bancaire ou de compte Mobile Money sont enregistrées chez notre prestataire de paiement ; Rallyo n’en conserve qu’une référence.",
      "Messages envoyés depuis la page Contact : nom, moyen de te répondre, sujet et contenu du message.",
      "Données techniques : [[journaux de connexion, adresse IP, type d’appareil : à préciser]].",
    ],
  },
  {
    title: "Pourquoi nous les utilisons",
    items: [
      "Fournir le service : créer des pages, encaisser les paiements, délivrer les billets, effectuer les versements.",
      "Vérifier les organisateurs et prévenir la fraude.",
      "Répondre à tes demandes et assurer le support.",
      "Respecter nos obligations légales et réglementaires.",
      "Assurer la sécurité et le bon fonctionnement du site.",
    ],
    paragraphs: ["Base légale de chaque traitement : [[à compléter selon la loi applicable (exécution du contrat, obligation légale, intérêt légitime, consentement)]]."],
  },
  {
    title: "Ce qui est visible publiquement",
    paragraphs: [
      "Les pages de cagnotte et d’évènement affichent le montant collecté, l’objectif, le nombre de soutiens, les dates, le nom de l’organisateur et, selon les réglages, le nom des contributeurs. Un don anonyme n’affiche ni ton nom ni ton numéro. Les pièces d’identité et les moyens de réception ne sont jamais affichés.",
    ],
  },
  {
    title: "Avec qui nous les partageons",
    items: [
      "Notre prestataire de paiement ([[nom]]), pour traiter les paiements et les versements.",
      "Notre hébergeur et notre fournisseur de base de données (Supabase), qui stockent les données pour notre compte.",
      "[[Autres sous-traitants éventuels : envoi de SMS ou d’e-mails, vérification d’identité…]]",
      "Les autorités compétentes, lorsque la loi l’exige.",
    ],
    paragraphs: ["Rallyo ne vend pas tes données personnelles."],
  },
  {
    title: "Combien de temps nous les gardons",
    paragraphs: [
      "Compte et historique : [[durée à définir]]. Pièces d’identité des organisateurs : [[durée limitée à définir]]. Messages de contact : [[durée à définir]]. Données de transaction : [[durée légale de conservation applicable]].",
    ],
  },
  {
    title: "Comment nous les protégeons",
    paragraphs: [
      "L’accès aux données est restreint. Les pièces d’identité sont conservées dans un espace privé, accessible uniquement à l’équipe habilitée. Les tables de la base de données ne sont pas accessibles directement depuis le site : les échanges passent par des fonctions contrôlées. Aucun numéro de carte ni code secret n’est stocké par Rallyo.",
      "Aucune protection n’est absolue : en cas d’incident touchant tes données, nous t’informerons conformément à la loi. [[Procédure de notification à définir]].",
    ],
  },
  {
    title: "Tes droits",
    paragraphs: [
      "Tu peux demander l’accès à tes données, leur rectification, leur suppression, ou t’opposer à certains traitements, [[dans les conditions prévues par la loi applicable]]. Écris-nous depuis la page Contact en précisant l’objet de ta demande. Nous pourrons te demander de justifier de ton identité.",
      "Tu peux aussi saisir l’autorité de protection des données compétente : [[nom et coordonnées de l’autorité]].",
    ],
  },
  {
    title: "Cookies et traceurs",
    paragraphs: [
      "À ce jour, le site n’utilise pas de cookies publicitaires. [[À confirmer avant publication : cookies techniques, outil de mesure d’audience éventuel]].",
    ],
  },
  {
    title: "Mineurs",
    paragraphs: ["Le service est destiné aux personnes âgées d’au moins [[âge minimum à définir]] ans. Si tu penses qu’un mineur nous a transmis des données, contacte-nous pour que nous les supprimions."],
  },
  {
    title: "Modifications",
    paragraphs: ["Cette politique peut évoluer. En cas de changement important, nous t’en informerons avant son entrée en vigueur."],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Légal"
      title={<>Confidentialité <span className="graffiti">et données.</span></>}
      lede="Quelles données nous collectons, pourquoi, combien de temps, et comment exercer tes droits."
      sections={sections}
    />
  );
}
