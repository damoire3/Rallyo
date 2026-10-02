"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site-data";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="site-nav" aria-label="Navigation du site">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          RALLYO
        </Link>
        <div className="navlinks">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/app" className="btn-cta">
          Ouvrir l’appli
        </Link>
        <button
          type="button"
          className="burger"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {open && (
        <div className="mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/app" className="btn-cta" onClick={() => setOpen(false)}>
            Ouvrir l’appli
          </Link>
        </div>
      )}
    </>
  );
}
