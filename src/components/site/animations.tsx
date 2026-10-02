"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animations du site : apparition des blocs [data-reveal], parallaxe du hero,
 * flottement du mur et défilement horizontal épinglé des étapes.
 * Rien n'est masqué en CSS : sans JavaScript ou avec « réduire les animations », tout reste visible.
 */
export function SiteAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Apparition au scroll
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      // Hero : entrée + parallaxe
      if (document.querySelector(".hero")) {
        gsap.from(".hero-content > *", { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.1 });
        gsap.to(".hero-layer.l1", { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".hero-layer.l2", { yPercent: 26, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      }

      // Ordinateur uniquement : flottement du mur + étapes en défilement horizontal
      mm.add("(min-width: 901px)", () => {
        gsap.utils.toArray<HTMLElement>(".wall-item").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? -14 : 14, duration: 3 + (i % 3), repeat: -1, yoyo: true, ease: "sine.inOut" });
        });

        const track = document.getElementById("pinTrack");
        const section = document.getElementById("etapes");
        const bar = document.getElementById("pinBar");
        if (track && section) {
          const distance = () => track.scrollWidth - window.innerWidth;
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (bar) bar.style.width = `${self.progress * 100}%`;
              },
            },
          });
        }
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
