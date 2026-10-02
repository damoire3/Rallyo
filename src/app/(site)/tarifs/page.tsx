import type { Metadata } from "next";
import { CtaBand, FaqItems, PageHero } from "@/components/site/blocks";
import { FeeCalculator } from "@/components/site/fee-calculator";
import { FEE_MAX_RATE, FEE_MIN_RATE, FEE_TIERS, tierLabel } from "@/lib/fees";
import { FAQ, IMAGES, PRICING } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Tarifs",
  description: `Inscription gratuite, commission uniquement quand tu collectes : un taux dégressif de ${FEE_MAX_RATE} % à ${FEE_MIN_RATE} %, pour les cagnottes comme pour la billetterie. Simule tes frais.`,
  alternates: { canonical: "/tarifs" },
};

export default function PricingPage() {
  const feeFaq = FAQ.find((g) => g.category === "Paiements et frais")?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title={<>Tu ne paies que <span className="graffiti">si tu collectes.</span></>}
        lede={`Pas d’abonnement, pas de frais d’inscription. Une commission dégressive, de ${FEE_MAX_RATE} % à ${FEE_MIN_RATE} % : plus ta collecte grandit, plus le taux baisse.`}
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
            <div className="eyebrow">{"// La grille"}</div>
            <h2 className="section-title" data-reveal="">
              Un taux qui <span className="graffiti">baisse avec toi.</span>
            </h2>
            <p className="lede" data-reveal="">
              Chaque tranche de ta collecte est facturée à son propre taux. Ce que tu as déjà collecté ne coûte jamais plus cher
              quand tu dépasses un palier.
            </p>
          </div>
          <div className="compare tier-table" data-reveal="">
            <table>
              <thead>
                <tr>
                  <th scope="col">Part de ta collecte</th>
                  <th scope="col">Taux sur cette part</th>
                </tr>
              </thead>
              <tbody>
                {FEE_TIERS.map((t, i) => (
                  <tr key={t.rate + String(t.upTo)}>
                    <td>{tierLabel(i)}</td>
                    <td className="us"><b>{t.rate} %</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            Même grille pour les cagnottes et la billetterie. Les frais du prestataire Mobile Money (opérateur ou agrégateur)
            s’ajoutent à la commission Rallyo et varient selon le moyen de paiement. Taux visés au lancement, à confirmer avant
            l’ouverture.
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
            <p className="lede" data-reveal="">Entre un montant et vois la commission exacte, avant même de te lancer.</p>
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
