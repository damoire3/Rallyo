import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentView } from "@/components/views/payment-view";
import { getCagnotteAny, getEventAny } from "@/lib/repo";

export const metadata: Metadata = { title: "Paiement", robots: { index: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PaymentPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const type = first(sp.type);
  const id = first(sp.id) ?? "";

  if (type === "event") {
    const e = await getEventAny(id);
    if (!e) notFound();
    return <PaymentView kind="event" title={e.title} amount={e.price} anonymous={false} />;
  }

  if (type === "cagnotte") {
    const c = await getCagnotteAny(id);
    if (!c) notFound();
    // Montant choisi par l'utilisateur : entier entre 100 et 5 000 000 FCFA, sinon 5 000 par défaut.
    const requested = Number(first(sp.amount));
    const amount = Number.isInteger(requested) && requested >= 100 && requested <= 5_000_000 ? requested : 5000;
    return <PaymentView kind="cagnotte" title={c.title} amount={amount} anonymous={first(sp.anon) === "1"} />;
  }

  notFound();
}
