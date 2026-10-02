/**
 * Appel des fonctions SQL publiques de Supabase (PostgREST /rpc) depuis le serveur Next.js.
 * Ne lève jamais d'erreur : sans configuration, en cas de timeout ou de réponse invalide → tableau vide.
 */
export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function rpc<T>(fn: string, args: Record<string, unknown>, revalidate = 60): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      next: { revalidate },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}
