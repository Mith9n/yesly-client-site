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

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (label === "Pinterest") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.7 20.2c.7-1.8 1.1-3.1 1.4-4.8.8.8 2.1 1.4 3.4 1.4 4.1 0 7.1-3.7 7.1-8.1C21.6 4.7 17.9 2 13.1 2 7.2 2 3.8 5.8 3.8 10.1c0 2.8 1.1 5.3 3.4 6.2.2.1.5 0 .6-.3l.5-1.8c.1-.4 0-.5-.3-.9-.5-.6-.9-1.5-.9-2.8 0-3.4 2.6-6.5 6.8-6.5 3.7 0 5.7 2.3 5.7 5.3 0 4-1.8 7.3-4.4 7.3-1.4 0-2.5-1.2-2.1-2.6.4-1.7 1.2-3.5 1.2-4.7 0-1.1-.6-2-1.8-2-1.4 0-2.5 1.5-2.5 3.4 0 1.3.4 2.1.4 2.1l-1.6 6.7c-.5 2-.1 4.4-.1 4.6"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.2 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H8.1V13h2.7v8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        <div className="flex flex-col items-center gap-8 border-b border-surface-container-high py-12 text-center sm:py-14 md:flex-row md:items-end md:justify-between md:py-20 md:text-left">
          <div className="max-w-[36rem]">
            <p className="eyebrow">Concierge</p>
            <h2 className="mt-6 text-balance font-display text-[clamp(2rem,3.6vw,2.9rem)] font-normal leading-[1.08] tracking-[-0.02em] text-primary">
              Extraordinary celebrations,{" "}
              <em className="italic text-secondary">quietly arranged.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[13px] leading-relaxed text-on-surface-variant md:mx-0">
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

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 py-12 text-left sm:gap-x-8 md:grid-cols-4 md:gap-x-14 md:py-16">
          {columns.map((column) => (
            <div key={column.title}>
              <ColumnHeading>{column.title}</ColumnHeading>
              <ul className="mt-5 space-y-3.5">
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
            <ul className="mt-5 space-y-3.5 text-[13px] leading-snug text-on-surface-variant">
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

        <div className="-mx-5 flex flex-col items-center gap-5 border-t border-surface-container-high bg-surface px-5 py-7 text-center text-[10px] uppercase tracking-[0.2em] text-on-surface-variant md:-mx-12 md:flex-row md:flex-wrap md:justify-between md:px-12 md:text-left">
          <nav aria-label="Social" className="flex items-center justify-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-high/35 text-on-surface-variant shadow-[0_6px_18px_-12px_rgba(27,28,26,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:bg-surface-container-high/70 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
              >
                <span className="h-[18px] w-[18px]">
                  <SocialIcon label={social.label} />
                </span>
                <span className="sr-only">{social.label}</span>
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

          <p className="border-t border-surface-container-high pt-5 text-[9px] md:w-full md:text-center">
            © {new Date().getFullYear()} · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
