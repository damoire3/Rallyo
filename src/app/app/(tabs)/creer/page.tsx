import type { Metadata } from "next";
import { TopBar } from "@/components/ui";
import { CreateView } from "@/components/views/create-view";

export const metadata: Metadata = { title: "Créer" };

export default function CreatePage() {
  return (
    <>
      <TopBar title="Créer" />
      <CreateView />
    </>
  );
}
