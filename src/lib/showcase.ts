import { COLORS } from "@/lib/data";
import { IMAGES } from "@/lib/site-data";
import { rpc } from "@/lib/supabase-rest";

/**
 * Vitrine de la landing (section « Ça se passe chez nous »).
 *
 * Règle :
 *  - le back (fonction SQL `showcase_popular`) renvoie au plus 13 évènements / cagnottes en cours, triés par popularité ;
 *  - tant qu'il n'y en a pas (ou si le back est injoignable / non configuré), on affiche des photos d'illustration ;
 *  - dès qu'il y en a, ils passent en premier et les photos ne servent plus qu'à compléter
 *    jusqu'à MIN_SLIDES cartes (pour que le défilé ne paraisse pas vide). Au-delà, plus aucune photo.
 */
export const MAX_SLIDES = 13;
export const MIN_SLIDES = 8;

export type ShowcaseItem = {
  key: string;
  kind: "campaign" | "event" | "photo";
  title: string;
  tag: string;
  sub: string;
  image: string;
  href: string;
  /** Pied de carte : jauge (cagnotte), prix (évènement) ou invitation (photo) */
  footLabel: string;
  footValue: string;
  progress?: number;
  gradient: [string, string];
};

type RpcRow = {
  kind: "campaign" | "event";
  id: string;
  slug: string;
  title: string;
  category: string;
  subtitle: string | null;
  cover_url: string | null;
  progress_pct: number | null;
  ticket_price: number | null;
  tickets_left: number | null;
};

const GRADIENTS: [string, string][] = [
  [COLORS.violet, COLORS.magenta],
  [COLORS.magenta, COLORS.violet],
  [COLORS.cyan, COLORS.violet],
  [COLORS.orange, COLORS.magenta],
  [COLORS.cyan, COLORS.orange],
];

export const gradientFor = (s: string): [string, string] => {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};

const fcfa = (n: number) =>
  n === 0 ? "Gratuit" : new Intl.NumberFormat("fr-FR").format(n).replace(/[\u202f\u00a0]/g, " ") + " FCFA";

/** Photos d'illustration : aucune information inventée, juste une invitation à créer sa page. */
const PHOTO_CARDS: { tag: string; title: string; image: string }[] = [
  { tag: "Concert", title: "Ta soirée peut être ici", image: IMAGES.strip[1] },
  { tag: "Solidarité", title: "Ta cagnotte peut être ici", image: IMAGES.strip[6] },
  { tag: "Street art", title: "Ton projet peut être ici", image: IMAGES.strip[2] },
  { tag: "Festival", title: "Ton festival peut être ici", image: IMAGES.strip[5] },
  { tag: "Communauté", title: "Ta communauté peut être ici", image: IMAGES.strip[8] },
  { tag: "Marché", title: "Ton marché peut être ici", image: IMAGES.strip[11] },
  { tag: "Danse", title: "Ton battle peut être ici", image: IMAGES.strip[3] },
  { tag: "Nuit", title: "Ta nuit peut être ici", image: IMAGES.strip[0] },
  { tag: "Culture", title: "Ton collectif peut être ici", image: IMAGES.strip[9] },
  { tag: "Fête", title: "Ta fête peut être ici", image: IMAGES.strip[4] },
  { tag: "Sport", title: "Ton tournoi peut être ici", image: IMAGES.strip[7] },
  { tag: "Création", title: "Ton studio peut être ici", image: IMAGES.strip[10] },
];

function photoItem(i: number): ShowcaseItem {
  const p = PHOTO_CARDS[i % PHOTO_CARDS.length];
  return {
    key: `photo-${i}`,
    kind: "photo",
    title: p.title,
    tag: p.tag,
    sub: "Sur Rallyo, ça se passe chez nous",
    image: p.image,
    href: "/app/creer",
    footLabel: "Inscription",
    footValue: "0 FCFA",
    gradient: gradientFor(p.tag),
  };
}

function toItem(r: RpcRow): ShowcaseItem {
  const isEvent = r.kind === "event";
  return {
    key: `${r.kind}-${r.id}`,
    kind: r.kind,
    title: r.title,
    tag: r.category,
    sub: r.subtitle ?? "",
    image: r.cover_url || IMAGES.strip[r.title.length % IMAGES.strip.length],
    href: isEvent ? `/app/evenements/${r.id}` : `/app/cagnottes/${r.id}`, // détails : voir src/lib/repo.ts
    footLabel: isEvent ? "Billet" : "Progression",
    footValue: isEvent ? fcfa(r.ticket_price ?? 0) : `${r.progress_pct ?? 0}%`,
    progress: isEvent ? undefined : (r.progress_pct ?? 0),
    gradient: gradientFor(r.category),
  };
}

/** Appelle le back. Ne lève jamais d'erreur : en cas de souci on renvoie une liste vide (→ photos). */
async function fetchPopular(): Promise<ShowcaseItem[]> {
  const rows = await rpc<RpcRow>("showcase_popular", { max_items: MAX_SLIDES });
  return rows.slice(0, MAX_SLIDES).map(toItem);
}

export async function getShowcaseItems(): Promise<{ items: ShowcaseItem[]; live: number }> {
  const real = await fetchPopular();
  const total = Math.min(MAX_SLIDES, Math.max(real.length, MIN_SLIDES));
  const items = [...real];
  for (let i = 0; items.length < total; i++) items.push(photoItem(i));
  return { items, live: real.length };
}
