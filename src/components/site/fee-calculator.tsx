"use client";

import { useState } from "react";
import { fmt } from "@/lib/data";
import { FEE_RATES } from "@/lib/site-data";

type Kind = "cagnotte" | "billetterie";

/** Simulateur : fourchette de frais Rallyo (hors frais du prestataire Mobile Money). */
export function FeeCalculator() {
  const [kind, setKind] = useState<Kind>("cagnotte");
  const [raw, setRaw] = useState("100000");

  const amount = Number(raw.replace(/\D/g, "")) || 0;
  const [lo, hi] = FEE_RATES[kind];
  const feeLo = Math.round((amount * lo) / 100);
  const feeHi = Math.round((amount * hi) / 100);

  return (
    <div className="calc">
      <div className="calc-tabs" role="group" aria-label="Type de collecte">
        {(["cagnotte", "billetterie"] as const).map((k) => (
          <button key={k} type="button" className="tab-btn" aria-pressed={kind === k} onClick={() => setKind(k)}>
            {k === "cagnotte" ? "Cagnotte" : "Billetterie"}
          </button>
        ))}
      </div>

      <label htmlFor="calc-amount">{kind === "cagnotte" ? "Montant collecté (FCFA)" : "Ventes de billets (FCFA)"}</label>
      <input
        id="calc-amount"
        inputMode="numeric"
        value={amount ? new Intl.NumberFormat("fr-FR").format(amount) : ""}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Ex : 100 000"
      />

      <div className="calc-rows">
        <div className="calc-row">
          <span>
            Commission Rallyo ({lo} à {hi} %)
          </span>
          <b>
            {fmt(feeLo)} – {fmt(feeHi)}
          </b>
        </div>
        <div className="calc-row total">
          <span>Tu reçois environ</span>
          <b>
            {fmt(Math.max(0, amount - feeHi))} – {fmt(Math.max(0, amount - feeLo))}
          </b>
        </div>
      </div>
      <p className="note">
        Estimation hors frais du prestataire de paiement Mobile Money, qui varient selon l’opérateur. Les taux exacts seront
        confirmés au lancement.
      </p>
    </div>
  );
}
