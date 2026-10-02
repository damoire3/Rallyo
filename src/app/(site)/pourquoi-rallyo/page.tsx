import type { Metadata } from "next";
import { SiteIcon } from "@/components/site/site-icon";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/site/blocks";
import { AUDIENCES, COMPARE_COLS, COMPARE_ROWS, IMAGES, PROBLEMS, WHY_CARDS } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Pourquoi Rallyo",
  description:
    "Collectes sur WhatsApp, billets papier, plateformes pensées ailleurs : ce qui coince aujourd’hui, et ce que Rallyo change pour l’Afrique de l’Ouest.",
  alternates: { canonical: "/pourquoi-rallyo" },
};

export default function WhyPage() {
  return (
    <>
      <PageHero
        eyebrow="Pourquoi Rallyo"
        title={<>Parce que rassembler ne devrait pas être <span className="graffiti">compliqué.</span></>}
        lede="En Afrique de l’Ouest, on se mobilise vite et fort. Les outils, eux, n’ont pas toujours suivi. Rallyo est construit pour combler cet écart."
        bg={IMAGES.pourquoiBg}
        tint="cyan"
        actions={<Link href="/comment-ca-marche" className="btn-big">Voir comment ça marche</Link>}
      />

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Le constat"}</div>
            <h2 className="section-title" data-reveal="">
              Ce qui <span className="graffiti">coince</span> aujourd’hui.
            </h2>
          </div>
          <div className="aud-grid">
            {PROBLEMS.map((p) => (
              <div className="aud-card" key={p.title} data-reveal="">
                <div className="icon"><SiteIcon name={p.icon} /></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// La différence"}</div>
            <h2 className="section-title" data-reveal="">
              Ce que <span className="graffiti">Rallyo change.</span>
            </h2>
          </div>
          <div className="why-grid" style={{ marginTop: 0 }}>
            {WHY_CARDS.map((c) => (
              <div className="why-card" key={c.title} data-reveal="">
                <div className="icon"><SiteIcon name={c.icon} /></div>
                <h4>{c.title}</h4>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// En un coup d’œil"}</div>
            <h2 className="section-title" data-reveal="">
              Comparons, <span className="graffiti">honnêtement.</span>
            </h2>
          </div>
          <div className="compare" data-reveal="">
            <table>
              <thead>
                <tr>
                  <th scope="col">Critère</th>
                  {COMPARE_COLS.map((c, i) => (
                    <th scope="col" key={c} className={i === COMPARE_COLS.length - 1 ? "us" : undefined}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={i === r.cells.length - 1 ? "us" : undefined}>
                        <span className={c.v}>{c.v === "yes" ? "✓ " : c.v === "mid" ? "~ " : "✕ "}</span>
                        {c.t}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="compare-note">
            Comparaison générale à titre indicatif : les offres varient d’une plateforme à l’autre. Rallyo décrit ici ce qu’il
            construit pour le lancement.
          </p>
        </div>
      </section>

      <section className="block alt">
        <div className="container">
          <div className="block-head">
            <div className="eyebrow">{"// Pour qui"}</div>
            <h2 className="section-title" data-reveal="">
              Un outil, <span className="graffiti">plusieurs clans.</span>
            </h2>
          </div>
          <div className="aud-grid">
            {AUDIENCES.map((a) => (
              <div className="aud-card" key={a.title} data-reveal="">
                <div className="icon"><SiteIcon name={a.icon} /></div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
