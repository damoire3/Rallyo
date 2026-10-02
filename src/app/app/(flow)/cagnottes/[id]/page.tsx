import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { CategoryBadge, Dashes, ProgressBar, TopBar } from "@/components/ui";
import { CAGNOTTES, fmt, getCagnotte } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CAGNOTTES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const c = getCagnotte(id);
  if (!c) return { title: "Cagnotte introuvable" };
  const pct = Math.round((c.raised / c.goal) * 100);
  const description = `${fmt(c.raised)} collectés sur ${fmt(c.goal)} (${pct}%) · ${c.supporters} soutiens · par ${c.org}`;
  return {
    title: c.title,
    description,
    openGraph: { title: c.title, description, images: [{ url: c.image }], type: "website", locale: "fr_FR" },
    twitter: { card: "summary_large_image", title: c.title, description, images: [c.image] },
  };
}

export default async function CagnotteDetailPage({ params }: Params) {
  const { id } = await params;
  const c = getCagnotte(id);
  if (!c) notFound();

  const pct = Math.round((c.raised / c.goal) * 100);

  return (
    <div className="pb-8">
      <div
        className="relative flex h-56 flex-col justify-between"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,10,15,0.15), rgba(10,10,15,0.85)), url(${c.image}), ${c.gradient}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <TopBar
          back
          right={
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg/35">
              <Icon name="share" size={15} color="#fff" />
            </div>
          }
        />
        <div className="px-5 pb-8">
          <CategoryBadge>{c.cat}</CategoryBadge>
          <h1 className="mt-2 font-display text-[24px] leading-tight text-white">{c.title.toUpperCase()}</h1>
        </div>
      </div>

      <div className="relative -mt-5 px-5">
        <div className="rounded-3xl border border-line bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="bg-brand h-8 w-8 rounded-full" />
            <div>
              <p className="text-[13px] font-semibold text-white">{c.org}</p>
              <p className="text-[11px] text-muted">Organisateur vérifié</p>
            </div>
          </div>

          <ProgressBar pct={pct} />
          <div className="mt-2 flex justify-between">
            <div>
              <p className="font-mono text-[18px] font-bold text-white">{fmt(c.raised)}</p>
              <p className="text-[11px] text-muted">collectés sur {fmt(c.goal)}</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-bold text-white">{c.supporters}</p>
              <p className="text-[11px] text-muted">soutiens</p>
            </div>
          </div>

          <div className="mt-3">
            <Dashes />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            Chaque contribution, même anonyme, rapproche cette communauté de son objectif. Il reste{" "}
            <span className="text-cyan">{c.days} jours</span> pour participer à cette cagnotte.
          </p>

          <div className="mt-4 flex gap-2">
            {[2000, 5000, 10000].map((v) => (
              <Link
                key={v}
                href={`/app/paiement?type=cagnotte&id=${c.id}&amount=${v}`}
                className="flex-1 rounded-xl bg-card-alt py-2 text-center text-[12px] font-bold text-ink"
              >
                {fmt(v)}
              </Link>
            ))}
          </div>
        </div>

        <Link
          href={`/app/paiement?type=cagnotte&id=${c.id}`}
          className="bg-brand mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-bg"
        >
          <Icon name="handCoins" size={17} /> Contribuer à la cagnotte
        </Link>
        <Link
          href={`/app/paiement?type=cagnotte&id=${c.id}&anon=1`}
          className="mt-2 block w-full rounded-2xl py-3 text-center text-[13px] font-bold text-muted"
        >
          Faire un don anonyme
        </Link>
      </div>
    </div>
  );
}
