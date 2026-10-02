import type { Metadata } from "next";
import { CtaBand, FaqItems, PageHero } from "@/components/site/blocks";
import { FeeCalculator } from "@/components/site/fee-calculator";
import { FAQ, IMAGES, PRICING } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Inscription gratuite, commission uniquement quand tu collectes : environ 3 à 5 % pour une cagnotte, 5 à 8 % pour la billetterie. Simule tes frais.",
  alternates: { canonical: "/tarifs" },
};

export default function PricingPage() {
  const feeFaq = FAQ.find((g) => g.category === "Paiements et frais")?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title={<>Tu ne paies que <span className="graffiti">si tu collectes.</span></>}
        lede="Pas d’abonnement, pas de frais cachés, pas de frais d’inscription. Une commission claire, prélevée sur ce qui est réellement collecté."
        bg={IMAGES.pricingBg}
        tint="acid"
      />

      <section className="block">
        <div className="container">
          <div className="price-grid" style={{ marginTop: 0 }}>
            {PRICING.map((c) => (
              <div className={`price-card ${c.highlight ? "highlight" : ""} ${c.soon ? "soon" : ""}`} key={c.label} data-reveal="">
                <div className="tag-label">{c.label}{c.soon && <span className="badge-soon">BIENTÔT</span>}</div>
                <div className="amount">{c.amount}<small> {c.small}</small></div>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="note">
            Les frais du prestataire Mobile Money (opérateur ou agrégateur) s’ajoutent à la commission Rallyo et varient selon
            le moyen de paiement. Les taux ci-dessus sont ceux visés au lancement et seront confirmés avant l’ouverture.
          </p>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Simulateur"}</div>
            <h2 className="section-title" data-reveal="">
              Combien <span className="graffiti">il te reste ?</span>
            </h2>
            <p className="lede" data-reveal="">Entre un montant et vois la fourchette de commission, avant même de te lancer.</p>
          </div>
          <FeeCalculator />
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="block-head">
            <div className="eyebrow">{"// Questions sur les frais"}</div>
            <h2 className="section-title" data-reveal="">Bon à savoir.</h2>
          </div>
          <FaqItems items={feeFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
