"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Field } from "@/components/ui";

type Kind = "cagnotte" | "billetterie";

export function CreateView() {
  const [kind, setKind] = useState<Kind>("cagnotte");
  const [done, setDone] = useState(false);
  const [anonymous, setAnonymous] = useState(true);

  if (done) {
    return (
      <div className="flex min-h-[600px] flex-col items-center justify-center px-6">
        <Icon name="sparkles" size={40} color="#FF2E9A" />
        <h2 className="mt-4 text-center font-display text-[22px] text-white">C’EST EN LIGNE !</h2>
        <p className="mt-2 text-center text-[13px] text-muted">
          Partage le lien pour rassembler ta communauté dès maintenant.
        </p>
        <button
          onClick={() => setDone(false)}
          className="bg-brand mt-8 w-full rounded-2xl py-4 text-[14px] font-bold text-bg"
        >
          Créer une autre publication
        </button>
      </div>
    );
  }

  const isCagnotte = kind === "cagnotte";

  return (
    <div className="mt-2 px-5">
      <div className="flex gap-2 rounded-2xl bg-card p-1" role="tablist">
        {([
          { id: "cagnotte", label: "Cagnotte" },
          { id: "billetterie", label: "Billetterie" },
        ] as const).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={kind === t.id}
            onClick={() => setKind(t.id)}
            className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold ${
              kind === t.id ? "bg-brand text-bg" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <button
          type="button"
          className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-faint bg-card"
        >
          <Icon name="camera" size={22} color="#918DA3" />
          <span className="text-[12px] text-muted">Ajouter une image de couverture</span>
        </button>

        <Field
          label={isCagnotte ? "Titre de la cagnotte" : "Nom de l’évènement"}
          placeholder={isCagnotte ? "Ex : Opération Toit pour Aïcha" : "Ex : Nuit Graffiti & Bass"}
        />
        <Field area label="Description" placeholder="Explique ta cause ou ton évènement..." />

        {isCagnotte ? (
          <Field label="Objectif (FCFA)" placeholder="Ex : 1 500 000" inputMode="numeric" />
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Date" placeholder="jj/mm/aaaa" />
            </div>
            <div className="flex-1">
              <Field label="Prix du billet (FCFA)" placeholder="Ex : 3000" inputMode="numeric" />
            </div>
          </div>
        )}

        <Field
          label={isCagnotte ? "Bénéficiaire / organisateur" : "Lieu"}
          placeholder={isCagnotte ? "Ex : Famille Kouassi" : "Ex : Hangar 12, Cotonou"}
        />

        {isCagnotte && (
          <div className="flex items-center justify-between rounded-2xl bg-card p-4">
            <div>
              <p className="text-[13px] font-semibold text-white">Autoriser les dons anonymes</p>
              <p className="text-[11px] text-muted">Uniquement pour les cagnottes</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={anonymous}
              aria-label="Autoriser les dons anonymes"
              onClick={() => setAnonymous((v) => !v)}
              className={`flex h-6 w-11 rounded-full p-0.5 ${anonymous ? "bg-brand" : "bg-[#2A2734]"}`}
            >
              <span className={`h-5 w-5 rounded-full bg-white transition-all ${anonymous ? "ml-auto" : ""}`} />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setDone(true)}
        className="bg-brand mb-6 mt-7 w-full rounded-2xl py-4 text-[14px] font-bold text-bg"
      >
        Publier sur Rallyo
      </button>
    </div>
  );
}
