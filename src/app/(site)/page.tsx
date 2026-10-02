import type { Metadata } from "next";
import { CtaBand } from "@/components/site/blocks";
import {
  Cases, DemoSection, FaqTeaser, GalleryStrip, Hero, ImpactBand, MarqueeBand,
  PricingTeaser, StepsPin, TrustStrip, Wall, Why,
} from "@/components/site/home-sections";

export const revalidate = 60; // la galerie « Ça se passe chez nous » se met à jour toutes les 60 s (cf. src/lib/showcase.ts)

export const metadata: Metadata = {
  title: { absolute: "Rallyo — Cagnottes & billetterie pour l’Afrique de l’Ouest" },
  description:
    "Lance une cagnotte ou vends tes billets en quelques minutes. Paiement en Mobile Money et en FCFA, dons anonymes, e-billets QR. Inscription gratuite.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rallyo — Rassemble. Célèbre. Soutiens.",
    description: "Cagnottes en ligne et billetterie d’évènements pour l’Afrique de l’Ouest, en Mobile Money.",
    url: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rallyo",
  description: "Plateforme de cagnottes en ligne et de billetterie d’évènements pour l’Afrique de l’Ouest.",
  areaServed: "Afrique de l’Ouest",
  slogan: "Rassemble. Célèbre. Soutiens.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <MarqueeBand />
      <Wall />
      <DemoSection />
      <Why />
      <ImpactBand />
      <StepsPin />
      <Cases />
      <GalleryStrip />
      <TrustStrip />
      <PricingTeaser />
      <FaqTeaser />
      <CtaBand />
    </>
  );
}
