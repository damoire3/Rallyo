import type { Metadata } from "next";
import { AuthView } from "@/components/views/auth-view";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return <AuthView />;
}
