import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal";

// Tant que le texte n'est pas validé par un juriste, la page n'est pas indexée par les moteurs de recherche.
export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Informations légales sur l’éditeur, l’hébergement et le contenu du site Rallyo.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mentions-legales" },
};

const sections: LegalSection[] = [
  {
    title: "Éditeur du site",
    paragraphs: [
      "Le site Rallyo est édité par [[dénomination sociale]], [[forme juridique]], au capital de [[montant du capital]], immatriculée sous le numéro [[RCCM / IFU / autre numéro d’immatriculation]], dont le siège social est situé [[adresse complète]].",
    ],
  },
  {
    title: "Directeur de la publication",
    paragraphs: ["Le directeur de la publication est [[nom et prénom]], en qualité de [[fonction]]."],
  },
  {
    title: "Contact",
    paragraphs: [
      "Pour toute question, tu peux nous écrire depuis la page Contact du site, ou à l’adresse [[adresse e-mail de contact]].",
    ],
  },
  {
    title: "Hébergement",
    paragraphs: [
      "Le site est hébergé par [[nom et adresse de l’hébergeur du site]].",
      "Les données sont stockées dans une base de données gérée par Supabase, région [[région d’hébergement à confirmer]].",
    ],
  },
  {
    title: "Propriété intellectuelle",
    paragraphs: [
      "La marque Rallyo, le logo, la charte graphique, les textes et les éléments du site sont protégés. Toute reproduction ou utilisation sans autorisation écrite préalable est interdite, sauf exceptions prévues par la loi.",
      "Les contenus publiés par les utilisateurs (cagnottes, évènements, descriptions, images) restent sous la responsabilité de leurs auteurs, qui garantissent détenir les droits nécessaires.",
    ],
  },
  {
    title: "Responsabilité",
    paragraphs: [
      "Rallyo s’efforce de fournir des informations exactes et à jour, sans garantie d’exhaustivité. Rallyo n’est pas responsable du contenu des pages créées par les utilisateurs, ni de l’usage qui est fait des sommes collectées par les organisateurs.",
      "Tout contenu qui te semble illicite ou suspect peut être signalé depuis la page Contact.",
    ],
  },
  {
    title: "Droit applicable",
    paragraphs: ["Les présentes mentions sont régies par le droit [[pays applicable]]. Tout litige relève de la compétence des juridictions de [[ville / pays]]."],
  },
];

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow="Légal"
      title={<>Mentions <span className="graffiti">légales.</span></>}
      lede="Qui édite Rallyo, où le site est hébergé et comment nous joindre."
      sections={sections}
    />
  );
}
