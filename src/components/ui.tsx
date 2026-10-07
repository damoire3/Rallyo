import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { BackButton } from "./back-button";
import { Icon } from "./icon";

export function Logo({ size = "text-lg" }: { size?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="bg-brand h-2.5 w-2.5 rounded-full" />
      <span className={`font-display tracking-[0.02em] text-white ${size}`}>RALLYO</span>
    </div>
  );
}

export function TopBar({ title, back, right }: { title?: string; back?: boolean; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      {back ? <BackButton /> : <Logo />}
      {title && <span className="text-[15px] font-semibold text-white">{title}</span>}
      <div className="flex h-9 w-9 items-center justify-center">{right}</div>
    </div>
  );
}

export function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between px-5">
      <h2 className="text-[15px] font-bold text-white">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center text-[12px] text-muted">
          Tout voir <Icon name="chevronRight" size={14} />
        </Link>
      )}
    </div>
  );
}

/** Encoche des cartes "ticket" */
export function Notch({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-bg ${
        side === "left" ? "-left-2" : "-right-2"
      }`}
    />
  );
}

export function Dashes() {
  return (
    <div
      className="mx-4 h-px"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, #4E4A5E 0 6px, transparent 6px 12px)",
      }}
    />
  );
}

export function Barcode() {
  const bars = [2,1,3,1,1,2,3,1,2,1,1,3,2,1,1,2,3,1,2,2,1,3,1,1,2,1,3,2,1,1,2,3,1,1,2];
  return (
    <div className="flex h-9 items-end justify-center gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-bg opacity-85"
          style={{ width: w, height: i % 5 === 0 ? "100%" : "70%" }}
        />
      ))}
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  const value = Math.max(0, Math.min(pct, 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-[#2A2734]"
    >
      <div className="bg-brand h-full rounded-full" style={{ width: `${value}%` }} />
    </div>
  );
}

export function CategoryBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-bg/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
      {children}
    </span>
  );
}

const fieldClass =
  "mt-1 w-full rounded-xl border border-input bg-card px-3.5 py-3 text-[13px] text-white outline-none focus:border-magenta";

type FieldProps = { label: string } & (
  | ({ area?: false } & InputHTMLAttributes<HTMLInputElement>)
  | ({ area: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

export function Field(props: FieldProps) {
  const { label, area, ...rest } = props;
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-muted">{label}</span>
      {area ? (
        <textarea rows={3} className={`${fieldClass} resize-none`} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input className={fieldClass} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}
