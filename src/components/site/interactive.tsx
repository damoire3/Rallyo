"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Carte qui s'incline légèrement au survol de la souris. */
export function TiltCard({
  className,
  style,
  children,
  max = 5,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-reveal=""
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

/** Chiffre qui s'incrémente quand il entre à l'écran. Affiche la vraie valeur sans JavaScript. */
export function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    setValue(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        let cur = 0;
        const step = Math.max(1, Math.round(target / 44));
        timer = setInterval(() => {
          cur = Math.min(target, cur + step);
          setValue(cur);
          if (cur >= target && timer) clearInterval(timer);
        }, 28);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [target]);

  return (
    <div className="impact-item" ref={ref} data-reveal="">
      <div className="impact-num" aria-label={`${target}${suffix}`}>
        {value}
        {suffix}
      </div>
      <div className="impact-label">{label}</div>
    </div>
  );
}
