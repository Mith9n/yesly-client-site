import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/auth-panel";
import { PageLoader } from "@/components/ui/skeletons";

export const metadata: Metadata = {
  title: "Create an Account — Yesly",
  description:
    "Register as a couple or a wedding vendor on the Yesly wedding planning platform.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<PageLoader label="Opening the salon…" />}>
      <AuthPanel mode="signup" />
    </Suspense>
  );
}
