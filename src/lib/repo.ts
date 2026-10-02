import { getCagnotte, getEvent, type Cagnotte, type EventItem } from "@/lib/data";
import { gradientFor } from "@/lib/showcase";
import { IMAGES } from "@/lib/site-data";
import { isUuid, rpc } from "@/lib/supabase-rest";

/**
 * Accès aux données des pages de détail et du paiement.
 * Ordre : 1) données de démonstration (ids c1, e1…) 2) Supabase si l'id est un UUID.
 * Renvoie les mêmes types que la démo : les vues n'ont pas à changer.
 */
const grad = ([a, b]: [string, string]) => `linear-gradient(120deg, ${a}, ${b})`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const TZ = "Africa/Porto-Novo"; // UTC+1, Afrique de l'Ouest francophone

type CampaignRow = {
  id: string; title: string; category: string; goal_amount: number; raised_amount: number;
  supporters: number; ends_at: string | null; owner_name: string | null; cover_url: string | null;
};
type EventRow = {
  id: string; title: string; category: string; venue: string; starts_at: string;
  ticket_price: number; capacity: number; tickets_left: number; cover_url: string | null;
};

export async function getCagnotteAny(id: string): Promise<Cagnotte | undefined> {
  const demo = getCagnotte(id);
  if (demo || !isUuid(id)) return demo;

  const [r] = await rpc<CampaignRow>("campaign_public", { p_id: id }, 30);
  if (!r) return undefined;
  // 0 = pas de date limite (la page adapte sa phrase)
  const days = r.ends_at ? Math.max(1, Math.ceil((new Date(r.ends_at).getTime() - Date.now()) / 86_400_000)) : 0;
  return {
    id: r.id,
    title: r.title,
    cat: r.category,
    goal: r.goal_amount,
    raised: r.raised_amount,
    supporters: r.supporters,
    days,
    org: r.owner_name ?? "Organisateur",
    image: r.cover_url || IMAGES.strip[r.title.length % IMAGES.strip.length],
    gradient: grad(gradientFor(r.category)),
  };
}

export async function getEventAny(id: string): Promise<EventItem | undefined> {
  const demo = getEvent(id);
  if (demo || !isUuid(id)) return demo;

  const [r] = await rpc<EventRow>("event_public", { p_id: id }, 30);
  if (!r) return undefined;
  const d = new Date(r.starts_at);
  const date = d
    .toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "long", timeZone: TZ })
    .split(" ")
    .map(cap)
    .join(" ");
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  return {
    id: r.id,
    title: r.title,
    place: r.venue,
    date,
    time,
    price: r.ticket_price,
    cat: r.category,
    left: r.tickets_left,
    image: r.cover_url || IMAGES.strip[r.title.length % IMAGES.strip.length],
    gradient: grad(gradientFor(r.category)),
  };
}
