import type { Metadata } from "next";
import { VendorDirectory } from "@/components/vendors/vendor-directory";

export const metadata: Metadata = {
  title: "Wedding Vendors & Ateliers — Yesly",
  description:
    "Meet the curator-approved photographers, venues, florists, caterers, stylists and couturiers in the Yesly vendor guild.",
};

export default function VendorsRoute() {
  return <VendorDirectory />;
}
