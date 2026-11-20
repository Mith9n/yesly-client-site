import Link from "next/link";
import { BRAND } from "@/lib/constants";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Wedding Services", href: "/services" },
      { label: "The Wedding Shop", href: "/shop" },
      { label: "Vendor Guild", href: "/vendors" },
    ],
  },
  {
    title: "For Couples",
    links: [
      { label: "Create a Couple Account", href: "/sign-up" },
      { label: "Browse Services", href: "/services" },
      { label: "My Bookings", href: "/dashboard/customer/bookings" },
    ],
  },
  {
    title: "For Vendors",
    links: [
      { label: "Join the Vendor Guild", href: "/sign-up?role=vendor" },
      { label: "Vendor Dashboard", href: "/dashboard/vendor" },
      { label: "Premium Membership", href: "/dashboard/vendor/subscription" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: BRAND.social.instagram },
  { label: "Pinterest", href: BRAND.social.pinterest },
  { label: "Facebook", href: BRAND.social.facebook },
];

function ColumnHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-on-surface-variant/80">
      {children}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-surface-container-high bg-surface text-on-surface">
      <div className="container-editorial">
        <div className="flex flex-col gap-10 border-b border-surface-container-high py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div className="max-w-[36rem]">
            <p className="eyebrow">Concierge</p>
            <h2 className="mt-6 text-balance font-display text-[clamp(2rem,3.6vw,2.9rem)] font-normal leading-[1.08] tracking-[-0.02em] text-primary">
              Extraordinary celebrations,{" "}
              <em className="italic text-secondary">quietly arranged.</em>
            </h2>
            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-on-surface-variant">
              {BRAND.tagline}
            </p>
          </div>

          <a
            href={`mailto:${BRAND.email}`}
            className="group inline-flex w-fit items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
          >
            <span className="border-b border-outline-variant pb-1.5 transition-colors duration-300 group-hover:border-secondary">
              Speak with the concierge
            </span>
            <span
              aria-hidden
              className="material-symbols-outlined text-[17px] text-secondary transition-transform duration-300 group-hover:translate-x-0.5"
            >
              arrow_outward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-4 md:gap-x-14 md:py-16">
          {columns.map((column) => (
            <div key={column.title}>
              <ColumnHeading>{column.title}</ColumnHeading>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-quiet text-[13px] leading-snug text-on-surface-variant hover:text-on-surface"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <ColumnHeading>Atelier</ColumnHeading>
            <ul className="mt-6 space-y-3.5 text-[13px] leading-snug text-on-surface-variant">
              <li>
                <a
                  href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}
                  className="link-quiet text-on-surface-variant hover:text-on-surface"
                >
                  {BRAND.phone}
                </a>
              </li>
              <li>{BRAND.address}</li>
              <li className="pt-1 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant/80">
                By appointment · Worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="-mx-5 flex flex-col gap-6 border-t border-surface-container-high bg-surface px-5 py-6 text-[10px] uppercase tracking-[0.2em] text-on-secondary-fixed-variant md:-mx-12 md:flex-row md:items-center md:justify-between md:px-12">
          <p>© {new Date().getFullYear()} · All rights reserved</p>

          <nav aria-label="Social" className="flex items-center gap-7">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet text-inherit transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
              >
                {social.label}
              </a>
            ))}
          </nav>

          <a
            href={BRAND.developer.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
          >
            Site by{" "}
            <span className="font-medium text-secondary transition-colors duration-300 group-hover:text-primary">
              {BRAND.developer.name}
            </span>
            <span aria-hidden className="material-symbols-outlined text-[12px]">
              north_east
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
