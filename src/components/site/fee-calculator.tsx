"use client";

import { useState } from "react";
import { fmt } from "@/lib/data";
import { computeFee, FEE_MAX_RATE, FEE_MIN_RATE } from "@/lib/fees";

/** Simulateur : commission exacte selon la grille dégressive (hors frais du prestataire Mobile Money). */
export function FeeCalculator() {
  const [raw, setRaw] = useState("250000");

  const amount = Number(raw.replace(/\D/g, "")) || 0;
  const r = computeFee(amount);
  const rate = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(r.effectiveRate);

  return (
    <div className="calc">
      <label htmlFor="calc-amount">Montant collecté ou ventes de billets (FCFA)</label>
      <input
        id="calc-amount"
        inputMode="numeric"
        value={amount ? new Intl.NumberFormat("fr-FR").format(amount) : ""}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Ex : 250 000"
      />

      <div className="calc-rows" aria-live="polite">
        <div className="calc-row">
          <span>Commission Rallyo</span>
          <b>{fmt(r.fee)}</b>
        </div>
        <div className="calc-row">
          <span>Taux moyen réel</span>
          <b>{amount ? `${rate} %` : `${FEE_MAX_RATE} %`}</b>
        </div>
        <div className="calc-row total">
          <span>Tu reçois</span>
          <b>{fmt(r.net)}</b>
        </div>
      </div>

      {r.slices.length > 1 && (
        <details className="calc-detail">
          <summary>Voir le détail par tranche</summary>
          {r.slices.map((s) => (
            <div className="calc-row" key={s.from}>
              <span>
                {fmt(s.amount)} à {s.rate} %
              </span>
              <b>{fmt(Math.round(s.fee))}</b>
            </div>
          ))}
        </details>
      )}

      <p className="note">
        Le taux baisse par tranches, de {FEE_MAX_RATE} % à {FEE_MIN_RATE} % : chaque tranche est facturée à son propre taux,
        donc plus tu collectes, plus ton taux moyen diminue. Estimation hors frais du prestataire de paiement Mobile Money,
        qui varient selon l’opérateur. Les taux seront confirmés au lancement.
      </p>
    </div>
  );
}
