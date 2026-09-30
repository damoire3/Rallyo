import type { Metadata } from "next";
import { TopBar } from "@/components/ui";
import { TicketsView } from "@/components/views/tickets-view";

export const metadata: Metadata = { title: "Mes billets" };

export default function TicketsPage() {
  return (
    <>
      <TopBar title="Mes billets" />
      <TicketsView />
    </>
  );
}
