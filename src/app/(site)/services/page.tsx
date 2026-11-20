import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseServices } from "@/components/services/browse-services";
import { CardGridSkeleton } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Browse Wedding Services — Yesly",
  description:
    "Browse vetted wedding photographers, venues, florists, caterers, stylists and couture ateliers on Yesly.",
};

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="container-editorial py-16">
          <CardGridSkeleton count={6} />
        </div>
      }
    >
      <BrowseServices />
    </Suspense>
  );
}
