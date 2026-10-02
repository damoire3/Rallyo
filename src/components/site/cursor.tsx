"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SPRAY_COLORS = ["#e8ff3d", "#ff2d78", "#00e5ff"];

/** Curseur personnalisé + traînée de peinture. Uniquement sur appareils à souris. */
export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const site = cursor?.closest<HTMLElement>(".site");
    if (!cursor || !dot || !site) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    site.classList.add("has-cursor");
    let last = 0;

    const onMove = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power3.out" });
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
      const now = performance.now();
      if (now - last > 45) {
        last = now;
        const p = document.createElement("div");
        p.className = "spray-dot";
        p.style.left = `${e.clientX + (Math.random() * 10 - 5)}px`;
        p.style.top = `${e.clientY + (Math.random() * 10 - 5)}px`;
        p.style.background = SPRAY_COLORS[Math.floor(Math.random() * SPRAY_COLORS.length)];
        site.appendChild(p);
        setTimeout(() => p.remove(), 700);
      }
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, summary")) {
        gsap.to(cursor, { width: 50, height: 50, borderColor: "#ff2d78" });
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, summary")) {
        gsap.to(cursor, { width: 26, height: 26, borderColor: "#e8ff3d" });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      site.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden />
      <div className="cursor-dot" ref={dotRef} aria-hidden />
    </>
  );
}
