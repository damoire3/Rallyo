import Link from "next/link";
import type { ReactNode } from "react";
import { IMAGES, type FaqGroup, type FaqItem } from "@/lib/site-data";
import type { Tint } from "./decor";

/** Accordéon natif <details> : fonctionne sans JavaScript. */
export function FaqItems({ items }: { items: FaqItem[] }) {
  return (
    <>
      {items.map((it) => (
        <details className="faq-item" key={it.q}>
          <summary>{it.q}</summary>
          <p className="faq-a">{it.a}</p>
        </details>
      ))}
    </>
  );
}

const faqId = (category: string) =>
  "faq-" +
  category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function FaqGroups({ groups }: { groups: FaqGroup[] }) {
  return (
    <>
      {groups.map((g) => (
        <section className="faq-group" key={g.category} aria-labelledby={faqId(g.category)}>
          <h2 id={faqId(g.category)}>{g.category}</h2>
          <FaqItems items={g.items} />
        </section>
      ))}
    </>
  );
}

/** En-tête des pages internes. */
export function PageHero({
  eyebrow,
  title,
  lede,
  bg,
  tint = "pink",
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  bg: string;
  tint?: Tint;
  actions?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="ph-bg" style={{ backgroundImage: `url('${bg}')` }} />
      <div className={`ph-tint tint-${tint}`} />
      <div className="eyebrow">{`// ${eyebrow}`}</div>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      {actions && <div className="hero-actions" style={{ justifyContent: "flex-start", marginTop: 32 }}>{actions}</div>}
    </header>
  );
}

/** Bandeau d'appel à l'action de fin de page. */
export function CtaBand({
  title = "Prêt à rallier ton clan ?",
  kinetic = "Lance-toi.",
  text = "Crée ta cagnotte ou ta billetterie en quelques minutes. Inscription gratuite, paiement en Mobile Money.",
}: {
  title?: string;
  kinetic?: string;
  text?: string;
}) {
  return (
    <section className="cta-band">
      <div className="cta-bg" style={{ backgroundImage: `url('${IMAGES.ctaBg}')` }} />
      <h2 data-reveal="">
        {title}
        <span className="kinetic">{kinetic}</span>
      </h2>
      <p data-reveal="">{text}</p>
      <div className="hero-actions">
        <Link href="/app/creer" className="btn-big">
          Lancer ma cagnotte
        </Link>
        <Link href="/app/explorer" className="btn-outline">
          Découvrir l’appli
        </Link>
      </div>
    </section>
  );
}
