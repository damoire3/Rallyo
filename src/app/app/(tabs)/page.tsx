import Link from "next/link";
import { SectionHeader, TopBar } from "@/components/ui";
import { StubCard } from "@/components/stub-card";
import { CAGNOTTES, EVENTS, IMG } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="pb-6">
      <TopBar right={<div className="h-9 w-9 rounded-full bg-card" />} />

      <section className="relative mx-0 mb-6 mt-1 overflow-hidden rounded-b-[28px] px-5">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `url(${IMG("photo-1765098139127-5fa14432dd8a", 700)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute -left-8 -top-6 h-40 w-40 rounded-full bg-magenta opacity-40 blur-3xl" />
        <div className="absolute right-0 -top-10 h-32 w-32 rounded-full bg-cyan opacity-30 blur-3xl" />

        <p className="relative text-[12px] font-semibold tracking-wider text-cyan">
          RASSEMBLE. CÉLÈBRE. SOUTIENS.
        </p>
        <h1 className="relative mt-1 font-display text-[40px] leading-[0.95] tracking-[0.01em] text-white">
          TA COMMUNAUTÉ,
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_#F5F4F8]">TON</span> MOUVEMENT
        </h1>
        <p className="relative mt-2 text-[13px] text-muted">
          Crée une cagnotte ou vends des billets pour ton évènement, en quelques minutes.
        </p>
        <div className="relative mb-4 mt-4 flex gap-2.5">
          <Link
            href="/app/creer"
            className="bg-brand flex-1 rounded-2xl py-3 text-center text-[13px] font-bold text-bg"
          >
            Lancer une cagnotte
          </Link>
          <Link
            href="/app/explorer"
            className="rounded-2xl border border-input bg-card px-4 py-3 text-[13px] font-bold text-ink"
          >
            Explorer
          </Link>
        </div>
      </section>

      <SectionHeader title="Cagnottes du moment" href="/app/explorer" />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
        {CAGNOTTES.map((c) => (
          <div key={c.id} className="w-[220px] shrink-0">
            <StubCard kind="cagnotte" item={c} />
          </div>
        ))}
      </div>

      <div className="mt-7">
        <SectionHeader title="Évènements à ne pas rater" href="/app/explorer" />
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
        {EVENTS.map((e) => (
          <div key={e.id} className="w-[220px] shrink-0">
            <StubCard kind="event" item={e} />
          </div>
        ))}
      </div>
    </div>
  );
}
