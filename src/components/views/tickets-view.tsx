"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Barcode, Dashes, Notch } from "@/components/ui";
import { MY_TICKETS, type MyTicket } from "@/lib/data";

export function TicketsView() {
  const [openQr, setOpenQr] = useState<MyTicket | null>(null);

  return (
    <>
      <div className="mt-3 flex flex-col gap-4 px-5 pb-6">
        {MY_TICKETS.map((t) => (
          <article key={t.id} className="relative overflow-hidden rounded-[22px] border border-line bg-card">
            <div className="bg-brand h-3 w-full" />
            <div className="p-4">
              <p className="font-display text-[15px] tracking-[0.02em] text-white">{t.title.toUpperCase()}</p>
              <p className="mt-1 text-[12px] text-muted">
                {t.date} · {t.place}
              </p>
              <p className="mt-0.5 text-[12px] text-cyan">{t.seat}</p>
            </div>
            <Notch side="left" />
            <Notch side="right" />
            <div className="px-4">
              <Dashes />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-[10px] text-faint">CODE</p>
                <p className="font-mono text-[13px] text-white">{t.code}</p>
              </div>
              <button
                onClick={() => setOpenQr(t)}
                className="bg-brand flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold text-bg"
              >
                <Icon name="qrCode" size={14} /> Afficher
              </button>
            </div>
          </article>
        ))}

        <div className="mt-6 text-center opacity-60">
          <Icon name="partyPopper" size={22} color="#4E4A5E" />
          <p className="mt-2 text-[12px] text-faint">
            Tes prochains billets et reçus de cagnotte apparaîtront ici.
          </p>
        </div>
      </div>

      {openQr && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`QR code — ${openQr.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 px-8"
          onClick={() => setOpenQr(null)}
        >
          <div
            className="w-full max-w-[320px] rounded-3xl bg-card p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[14px] font-bold text-white">{openQr.title}</p>
            <div className="mx-auto my-5 flex h-44 w-44 items-center justify-center rounded-2xl bg-white">
              <Icon name="qrCode" size={140} color="#0A0A0F" />
            </div>
            <Barcode />
            <p className="mt-3 font-mono text-[11px] text-muted">{openQr.code}</p>
            <button
              onClick={() => setOpenQr(null)}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-card-alt py-3 text-[13px] font-bold text-ink"
            >
              <Icon name="x" size={14} /> Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
