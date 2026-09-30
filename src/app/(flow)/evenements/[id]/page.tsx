import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { CategoryBadge, Dashes, TopBar } from "@/components/ui";
import { EVENTS, fmt, getEvent } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const e = getEvent(id);
  if (!e) return { title: "Évènement introuvable" };
  const description = `${e.date} · ${e.time} · ${e.place} — billet à ${fmt(e.price)}`;
  return {
    title: e.title,
    description,
    openGraph: { title: e.title, description, images: [{ url: e.image }], type: "website", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: e.title, description, images: [e.image] },
  };
}

export default async function EventDetailPage({ params }: Params) {
  const { id } = await params;
  const e = getEvent(id);
  if (!e) notFound();

  return (
    <div className="pb-8">
      <div
        className="relative flex h-56 flex-col justify-between"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.15), rgba(10,10,15,0.85)), url(${e.image}), ${e.gradient}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <TopBar
          back
          right={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg/35">
              <Icon name="heart" size={15} color="#fff" />
            </div>
          }
        />
        <div className="px-5 pb-8">
          <CategoryBadge>{e.cat}</CategoryBadge>
          <h1 className="mt-2 font-display text-[24px] leading-tight text-white">{e.title.toUpperCase()}</h1>
        </div>
      </div>

      <div className="relative -mt-5 px-5">
        <div className="rounded-3xl border border-line bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Icon name="mapPin" size={14} color="#2FE0D6" />
            <span className="text-[13px] text-white">{e.place}</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Icon name="calendar" size={14} color="#2FE0D6" />
            <span className="text-[13px] text-white">
              {e.date} · {e.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="users" size={14} color="#2FE0D6" />
            <span className="text-[13px] text-white">{e.left} billets restants</span>
          </div>
          <div className="my-3">
            <Dashes />
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            Accès général, ouverture des portes 1h avant le début. Billet nominatif, e-ticket avec QR code
            envoyé immédiatement après l’achat.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">Prix du billet</p>
            <p className="font-mono text-[22px] font-bold text-white">{fmt(e.price)}</p>
          </div>
          <Link
            href={`/paiement?type=event&id=${e.id}`}
            className="bg-brand flex items-center gap-2 rounded-2xl px-8 py-4 text-[14px] font-bold text-bg"
          >
            <Icon name="ticket" size={17} /> Acheter
          </Link>
        </div>
      </div>
    </div>
  );
}
