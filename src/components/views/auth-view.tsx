"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IMG } from "@/lib/data";
import { Logo } from "@/components/ui";

type Mode = "login" | "register";

const inputClass =
  "w-full rounded-xl border border-input bg-card p-3.5 text-[13px] text-white outline-none focus:border-magenta";

export function AuthView() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const isLogin = mode === "login";

  return (
    <div className="relative flex min-h-full flex-col justify-end">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.35), rgba(10,10,15,0.98) 78%), url(${IMG("photo-1750186649523-cff3329a6e76", 900)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative px-6 pb-10 pt-16">
        <div className="mb-8">
          <Logo size="text-2xl" />
        </div>
        <h1 className="font-display text-[32px] leading-[0.95] text-white">
          {isLogin ? "CONTENT DE TE REVOIR" : "REJOINS LE MOUVEMENT"}
        </h1>
        <p className="mt-2 text-[13px] text-muted">
          {isLogin
            ? "Connecte-toi pour gérer tes cagnottes et tes billets."
            : "Crée ton compte pour lancer une cagnotte ou vendre des billets."}
        </p>

        {/* TODO : brancher Supabase Auth (téléphone OTP + email) */}
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/");
          }}
        >
          {!isLogin && (
            <input className={inputClass} placeholder="Nom complet" autoComplete="name" required />
          )}
          <input
            className={inputClass}
            placeholder="Numéro de téléphone ou email"
            autoComplete="username"
            required
          />
          <input
            className={inputClass}
            placeholder="Mot de passe"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
          <button type="submit" className="bg-brand mt-2 w-full rounded-2xl py-4 text-[14px] font-bold text-bg">
            {isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          className="mt-3 w-full py-2 text-[13px] font-semibold text-ink"
        >
          {isLogin ? "Pas encore de compte ? " : "Déjà inscrit ? "}
          <span className="text-cyan">{isLogin ? "Créer un compte" : "Se connecter"}</span>
        </button>

        <Link href="/" className="mt-1 block w-full py-2 text-center text-[12px] text-faint">
          Continuer sans compte
        </Link>
      </div>
    </div>
  );
}
