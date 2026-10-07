"use client";

import { useState } from "react";
import { fmt } from "@/lib/data";
import { computeFee, DEFAULT_METHOD, fmtRate, PROVIDER_METHODS, RALLYO_RATE } from "@/lib/fees";

/** Simulateur : frais = 5 % Rallyo + pourcentage FedaPay selon le moyen de paiement (cf. src/lib/fees.ts). */
export function FeeCalculator() {
  const [raw, setRaw] = useState("250000");
  const [methodId, setMethodId] = useState(DEFAULT_METHOD.id);

  const method = PROVIDER_METHODS.find((m) => m.id === methodId) ?? DEFAULT_METHOD;
  const amount = Number(raw.replace(/\D/g, "")) || 0;
  const r = computeFee(amount, method.rate);

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

      <label htmlFor="calc-method" className="calc-label-2">Moyen de paiement de tes participants</label>
      <select id="calc-method" value={methodId} onChange={(e) => setMethodId(e.target.value)}>
        {PROVIDER_METHODS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} ({fmtRate(m.rate)} %)
          </option>
        ))}
      </select>

      <div className="calc-rows" aria-live="polite">
        <div className="calc-row">
          <span>Commission Rallyo ({fmtRate(RALLYO_RATE)} %)</span>
          <b>{fmt(r.rallyoFee)}</b>
        </div>
        <div className="calc-row">
          <span>Frais de paiement FedaPay ({fmtRate(method.rate)} %)</span>
          <b>{fmt(r.providerFee)}</b>
        </div>
        <div className="calc-row">
          <span>Total des frais ({fmtRate(r.totalRate)} %)</span>
          <b>{fmt(r.fee)}</b>
        </div>
        <div className="calc-row total">
          <span>Tu reçois</span>
          <b>{fmt(r.net)}</b>
        </div>
      </div>

      <p className="note">
        Les frais se résument à {fmtRate(RALLYO_RATE)} % pour Rallyo, plus le pourcentage du prestataire de paiement
        (FedaPay) selon le moyen utilisé. Aucun autre frais : pas d’inscription, pas d’abonnement. Estimation hors frais
        fixes de virement de tes fonds. Les pourcentages du prestataire seront confirmés au lancement.
      </p>
    </div>
  );
}
