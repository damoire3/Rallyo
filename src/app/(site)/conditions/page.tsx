import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal";
import { RALLYO_RATE } from "@/lib/fees";

// Tant que le texte n'est pas validé par un juriste, la page n'est pas indexée par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  description: "Les règles d’utilisation de Rallyo : comptes, cagnottes, billetterie, paiements, frais et remboursements.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/conditions" },
};

const sections: LegalSection[] = [
  {
    title: "Objet",
    paragraphs: [
      "Rallyo est une plateforme en ligne qui permet de lancer des cagnottes et de vendre des billets d’évènements. Les présentes conditions encadrent l’utilisation du site et de l’application par toute personne, qu’elle consulte, contribue, achète un billet ou organise.",
      "Rallyo met en relation des organisateurs et des participants. Rallyo n’est ni le bénéficiaire des cagnottes, ni l’organisateur des évènements publiés par les utilisateurs.",
    ],
  },
  {
    title: "Accès au service et compte",
    items: [
      "Sans compte, tu peux consulter les cagnottes et les évènements, contribuer à une cagnotte et acheter un billet.",
      "Un compte est nécessaire pour créer et gérer une cagnotte ou un évènement, demander un retrait, consulter ton historique et publier des mises à jour.",
      "Tu t’engages à fournir des informations exactes, à protéger l’accès à ton compte et à ne pas le céder. L’âge minimum pour ouvrir un compte est de [[âge minimum à définir]] ans.",
    ],
  },
  {
    title: "Organisateurs : identité et moyen de réception",
    paragraphs: [
      "Toute personne disposant d’un compte peut organiser un évènement. Dans tous les cas, l’organisateur enregistre ses informations, une pièce d’identité et un moyen de recevoir l’argent (carte bancaire ou compte Mobile Money).",
      "Le moyen de réception est enregistré auprès de notre prestataire de paiement, pas chez Rallyo. Rallyo peut refuser, suspendre ou retirer un organisateur dont l’identité ne peut pas être vérifiée. [[Moment exact de la vérification : à la création du compte, avant la première publication ou avant le premier versement]].",
    ],
  },
  {
    title: "Cagnottes",
    items: [
      "Le créateur choisit une condition de clôture : à la date de fin, à l’atteinte de l’objectif, ou au premier des deux. [[Dépassement de l’objectif : autorisé ou non]].",
      "Les contributions sont réservées jusqu’à la fin de la collecte ou jusqu’à l’atteinte de l’objectif, puis le solde éligible devient retirable.",
      "Le créateur peut demander un retrait anticipé. La demande est contrôlée avant tout versement et suit les étapes : en vérification, approuvée, en cours, versée. [[Plafond, justificatifs et délais du retrait anticipé]].",
      "Si l’objectif n’est pas atteint à la date de fin, le créateur garde tout ce qui a été collecté, sous réserve des vérifications prévues.",
      "Un contributeur peut choisir de rester anonyme : son nom et son numéro ne sont alors affichés ni sur la page publique ni dans la liste des soutiens.",
    ],
  },
  {
    title: "Billetterie",
    items: [
      "Chaque billet est nominatif ou associé à un code unique, valable une seule fois. Un billet déjà utilisé est refusé à l’entrée.",
      "L’organisateur choisit le mode de versement de ses recettes : versement direct via le prestataire de paiement, ou versement différé jusqu’à une date ou une condition qu’il définit. [[Délais et conditions du versement différé]].",
      "En cas d’annulation de l’évènement, les acheteurs sont remboursés. Dans les autres cas, la politique de remboursement de l’organisateur s’applique, indiquée sur sa page. [[Politique de remboursement de Rallyo]].",
    ],
  },
  {
    title: "Paiements",
    paragraphs: [
      "Les paiements sont traités par des prestataires de paiement agréés ([[nom du ou des prestataires]]). Rallyo ne stocke aucune donnée bancaire et ne conserve pas les fonds sur un portefeuille propre.",
      "Les moyens de paiement disponibles (Mobile Money, carte bancaire) dépendent du pays et de l’avancement du lancement.",
    ],
  },
  {
    title: "Frais",
    paragraphs: [
      `L’inscription est gratuite. Rallyo prélève une commission de ${RALLYO_RATE} % sur les sommes collectées ou les ventes de billets, sans palier et identique pour les cagnottes et la billetterie. S’y ajoutent les frais du prestataire de paiement, qui dépendent du moyen de paiement utilisé.`,
      "Le détail et un simulateur sont publiés sur la page Tarifs. [[À confirmer : le total (commission Rallyo et frais du prestataire) est déduit des recettes de l’organisateur et n’est jamais ajouté au prix payé par l’acheteur ou le contributeur]].",
    ],
  },
  {
    title: "Contenus et comportements interdits",
    items: [
      "Publier une cagnotte ou un évènement fictif, trompeur ou destiné à frauder.",
      "Usurper l’identité d’une personne ou fournir de faux documents.",
      "Publier un contenu illicite, haineux, violent ou portant atteinte aux droits d’autrui.",
      "Contourner les protections du site ou en perturber le fonctionnement.",
    ],
  },
  {
    title: "Signalement, suspension et résiliation",
    paragraphs: [
      "Tout contenu suspect peut être signalé depuis la page Contact. Rallyo peut suspendre une page, bloquer un retrait ou fermer un compte en cas de manquement, de fraude présumée ou de demande d’une autorité compétente.",
    ],
  },
  {
    title: "Responsabilité",
    paragraphs: [
      "Rallyo s’engage à fournir le service avec diligence, sans garantie d’une disponibilité permanente. Rallyo n’est pas responsable de l’usage des sommes versées aux organisateurs, ni de la tenue des évènements, dans les limites autorisées par la loi. [[Plafond de responsabilité à définir]].",
    ],
  },
  {
    title: "Données personnelles",
    paragraphs: ["Le traitement des données personnelles est décrit dans la politique de confidentialité."],
  },
  {
    title: "Modification des conditions et droit applicable",
    paragraphs: [
      "Rallyo peut modifier ces conditions ; les utilisateurs en sont informés avant leur entrée en vigueur. Les présentes conditions sont régies par le droit [[pays applicable]]. Tout litige relève des juridictions de [[ville / pays]], après tentative de résolution amiable via la page Contact.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Légal"
      title={<>Conditions <span className="graffiti">d’utilisation.</span></>}
      lede="Les règles du jeu pour contribuer, acheter un billet ou organiser sur Rallyo."
      sections={sections}
    />
  );
}
