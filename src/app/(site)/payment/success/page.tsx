import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payments/payment-success";
import { PageLoader } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Payment Success — Yesly",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader label="Verifying your payment…" />}>
      <PaymentSuccess />
    </Suspense>
  );
}
