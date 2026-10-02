import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Rallyo — l’appli", template: "%s · Rallyo" },
};

/**
 * Coque de l'application : plein écran sur mobile,
 * cadre de téléphone sur ordinateur. Aussi utilisée dans la démo de la landing (iframe).
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black text-ink sm:py-4">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-bg sm:h-[900px] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[40px] sm:shadow-[0_0_0_8px_#050505,0_20px_60px_rgba(0,0,0,0.6)]">
        {children}
      </div>
    </div>
  );
}
