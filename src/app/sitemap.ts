import type { MetadataRoute } from "next";
import { CAGNOTTES, EVENTS } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/comment-ca-marche", "/pourquoi-rallyo", "/tarifs", "/securite", "/faq"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const app = [
    { url: `${base}/app`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${base}/app/explorer`, changeFrequency: "daily" as const, priority: 0.6 },
  ];
  const campaigns = CAGNOTTES.map((c) => ({ url: `${base}/app/cagnottes/${c.id}`, changeFrequency: "daily" as const, priority: 0.5 }));
  const events = EVENTS.map((e) => ({ url: `${base}/app/evenements/${e.id}`, changeFrequency: "daily" as const, priority: 0.5 }));
  return [...pages, ...app, ...campaigns, ...events];
}
