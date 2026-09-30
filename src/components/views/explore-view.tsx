"use client";

import { useState } from "react";
import { StubCard } from "@/components/stub-card";
import { CAGNOTTES, EVENTS } from "@/lib/data";

type Tab = "cagnottes" | "billets";

const CATS: Record<Tab, string[]> = {
  cagnottes: ["Tout", "Solidarité", "Sport", "Créativité"],
  billets: ["Tout", "Concert", "Battle", "Marché"],
};

export function ExploreView() {
  const [tab, setTab] = useState<Tab>("cagnottes");
  const [filter, setFilter] = useState("Tout");

  const matches = (cat: string) => filter === "Tout" || cat === filter;

  return (
    <>
      <div className="mt-2 px-5">
        <div className="flex gap-2 rounded-2xl bg-card p-1" role="tablist">
          {(["cagnottes", "billets"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t);
                setFilter("Tout");
              }}
              className={`flex-1 rounded-xl py-2.5 text-[13px] font-bold capitalize ${
                tab === t ? "bg-brand text-bg" : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="no-scrollbar mb-4 mt-4 flex items-center gap-2 overflow-x-auto">
          {CATS[tab].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                filter === c ? "bg-ink text-bg" : "bg-card text-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5">
        {tab === "cagnottes"
          ? CAGNOTTES.filter((c) => matches(c.cat)).map((c) => <StubCard key={c.id} kind="cagnotte" item={c} />)
          : EVENTS.filter((e) => matches(e.cat)).map((e) => <StubCard key={e.id} kind="event" item={e} />)}
      </div>
    </>
  );
}
