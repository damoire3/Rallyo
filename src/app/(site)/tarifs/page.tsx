import type { Metadata } from "next";
import { CtaBand, FaqItems, PageHero } from "@/components/site/blocks";
import { FeeCalculator } from "@/components/site/fee-calculator";
import { fmtRate, PROVIDER_METHODS, RALLYO_RATE, TOTAL_RATE_MAX, TOTAL_RATE_MIN } from "@/lib/fees";
import { FAQ, IMAGES, PRICING } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Tarifs",
  description: `Inscription gratuite, aucun abonnement : ${fmtRate(RALLYO_RATE)} % pour Rallyo, plus le pourcentage du prestataire de paiement, soit ${fmtRate(TOTAL_RATE_MIN)} % à ${fmtRate(TOTAL_RATE_MAX)} % au total selon le moyen de paiement. Simule tes frais.`,
  alternates: { canonical: "/tarifs" },
};

export default function PricingPage() {
  const feeFaq = FAQ.find((g) => g.category === "Paiements et frais")?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title={<>Tu ne paies que <span className="graffiti">si tu collectes.</span></>}
        lede={`Pas d’abonnement, pas de frais d’inscription. Rallyo prend ${fmtRate(RALLYO_RATE)} %, plus le pourcentage du prestataire de paiement : rien d’autre.`}
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
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Tes frais"}</div>
            <h2 className="section-title" data-reveal="">
              Un calcul <span className="graffiti">simple.</span>
            </h2>
            <p className="lede" data-reveal="">
              {fmtRate(RALLYO_RATE)} % pour Rallyo, plus le pourcentage du prestataire de paiement selon le moyen utilisé par tes
              participants. Le même calcul pour les cagnottes et pour la billetterie.
            </p>
          </div>
          <div className="compare tier-table" data-reveal="">
            <table>
              <thead>
                <tr>
                  <th scope="col">Moyen de paiement</th>
                  <th scope="col">Rallyo</th>
                  <th scope="col">Prestataire</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {PROVIDER_METHODS.map((m) => (
                  <tr key={m.id}>
                    <td>{m.label}</td>
                    <td>{fmtRate(RALLYO_RATE)} %</td>
                    <td>{fmtRate(m.rate)} %</td>
                    <td className="us"><b>{fmtRate(RALLYO_RATE + m.rate)} %</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            Les frais sont déduits de tes recettes : tes participants paient le montant affiché, sans frais Rallyo ajoutés.
            Les pourcentages du prestataire de paiement sont ceux qu’il publie, à confirmer avant l’ouverture. Les
            virements de tes fonds vers ton Mobile Money peuvent comporter de petits frais fixes.
          </p>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Simulateur"}</div>
            <h2 className="section-title" data-reveal="">
              Combien <span className="graffiti">il te reste ?</span>
            </h2>
            <p className="lede" data-reveal="">Entre un montant, choisis le moyen de paiement et vois tes frais exacts, avant même de te lancer.</p>
          </div>
          <FeeCalculator />
        </div>
      </section>

      <section className="block alt">
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
