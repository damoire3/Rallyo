import type { Metadata } from "next";
import { SiteIcon } from "@/components/site/site-icon";
import Link from "next/link";
import { CtaBand, FaqItems, PageHero } from "@/components/site/blocks";
import { FAQ, IMAGES, PAYMENT_METHODS, TRUST_CARDS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Sécurité et paiements",
  description:
    "Aucune donnée bancaire stockée, organisateurs vérifiés, dons anonymes, billets à usage unique : comment Rallyo protège ceux qui donnent et ceux qui collectent.",
  alternates: { canonical: "/securite" },
};

export default function SecurityPage() {
  const securityFaq = FAQ.find((g) => g.category === "Sécurité")?.items ?? [];

  return (
    <>
      <PageHero
        eyebrow="Sécurité et paiements"
        title={<>La confiance, <span className="graffiti">ça se construit.</span></>}
        lede="Donner ou acheter un billet en ligne suppose de faire confiance. Voici, concrètement, comment Rallyo protège ton argent, tes données et ta discrétion."
        bg={IMAGES.step3Bg}
        tint="cyan"
        actions={<Link href="/faq" className="btn-outline">Voir la FAQ</Link>}
      />

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Nos engagements"}</div>
            <h2 className="section-title" data-reveal="">
              Six règles, <span className="graffiti">pas une de moins.</span>
            </h2>
          </div>
          <div className="trust-grid">
            {TRUST_CARDS.map((c) => (
              <div className="trust-card" key={c.title} data-reveal="">
                <div className="icon"><SiteIcon name={c.icon} /></div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Paiements"}</div>
            <h2 className="section-title" data-reveal="">
              Paie <span className="graffiti">comme tu veux.</span>
            </h2>
            <p className="lede" data-reveal="">
              Le Mobile Money est au cœur du parcours, la carte bancaire est là en complément.
            </p>
          </div>
          <div className="chips" data-reveal="">
            {PAYMENT_METHODS.map((m, i) => (
              <span className={`chip ${i === 0 ? "accent" : ""}`} key={m}>{m}</span>
            ))}
          </div>
          <p className="note">
            La disponibilité de chaque moyen de paiement dépend du pays et de l’avancement du lancement. Les paiements sont
            traités par des prestataires agréés ; Rallyo ne voit ni ne stocke tes codes secrets ou numéros de carte.
          </p>
        </div>
      </section>

      <section className="block">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="block-head">
            <div className="eyebrow">{"// Questions de sécurité"}</div>
            <h2 className="section-title" data-reveal="">On te dit tout.</h2>
          </div>
          <FaqItems items={securityFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
