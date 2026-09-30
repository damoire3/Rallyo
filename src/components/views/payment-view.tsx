"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { TopBar } from "@/components/ui";
import { fmt } from "@/lib/data";

type Method = "mobile" | "card";

const METHODS: { id: Method; label: string; sub: string }[] = [
  { id: "mobile", label: "Mobile Money", sub: "MTN, Moov, Celtiis" },
  { id: "card", label: "Carte bancaire", sub: "Visa, Mastercard" },
];

type Props = { kind: "cagnotte" | "event"; title: string; amount: number; anonymous: boolean };

export function PaymentView({ kind, title, amount, anonymous }: Props) {
  const [method, setMethod] = useState<Method>("mobile");
  const [paid, setPaid] = useState(false);
  const isEvent = kind === "event";

  if (paid) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center px-6 pb-8">
        <div className="bg-brand mb-5 flex h-20 w-20 items-center justify-center rounded-full">
          <Icon name="check" size={34} color="#0A0A0F" strokeWidth={3} />
        </div>
        <h2 className="text-center font-display text-[24px] text-white">
          {isEvent ? "BILLET CONFIRMÉ" : "MERCI POUR TON SOUTIEN"}
        </h2>
        <p className="mt-2 text-center text-[13px] text-muted">
          {isEvent
            ? "Ton e-billet est disponible dans l’onglet Billets."
            : "Ta contribution a bien été ajoutée à la cagnotte."}
        </p>
        <Link
          href={isEvent ? "/billets" : "/"}
          className="mt-8 w-full rounded-2xl bg-card py-4 text-center text-[14px] font-bold text-ink"
        >
          {isEvent ? "Voir mes billets" : "Retour à l’accueil"}
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <TopBar title="Paiement" back />
      <div className="mt-2 px-5">
        <div className="flex items-center justify-between rounded-2xl bg-card p-4">
          <div>
            <p className="text-[11px] text-muted">{isEvent ? "Billet" : "Contribution pour"}</p>
            <p className="mt-0.5 max-w-[190px] text-[13px] font-semibold text-white">{title}</p>
            {anonymous && !isEvent && <p className="mt-1 text-[11px] text-cyan">Don anonyme</p>}
          </div>
          <p className="font-mono text-[16px] font-bold text-white">{fmt(amount)}</p>
        </div>

        <p className="mb-3 mt-6 text-[12px] font-bold text-muted">MOYEN DE PAIEMENT</p>
        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Moyen de paiement">
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                role="radio"
                aria-checked={active}
                onClick={() => setMethod(m.id)}
                className={`flex items-center justify-between rounded-2xl border-[1.5px] p-4 ${
                  active ? "border-magenta bg-card-alt" : "border-transparent bg-card"
                }`}
              >
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-white">{m.label}</p>
                  <p className="text-[11px] text-muted">{m.sub}</p>
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active ? "border-magenta" : "border-faint"
                  }`}
                >
                  {active && <div className="h-2.5 w-2.5 rounded-full bg-magenta" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPaid(true)}
          className="bg-brand mt-8 w-full rounded-2xl py-4 text-[14px] font-bold text-bg"
        >
          Payer {fmt(amount)}
        </button>
        <p className="mt-3 text-center text-[11px] text-faint">
          Paiement sécurisé · Rallyo ne stocke aucune donnée bancaire
        </p>
      </div>
    </div>
  );
}
