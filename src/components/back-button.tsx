"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./icon";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Retour"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/app"))}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-card"
    >
      <Icon name="arrowLeft" size={17} color="#F5F4F8" />
    </button>
  );
}
