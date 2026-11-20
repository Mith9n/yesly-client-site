"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { initials } from "@/lib/api";
import type { User } from "@/lib/types";

type MenuLink = { href: string; label: string; icon: string };

const ROLE_LABEL: Record<User["role"], string> = {
  vendor: "Atelier Member",
  customer: "Couple Account",
  admin: "Platform Curator",
};

function linksFor(user: User): MenuLink[] {
  if (user.role === "admin") {
    return [
      { href: "/dashboard/admin", label: "Overview", icon: "bar_chart" },
      { href: "/dashboard/admin/users", label: "Members", icon: "group" },
      { href: "/dashboard/admin/services", label: "Services", icon: "category" },
      { href: "/dashboard/admin/transactions", label: "Transactions", icon: "receipt_long" },
      { href: "/dashboard/profile", label: "Profile Settings", icon: "manage_accounts" },
    ];
  }
  if (user.role === "vendor") {
    return [
      { href: "/dashboard/vendor", label: "Overview", icon: "bar_chart" },
      { href: "/dashboard/vendor/services", label: "My Services", icon: "storefront" },
      { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: "event_note" },
      { href: "/dashboard/vendor/subscription", label: "Subscription", icon: "workspace_premium" },
      { href: "/dashboard/profile", label: "Profile Settings", icon: "manage_accounts" },
    ];
  }
  return [
    { href: "/dashboard/customer", label: "Overview", icon: "bar_chart" },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: "event_available" },
    { href: "/dashboard/profile", label: "Profile Settings", icon: "manage_accounts" },
  ];
}

export function AccountMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!user) return null;

  const links = linksFor(user);
  const isActive = (href: string) =>
    href === "/dashboard/profile"
      ? pathname.startsWith("/dashboard/profile")
      : pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out of Yesly");
      router.push("/");
    } catch {
      toast.error("Could not sign out, please try again");
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-full p-[2px] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 ${
          open
            ? "bg-gradient-to-br from-secondary-fixed via-secondary to-secondary-fixed shadow-[0_0_0_4px_rgba(255,224,136,0.18)]"
            : "bg-secondary-fixed/50 hover:bg-gradient-to-br hover:from-secondary-fixed hover:via-secondary hover:to-secondary-fixed"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-surface-container-lowest ring-1 ring-white/80">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-[13px] leading-none text-secondary">
              {initials(user.name)}
            </span>
          )}
        </span>
        <span
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-secondary-fixed"
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="animate-fade-up absolute right-0 top-[calc(100%+14px)] w-[292px] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl border border-[#e3d3a6]/80 bg-surface-container-lowest shadow-[0_28px_70px_-26px_rgba(24,20,14,0.5),0_3px_12px_rgba(115,92,0,0.08)]"
        >
          <span
            className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
            aria-hidden
          />

          <div className="relative overflow-hidden border-b border-[#eee2c2] bg-gradient-to-br from-[#fff7e5] via-[#fffbf2] to-surface-container-lowest px-5 py-4">
            <span
              className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-secondary-fixed/40 blur-2xl"
              aria-hidden
            />
            <div className="relative flex items-center gap-3">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-[2px] ring-1 ring-secondary/25 shadow-sm">
                <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-secondary-fixed/35">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-[15px] leading-none text-secondary">
                      {initials(user.name)}
                    </span>
                  )}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="line-clamp-2 break-words font-display text-[15px] leading-snug text-on-surface"
                  title={user.name}
                >
                  {user.name}
                </p>
                <p className="mt-1 truncate text-[11px] text-on-surface-variant" title={user.email}>
                  {user.email}
                </p>
              </div>
            </div>
            <div className="relative mt-3 flex flex-wrap items-center gap-2">
              <span className="label-editorial text-[8px] text-secondary">
                {ROLE_LABEL[user.role]}
              </span>
              <span className="h-1 w-1 rotate-45 bg-secondary/40" aria-hidden />
              <span className="label-editorial text-[8px] text-on-surface-variant">
                {user.role === "vendor"
                  ? user.subscriptionPlan === "premium"
                    ? "Premium Atelier"
                    : "Free Atelier"
                  : "Yesly Member"}
              </span>
              {user.businessName && user.role === "vendor" && (
                <>
                  <span className="h-1 w-1 rotate-45 bg-secondary/40" aria-hidden />
                  <span className="max-w-[110px] truncate text-[9.5px] italic text-secondary">
                    {user.businessName}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="px-2.5 py-2.5">
            <p className="label-editorial px-2.5 pb-1.5 pt-1 text-[8.5px] text-secondary/70">
              Your space
            </p>
            <div className="space-y-0.5">
              {links.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[12.5px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 ${
                      active
                        ? "bg-secondary-fixed/35 text-on-surface"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-200 ${
                        active
                          ? "border-secondary/25 bg-white text-secondary"
                          : "border-transparent bg-surface-container-low text-on-surface-variant group-hover:border-secondary/20 group-hover:bg-white group-hover:text-secondary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {link.icon}
                      </span>
                    </span>
                    <span className="flex-1 truncate font-medium">{link.label}</span>
                    {active ? (
                      <span className="h-1.5 w-1.5 rotate-45 bg-secondary" aria-hidden />
                    ) : (
                      <span className="material-symbols-outlined text-[14px] text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        arrow_forward
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-surface-container-high px-2.5 pb-2.5 pt-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-[12.5px] font-medium text-on-surface-variant transition-colors duration-200 hover:bg-error-container/50 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-low transition-colors duration-200 group-hover:bg-white">
                <span className="material-symbols-outlined text-[17px]">logout</span>
              </span>
              Sign out
            </button>
            <p className="label-editorial mt-2 px-2.5 text-center text-[7.5px] text-outline">
              The Yesly Registry · Member access
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
