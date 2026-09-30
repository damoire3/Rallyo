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
      <body className="bg-black text-ink antialiased">
        <div className="flex min-h-dvh items-center justify-center sm:py-4">
          {/* Sur mobile : plein écran. Sur ordinateur : cadre de téléphone. */}
          <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-bg sm:h-[900px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[40px] sm:shadow-[0_0_0_8px_#050505,0_20px_60px_rgba(0,0,0,0.6)]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
