import Link from "next/link";
import type { ShowcaseItem } from "@/lib/showcase";

function ShowCard({ it, hidden }: { it: ShowcaseItem; hidden?: boolean }) {
  const [g0, g1] = it.gradient;
  return (
    <Link
      href={it.href}
      className={`show-card ${it.kind}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <div
        className="show-cover"
        style={{ backgroundImage: `linear-gradient(120deg, ${g0}cc, ${g1}cc), url('${it.image}')` }}
      >
        <span className="show-tag">{it.tag}</span>
      </div>
      <div className="show-body">
        <p className="show-title">{it.title}</p>
        {it.sub && <p className="show-sub">{it.sub}</p>}
        {it.progress !== undefined && (
          <div className="show-bar" aria-hidden>
            <i style={{ width: `${it.progress}%` }} />
          </div>
        )}
        <div className="show-dash" />
        <div className="show-foot">
          <span>{it.footLabel}</span>
          <b>{it.footValue}</b>
        </div>
      </div>
    </Link>
  );
}

/** Défilé des cartes-billets. La 2e série est dupliquée pour une boucle sans coupure (masquée aux lecteurs d'écran). */
export function ShowcaseStrip({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="show-wrap">
      <div className="show-track" style={{ animationDuration: `${Math.max(30, items.length * 5)}s` }}>
        {items.map((it) => (
          <ShowCard key={it.key} it={it} />
        ))}
        {items.map((it) => (
          <ShowCard key={`${it.key}-dup`} it={it} hidden />
        ))}
      </div>
    </div>
  );
}
