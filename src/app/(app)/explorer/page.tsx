import type { Metadata } from "next";
import { TopBar } from "@/components/ui";
import { ExploreView } from "@/components/views/explore-view";

export const metadata: Metadata = { title: "Explorer" };

export default function ExplorePage() {
  return (
    <div className="pb-6">
      <TopBar title="Explorer" />
      <ExploreView />
    </div>
  );
}
