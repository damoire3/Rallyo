import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Rallyo — Cagnottes & Billetterie", template: "%s · Rallyo" },
  description:
    "Rassemble, célèbre, soutiens : cagnottes en ligne et billetterie d’évènements pour l’Afrique de l’Ouest.",
  applicationName: "Rallyo",
  appleWebApp: { capable: true, title: "Rallyo", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/icon-192.png" },
  openGraph: { siteName: "Rallyo", locale: "fr_FR", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${anton.variable} ${jetbrains.variable}`}>
      <body className="bg-black text-ink antialiased">{children}</body>
    </html>
  );
}
