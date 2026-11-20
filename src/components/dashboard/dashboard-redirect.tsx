"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { PageLoader } from "@/components/ui/skeletons";

export function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/sign-in?redirect=%2Fdashboard");
      return;
    }
    router.replace(`/dashboard/${user.role}`);
  }, [loading, user, router]);

  return <PageLoader label="Opening the correct dashboard…" />;
}
