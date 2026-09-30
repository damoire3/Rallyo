import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { TopBar } from "@/components/ui";

export const metadata: Metadata = { title: "Profil" };

const ROWS = [
  "Mes cagnottes créées",
  "Mes évènements",
  "Historique des paiements",
  "Coordonnées de retrait",
  "Aide & support",
];

export default function ProfilePage() {
  return (
    <div className="pb-6">
      <TopBar title="Profil" />
      <div className="mt-2 flex items-center gap-3 px-5">
        <div className="bg-brand h-16 w-16 rounded-full" />
        <div>
          <p className="text-[16px] font-bold text-white">Isaac G.</p>
          <p className="text-[12px] text-muted">Cotonou, Bénin</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 px-5">
        {ROWS.map((r) => (
          <button key={r} className="flex items-center justify-between rounded-2xl bg-card p-4 text-left">
            <span className="text-[13px] text-white">{r}</span>
            <Icon name="chevronRight" size={16} color="#4E4A5E" />
          </button>
        ))}
        <Link
          href="/connexion"
          className="mt-2 rounded-2xl border border-input py-3.5 text-center text-[13px] font-semibold text-ink"
        >
          Se connecter / Créer un compte
        </Link>
      </div>
    </div>
  );
}
