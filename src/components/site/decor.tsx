import type { CSSProperties, ReactNode } from "react";

export function Sticker({ text, style, className = "" }: { text: string; style?: CSSProperties; className?: string }) {
  return (
    <div className={`sticker ${className}`.trim()} style={style}>
      {text}
    </div>
  );
}

export function ScribbleUnderline({ children, color = "var(--pink)" }: { children: ReactNode; color?: string }) {
  return (
    <span className="scribble-underline">
      {children}
      <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
        <path
          d="M2 12 C 40 4, 80 18, 120 8 C 150 2, 175 14, 198 6"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function SprayBlob({ color = "var(--pink)", size = 260, style }: { color?: string; size?: number; style?: CSSProperties }) {
  return (
    <svg className="spray-blob" width={size} height={size} viewBox="0 0 200 200" style={style} aria-hidden>
      <circle cx="100" cy="100" r="70" fill={color} opacity="0.16" />
      <circle cx="60" cy="70" r="6" fill={color} opacity="0.35" />
      <circle cx="150" cy="60" r="4" fill={color} opacity="0.3" />
      <circle cx="140" cy="140" r="9" fill={color} opacity="0.25" />
      <circle cx="45" cy="150" r="5" fill={color} opacity="0.3" />
      <circle cx="170" cy="110" r="3" fill={color} opacity="0.4" />
    </svg>
  );
}

export type Tint = "pink" | "cyan" | "acid" | "violet" | "orange";

/** Section à fond « mur » collant, avec voile coloré. */
export function Scene({ id, bg, tint, children }: { id?: string; bg: string; tint: Tint; children: ReactNode }) {
  return (
    <section id={id} className="scene">
      <div className="scene-bg" style={{ backgroundImage: `url('${bg}')` }}>
        <div className={`tint tint-${tint}`} />
      </div>
      <div className="scene-content">{children}</div>
    </section>
  );
}
