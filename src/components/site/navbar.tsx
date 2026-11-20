"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountMenu } from "@/components/site/account-menu";
import { BrandLogo } from "@/components/site/brand-logo";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/vendors", label: "Vendors" },
  { href: "/shop", label: "Shop" },
];

const desktopLinkBase =
  "group relative whitespace-nowrap py-2 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300";

const mobileLinkBase =
  "rounded-lg px-3 py-3 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const dashboardHref = user ? `/dashboard/${user.role}` : "/dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out of Yesly");
      router.push("/");
    } catch {
      toast.error("Could not sign out, please try again");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (active: boolean) =>
    `${desktopLinkBase} ${
      active
        ? "font-semibold text-on-surface"
        : "font-medium text-on-surface-variant hover:text-on-surface"
    }`;

  const underlineClass = (active: boolean) =>
    `pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-300 ease-out ${
      active
        ? "scale-x-100 opacity-100"
        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70"
    }`;

  const mobileLinkClass = (active: boolean) =>
    `${mobileLinkBase} ${
      active
        ? "bg-surface-container-low font-semibold text-on-surface"
        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled
          ? "border-surface-container-high bg-surface/90 shadow-[0_12px_32px_-20px_rgba(27,28,26,0.45)]"
          : "border-transparent bg-surface/70"
      }`}
    >
      <div className="container-editorial grid h-[72px] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
        <BrandLogo className="h-8 w-auto shrink-0 justify-self-start" />

        <nav
          className="hidden items-center justify-center gap-7 md:flex lg:gap-9"
          aria-label="Primary"
        >
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(active)}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                <span className={underlineClass(active)} aria-hidden />
              </Link>
            );
          })}
          {user && (
            <Link
              href={dashboardHref}
              className={linkClass(pathname.startsWith("/dashboard"))}
              aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
            >
              Dashboard
              <span
                className={underlineClass(pathname.startsWith("/dashboard"))}
                aria-hidden
              />
            </Link>
          )}
        </nav>

        <div className="flex items-center justify-end gap-3">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-surface-container-high" />
          ) : user ? (
            <AccountMenu />
          ) : (
            <div className="hidden items-center gap-6 sm:flex">
              <Link
                href="/sign-in"
                className="group relative py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-on-surface-variant transition-colors duration-300 hover:text-on-surface"
              >
                Sign In
                <span
                  className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-secondary/60 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-primary shadow-[0_1px_2px_rgba(27,28,26,0.18)] transition-all duration-300 hover:-translate-y-px hover:bg-[#232323] hover:shadow-[0_10px_22px_-12px_rgba(27,28,26,0.65)]"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className="-mr-1 flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition-all duration-200 hover:bg-surface-container-low active:scale-95 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-drawer border-t border-surface-container-high bg-surface/95 backdrop-blur-xl md:hidden">
          <div className="container-editorial max-h-[calc(100vh-4.5rem)] overflow-y-auto py-4">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass(isActive(link.href))}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass(pathname.startsWith("/dashboard"))}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass(pathname.startsWith("/dashboard/profile"))}
                  >
                    Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${mobileLinkBase} text-left text-on-surface-variant hover:bg-error-container/40 hover:text-error`}
                  >
                    Sign out
                  </button>
                </>
              )}
            </nav>

            {!user && !loading && (
              <div className="mt-4 flex flex-col gap-2 border-t border-surface-container-high pt-4">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-surface-container-high px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-on-surface transition-colors duration-200 hover:bg-surface-container-low"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-primary px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-on-primary transition-all duration-200 hover:bg-[#232323] active:scale-[0.99]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
