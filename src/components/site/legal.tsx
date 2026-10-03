import type { ReactNode } from "react";
import { IMAGES } from "@/lib/site-data";
import { PageHero } from "./blocks";

export type LegalSection = {
  title: string;
  /** Paragraphes. Les passages [[entre doubles crochets]] sont des champs à compléter, surlignés. */
  paragraphs?: string[];
  /** Liste à puces facultative, affichée après les paragraphes. */
  items?: string[];
};

/** Surligne les champs à compléter : « [[raison sociale]] » devient un repère visible. */
function rich(text: string): ReactNode[] {
  return text.split(/(\[\[.+?\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <mark className="todo" key={i}>
        {part.slice(2, -2)}
      </mark>
    ) : (
      part
    ),
  );
}

/** Version de travail : tant que ces textes ne sont pas validés par un juriste, la bannière reste affichée. */
export const LEGAL_VERSION = "Version de travail du 3 octobre 2026";

export function LegalPage({
  eyebrow,
  title,
  lede,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lede={lede} bg={IMAGES.murBg} tint="violet" />
      <section className="block">
        <div className="container legal">
          <aside className="legal-banner" role="note">
            <strong>Projet de document, à faire valider par un juriste avant toute publication.</strong>{" "}
            Les passages <mark className="todo">surlignés</mark> sont des informations à compléter. {LEGAL_VERSION}.
          </aside>

          <nav className="legal-toc" aria-label="Sommaire">
            <ol>
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`}>
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.paragraphs?.map((p) => (
                <p key={p}>{rich(p)}</p>
              ))}
              {s.items && (
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{rich(it)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
