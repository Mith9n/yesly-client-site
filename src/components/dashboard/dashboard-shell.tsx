"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { BrandLogo } from "@/components/site/brand-logo";
import { initials } from "@/lib/api";
import { PageLoader } from "@/components/ui/skeletons";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAVIGATION: Record<Role, NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: "bar_chart" },
    { href: "/dashboard/vendor/services", label: "My Services", icon: "storefront" },
    { href: "/dashboard/vendor/services/new", label: "Add Service", icon: "add_circle" },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: "event_note" },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: "workspace_premium" },
    { href: "/dashboard/profile", label: "Profile Settings", icon: "manage_accounts" },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: "bar_chart" },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: "event_available" },
    { href: "/dashboard/profile", label: "Profile Settings", icon: "manage_accounts" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "bar_chart" },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: "group" },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: "category" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "receipt_long" },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  vendor: "Vendor Atelier",
  customer: "Couple Account",
  admin: "Platform Curator",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, blockedMessage, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const requiredRole: Role | null = pathname.startsWith("/dashboard/vendor")
    ? "vendor"
    : pathname.startsWith("/dashboard/customer")
      ? "customer"
      : pathname.startsWith("/dashboard/admin")
        ? "admin"
        : null;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pathname === "/dashboard") {
      router.replace(`/dashboard/${user.role}`);
      return;
    }
    if (requiredRole && requiredRole !== user.role) {
      toast.error("That dashboard belongs to another account role");
      router.replace(`/dashboard/${user.role}`);
    }
  }, [loading, user, pathname, requiredRole, router]);

  const closeMobileNav = () => setMobileOpen(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out of Yesly");
    router.push("/");
  };

  if (loading) return <PageLoader label="Verifying your atelier credentials…" />;

  if (blockedMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[40px] text-error">lock</span>
          <h1 className="headline-md mt-3 text-on-surface">Account restricted</h1>
          <p className="body-sm mt-2 text-on-surface-variant">{blockedMessage}</p>
          <button type="button" onClick={handleLogout} className="btn btn-primary btn-sm mt-6">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <PageLoader label="Redirecting to sign in…" />;
  if (requiredRole && requiredRole !== user.role) return <PageLoader label="Redirecting…" />;
  if (pathname === "/dashboard") return <PageLoader label="Opening your dashboard…" />;

  const items = NAVIGATION[user.role];

  const isActive = (href: string) => {
    if (href === "/dashboard/vendor" || href === "/dashboard/customer" || href === "/dashboard/admin") {
      return pathname === href;
    }
    if (href === "/dashboard/vendor/services") {
      return pathname === href;
    }
    if (href === "/dashboard/vendor/services/new") {
      return pathname === href || /^\/dashboard\/vendor\/services\/[^/]+\/edit$/.test(pathname);
    }
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/"
        onClick={closeMobileNav}
        className="flex shrink-0 items-center border-b border-surface-container-high bg-surface-container-low px-6 py-5"
        aria-label="Yesly home"
      >
        <BrandLogo href={null} className="h-9 w-auto" />
      </Link>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="sticky top-0 z-10 overflow-hidden border-b border-[#eee2c2] bg-gradient-to-br from-[#fff8e8] via-surface-container-low to-surface-container-low px-6 py-5">
        <span
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-secondary-fixed/35 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-3">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-[2px] ring-1 ring-secondary/25 shadow-sm">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-secondary-fixed/35">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-[15px] leading-none text-secondary">
                  {initials(user.name)}
                </span>
              )}
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="line-clamp-2 break-words font-display text-[14px] leading-snug text-on-surface"
              title={user.name}
            >
              {user.name}
            </p>
            <p className="label-editorial mt-1 text-[8px] text-secondary">
              {ROLE_LABEL[user.role]}
            </p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between gap-2">
          {user.role === "vendor" ? (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.12em] ${
                user.subscriptionPlan === "premium"
                  ? "border-secondary/30 bg-secondary-fixed text-on-secondary-fixed"
                  : "border-surface-container-high bg-white/70 text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {user.subscriptionPlan === "premium" ? "workspace_premium" : "sell"}
              </span>
              {user.subscriptionPlan === "premium" ? "Premium Atelier" : "Free Atelier"}
            </span>
          ) : (
            <span className="label-editorial text-[8px] text-secondary/75">
              Yesly Registry
            </span>
          )}
          <span className="h-1 w-1 rotate-45 bg-secondary/40" aria-hidden />
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard">
        <div className="flex items-center gap-2 px-3.5 pb-2 pt-1">
          <span className="h-1 w-1 rotate-45 bg-secondary/70" aria-hidden />
          <p className="label-editorial text-[8.5px] text-secondary/80">Workspace</p>
        </div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileNav}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 ${
              isActive(item.href)
                ? "bg-primary text-on-primary shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            {isActive(item.href) && (
              <span
                className="absolute -left-3 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-secondary-fixed"
                aria-hidden
              />
            )}
            <span
              className={`material-symbols-outlined text-[19px] transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-secondary-fixed"
                  : "text-on-surface-variant group-hover:text-secondary"
              }`}
            >
              {item.icon}
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {isActive(item.href) && (
              <span className="h-1 w-1 rotate-45 bg-secondary-fixed" aria-hidden />
            )}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-surface-container-high p-3">
        <Link
          href="/services"
          onClick={closeMobileNav}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] text-on-surface-variant transition-colors hover:bg-secondary-fixed/25 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
        >
          <span className="material-symbols-outlined text-[19px]">travel_explore</span>
          Browse services
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[12.5px] font-medium text-error transition-colors hover:bg-error-container/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
        >
          <span className="material-symbols-outlined text-[19px]">logout</span>
          Logout
        </button>
      </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-surface-container-high bg-surface-container-low lg:block">
        {sidebar}
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-container-high bg-surface/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <BrandLogo className="h-8 w-auto" />
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-lg p-2"
          aria-label="Toggle dashboard navigation"
        >
          <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-primary/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col overflow-hidden bg-surface-container-low shadow-editorial-xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <main className="mx-auto max-w-[1320px] px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
