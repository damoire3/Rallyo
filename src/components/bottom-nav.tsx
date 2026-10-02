"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icon";

const ITEMS: { href: string; icon: IconName; label: string; central?: boolean }[] = [
  { href: "/app", icon: "home", label: "Accueil" },
  { href: "/app/explorer", icon: "search", label: "Explorer" },
  { href: "/app/creer", icon: "plusCircle", label: "Créer", central: true },
  { href: "/app/billets", icon: "ticket", label: "Billets" },
  { href: "/app/profil", icon: "user", label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation principale"
      className="flex shrink-0 items-center justify-between border-t border-card bg-bg/90 px-4 pt-2 backdrop-blur-md"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      {ITEMS.map((it) => {
        const active = it.href === "/app" ? pathname === "/app" : pathname.startsWith(it.href);
        if (it.central) {
          return (
            <Link key={it.href} href={it.href} aria-label={it.label} className="-mt-6 flex flex-col items-center">
              <div className="bg-brand flex h-12 w-12 rotate-3 items-center justify-center rounded-2xl shadow-[0_6px_18px_rgba(255,46,154,0.35)]">
                <Icon name="plusCircle" size={22} color="#0A0A0F" strokeWidth={2.5} />
              </div>
            </Link>
          );
        }
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center gap-1 px-2 py-1"
          >
            <Icon name={it.icon} size={20} color={active ? "#F5F4F8" : "#4E4A5E"} strokeWidth={active ? 2.4 : 1.8} />
            <span className={`text-[10px] font-medium ${active ? "text-ink" : "text-faint"}`}>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
