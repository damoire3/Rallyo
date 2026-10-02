import type { Metadata } from "next";
import { CtaBand, FaqGroups, PageHero } from "@/components/site/blocks";
import { FAQ, FAQ_FLAT, IMAGES } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Toutes les réponses : créer une cagnotte, vendre des billets, Mobile Money, frais, retraits, dons anonymes et sécurité.",
  alternates: { canonical: "/faq" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FLAT.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="FAQ"
        title={<>Tes questions, <span className="graffiti">nos réponses.</span></>}
        lede="Cagnottes, billetterie, paiements, frais, sécurité : tout ce qu’on nous demande le plus souvent, au même endroit."
        bg={IMAGES.murBg}
        tint="pink"
      />
      <section className="block">
        <div className="container" style={{ maxWidth: 860 }}>
          <FaqGroups groups={FAQ} />
        </div>
      </section>
      <CtaBand title="Une autre question ?" kinetic="Essaie l’appli." text="Le plus simple pour comprendre, c’est de naviguer dans la démo : sans compte, en quelques clics." />
    </>
  );
}
