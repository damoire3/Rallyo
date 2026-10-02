import type { MetadataRoute } from "next";
import { CAGNOTTES, EVENTS } from "@/lib/data";
import { rpc } from "@/lib/supabase-rest";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Régénéré toutes les heures
export const revalidate = 3600;

type Entry = { kind: "campaign" | "event"; id: string; created_at: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/comment-ca-marche", "/pourquoi-rallyo", "/tarifs", "/securite", "/faq"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const app = [
    { url: `${base}/app`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${base}/app/explorer`, changeFrequency: "daily" as const, priority: 0.6 },
  ];

  // Supabase configuré → uniquement les vraies pages (la démo n'est pas indexée en production).
  // Sinon (développement local) → pages de démonstration.
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const items: { path: string; lastModified?: Date }[] = configured
    ? (await rpc<Entry>("sitemap_entries", { max_items: 5000 }, 3600)).map((r) => ({
        path: `/app/${r.kind === "event" ? "evenements" : "cagnottes"}/${r.id}`,
        lastModified: new Date(r.created_at),
      }))
    : [
        ...CAGNOTTES.map((c) => ({ path: `/app/cagnottes/${c.id}` })),
        ...EVENTS.map((e) => ({ path: `/app/evenements/${e.id}` })),
      ];

  const details = items.map((i) => ({
    url: `${base}${i.path}`,
    lastModified: i.lastModified,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));
  return [...pages, ...app, ...details];
}
