import { Bangers, Permanent_Marker, Space_Grotesk } from "next/font/google";
import { Cursor } from "@/components/site/cursor";
import { SiteAnimations } from "@/components/site/animations";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
import "./site.css";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const bangers = Bangers({ subsets: ["latin"], weight: "400", variable: "--font-bangers", display: "swap" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap" });

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`site ${space.variable} ${bangers.variable} ${marker.variable}`}>
      <div className="grain" aria-hidden />
      <Cursor />
      <SiteAnimations />
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
