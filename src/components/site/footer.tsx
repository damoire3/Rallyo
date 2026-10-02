import Link from "next/link";

const COLS = [
  {
    title: "Plateforme",
    links: [
      { href: "/app/explorer", label: "Cagnottes" },
      { href: "/app/explorer", label: "Billetterie" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/app", label: "Ouvrir l’appli" },
    ],
  },
  {
    title: "Découvrir",
    links: [
      { href: "/comment-ca-marche", label: "Comment ça marche" },
      { href: "/pourquoi-rallyo", label: "Pourquoi Rallyo" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Confiance",
    links: [{ href: "/securite", label: "Sécurité et paiements" }],
  },
  {
    title: "Aide",
    links: [
      { href: "/contact", label: "Contact et aide" },
      { href: "/faq", label: "Questions fréquentes" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <Link href="/" className="logo">
          RALLYO
        </Link>
        <div className="footer-cols">
          {COLS.map((c) => (
            <div className="footer-col" key={c.title}>
              <h5>{c.title}</h5>
              {c.links.map((l) => (
                <Link href={l.href} key={l.label}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">© 2026 RALLYO — Fait avec fierté pour l’Afrique de l’Ouest.</div>
    </footer>
  );
}
