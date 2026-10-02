"use client";

import Link from "next/link";
import { useState } from "react";

const DEMO_STEPS = [
  { path: "/app/explorer", title: "Explorer", text: "Parcours les cagnottes et les évènements, filtre par catégorie." },
  { path: "/app/cagnottes/c1", title: "Soutenir une cagnotte", text: "Jauge, nombre de soutiens, montants suggérés et don anonyme." },
  { path: "/app/evenements/e1", title: "Acheter un billet", text: "Lieu, date, places restantes, puis paiement Mobile Money." },
  { path: "/app/creer", title: "Créer la tienne", text: "Cagnotte ou billetterie : le formulaire tient sur un écran." },
];

/** Téléphone interactif : c'est la vraie appli (/app) dans un iframe. */
export function PhoneDemo() {
  const [active, setActive] = useState(0);
  const current = DEMO_STEPS[active];

  return (
    <div className="demo">
      <div className="demo-steps">
        {DEMO_STEPS.map((s, i) => (
          <button
            key={s.path}
            type="button"
            className="demo-step"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span className="n">{i + 1}</span>
            <span>
              <strong>{s.title}</strong>
              <span className="d">{s.text}</span>
            </span>
          </button>
        ))}
        <p className="demo-hint">
          👆 Clique dans l’écran du téléphone : c’est la vraie appli. Les données sont fictives.{" "}
          <Link href="/app" style={{ color: "var(--cyan)", borderBottom: "1px solid var(--cyan)" }}>
            Ouvrir en plein écran
          </Link>
        </p>
      </div>

      <div className="phone">
        <div className="phone-notch" aria-hidden />
        <iframe
          key={current.path}
          src={current.path}
          title={`Démo interactive de l’appli Rallyo : ${current.title}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
