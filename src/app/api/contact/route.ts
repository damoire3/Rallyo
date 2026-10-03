import { validateContact, type ContactInput } from "@/lib/contact";

/**
 * POST /api/contact : reçoit le formulaire « Contact et aide ».
 * Ordre des contrôles : robots → validation → limite de débit → configuration → enregistrement.
 * Les erreurs internes ne sont jamais détaillées au visiteur.
 */

const MAX_BODY = 8_000; // caractères
const MIN_FILL_MS = 2_500; // un humain met plus de 2,5 s à remplir le formulaire
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

// Limite de débit en mémoire : suffisante pour freiner un abus simple, pas une attaque distribuée.
const hits = new Map<string, number[]>();

function tooMany(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: "too_large" }, 413);

  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("shape");
    data = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // Robots : champ piège rempli, ou formulaire envoyé trop vite → on répond « ok » sans rien enregistrer.
  const elapsed = Number(data.elapsed);
  if ((typeof data.website === "string" && data.website.trim() !== "") || (Number.isFinite(elapsed) && elapsed < MIN_FILL_MS)) {
    return json({ ok: true });
  }

  const input: ContactInput = {
    name: String(data.name ?? ""),
    contact: String(data.contact ?? ""),
    topic: String(data.topic ?? ""),
    message: String(data.message ?? ""),
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return json({ error: "validation", errors }, 400);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) return json({ error: "rate_limited" }, 429);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return json({ error: "unconfigured" }, 503);

  try {
    // Insertion par la fonction SQL public.rallyo_contact_submit (la table elle-même n'est pas exposée).
    // La fonction refait la validation et applique sa propre limite de débit côté base.
    const res = await fetch(`${url}/rest/v1/rpc/rallyo_contact_submit`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_name: input.name.trim(),
        p_contact: input.contact.trim(),
        p_topic: input.topic,
        p_message: input.message.trim(),
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { message?: string } | null;
      if (err?.message === "rate_limited") return json({ error: "rate_limited" }, 429);
      if (err?.message === "invalid_input") return json({ error: "validation" }, 400); // sans détail par champ → message générique
      return json({ error: "storage" }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ error: "storage" }, 502);
  }
}
