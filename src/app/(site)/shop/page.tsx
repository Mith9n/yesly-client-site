import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";

export const metadata: Metadata = {
  title: "The Wedding Shop — Yesly",
  description:
    "Objects, heirlooms and quiet luxuries for the engagement, the wedding day and every anniversary after — curated by the Yesly editors.",
};

export default function ShopRoute() {
  return <ShopPage />;
}
