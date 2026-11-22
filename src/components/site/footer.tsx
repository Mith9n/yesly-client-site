import Link from "next/link";
import { BRAND } from "@/lib/constants";

const FOOTER_LOGO_SRC = "/images/yesly-logo-footer.png";

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

const telHref = `tel:${BRAND.phone.replace(/[^+\d]/g, "")}`;

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (label === "Pinterest") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.7 20.2c.7-1.8 1.1-3.1 1.4-4.8.8.8 2.1 1.4 3.4 1.4 4.1 0 7.1-3.7 7.1-8.1C21.6 4.7 17.9 2 13.1 2 7.2 2 3.8 5.8 3.8 10.1c0 2.8 1.1 5.3 3.4 6.2.2.1.5 0 .6-.3l.5-1.8c.1-.4 0-.5-.3-.9-.5-.6-.9-1.5-.9-2.8 0-3.4 2.6-6.5 6.8-6.5 3.7 0 5.7 2.3 5.7 5.3 0 4-1.8 7.3-4.4 7.3-1.4 0-2.5-1.2-2.1-2.6.4-1.7 1.2-3.5 1.2-4.7 0-1.1-.6-2-1.8-2-1.4 0-2.5 1.5-2.5 3.4 0 1.3.4 2.1.4 2.1l-1.6 6.7c-.5 2-.1 4.4-.1 4.6"
          stroke="currentColor"
          strokeWidth="1.3"
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
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ColumnHeading({ children }: { children: string }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface">
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-surface-container-high bg-surface text-on-surface">
      <div className="container-editorial">
        {/* Concierge line */}
        <div className="flex flex-col gap-4 border-b border-surface-container-high py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow">The concierge</p>
          <a
            href={`mailto:${BRAND.email}`}
            className="group inline-flex w-fit items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface transition-colors duration-300 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
          >
            {BRAND.email}
            <span
              aria-hidden
              className="material-symbols-outlined text-[15px] text-secondary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              arrow_outward
            </span>
          </a>
        </div>

        {/* Directory */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 py-10 sm:gap-x-8 sm:gap-y-10 sm:py-12 md:grid-cols-4 md:gap-x-12 md:py-14">
          {columns.map((column) => (
            <div key={column.title}>
              <ColumnHeading>{column.title}</ColumnHeading>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-quiet text-[12.5px] leading-snug text-on-surface-variant hover:text-on-surface sm:text-[13px]"
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
            <ul className="mt-4 space-y-3 text-[12.5px] leading-snug text-on-surface-variant sm:text-[13px]">
              <li className="break-words">
                <a href={`mailto:${BRAND.email}`} className="link-quiet hover:text-on-surface">
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a href={telHref} className="link-quiet hover:text-on-surface">
                  {BRAND.phone}
                </a>
              </li>
              <li className="break-words">{BRAND.address}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — wordmark · socials · copyright · site credit */}
      <div className="border-t border-surface-container-high bg-surface-container-low">
        <div className="container-editorial flex flex-col items-center gap-0 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:py-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 md:gap-5">
            <Link
              href="/"
              aria-label="Yesly home"
              className="inline-flex items-center leading-none transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-surface-container-low"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FOOTER_LOGO_SRC}
                alt="Yesly"
                width={280}
                height={57}
                className="block h-4 w-auto md:h-[17px]"
              />
            </Link>

            <span aria-hidden className="hidden h-4 w-px bg-outline-variant/50 sm:block" />

            <nav aria-label="Social" className="flex items-center gap-1 sm:gap-0.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-300 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
                >
                  <span className="h-4 w-4">
                    <SocialIcon label={social.label} />
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-5 flex w-full flex-col items-center gap-3 border-t border-outline-variant/40 pt-4 text-[9.5px] uppercase leading-none tracking-[0.13em] text-on-surface-variant/90 sm:mt-0 sm:w-auto sm:flex-row sm:gap-4 sm:border-0 sm:pt-0 sm:text-[10px] sm:tracking-[0.14em]">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <p className="whitespace-nowrap">
                © {year} {BRAND.name}
                <span className="hidden sm:inline"> · All rights reserved</span>
              </p>
              <span aria-hidden className="h-3 w-px bg-outline-variant/60" />
              <a
                href={BRAND.developer.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 whitespace-nowrap transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
              >
                Site by{" "}
                <span className="font-semibold text-secondary transition-colors duration-300 group-hover:text-primary">
                  {BRAND.developer.name}
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
