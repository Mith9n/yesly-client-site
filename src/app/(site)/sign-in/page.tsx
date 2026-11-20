import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/auth-panel";
import { PageLoader } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Sign In — Yesly",
  description: "Sign in to your Yesly wedding planning account.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<PageLoader label="Opening the salon…" />}>
      <AuthPanel mode="signin" />
    </Suspense>
  );
}
