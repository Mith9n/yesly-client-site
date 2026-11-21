import Link from "next/link";
import Image from "next/image";
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

const phoneHref = `tel:${BRAND.phone.replace(/[^+\d]/g, "")}`;
const mailHref = `mailto:${BRAND.email}`;

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
    <h2 className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface">
      <span aria-hidden className="h-px w-4 bg-secondary/70" />
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full bg-surface text-on-surface">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-secondary/45 to-transparent"
      />

      <div className="container-editorial">
        {/* Concierge invitation */}
        <div className="relative overflow-hidden border-b border-surface-container-high py-14 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-secondary-fixed/20 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">The Yesly Concierge</p>
              <h2 className="mt-6 max-w-[18ch] text-balance font-display text-[clamp(2rem,3.8vw,3rem)] font-normal leading-[1.06] tracking-[-0.02em] text-primary">
                Extraordinary celebrations,{" "}
                <em className="italic text-secondary">quietly arranged.</em>
              </h2>
              <p className="mt-6 max-w-lg text-[13px] leading-relaxed text-on-surface-variant">
                {BRAND.tagline}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden border border-surface-container-high bg-surface-container-low/70 p-6 sm:p-7">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
                />

                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant/75">
                  Private consultation
                </p>

                <a
                  href={mailHref}
                  className="group mt-3 flex items-baseline gap-2 font-display text-[clamp(1.15rem,1.8vw,1.45rem)] leading-tight text-primary"
                >
                  <span className="link-quiet">{BRAND.email}</span>
                  <span
                    aria-hidden
                    className="material-symbols-outlined text-[16px] text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    north_east
                  </span>
                </a>

                <dl className="mt-6 space-y-4 border-t border-surface-container-high pt-5">
                  <div>
                    <dt className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                      Telephone
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={phoneHref}
                        className="link-quiet text-[13px] text-on-surface"
                      >
                        {BRAND.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/70">
                      Atelier
                    </dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
                      {BRAND.address}
                    </dd>
                  </div>
                </dl>

                <a
                  href={`${mailHref}?subject=Consultation%20request`}
                  className="group mt-6 flex w-full items-center justify-between gap-3 border-t border-surface-container-high pt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
                >
                  Request a consultation
                  <span
                    aria-hidden
                    className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1"
                  >
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Brand + directory */}
        <div className="grid gap-12 py-14 md:py-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Yesly home" className="inline-block">
              <Image
                src="/images/yesly-footer-logo.png"
                alt="Yesly"
                width={288}
                height={55}
                sizes="(min-width: 768px) 148px, 132px"
                className="h-auto w-[132px] md:w-[148px]"
              />
            </Link>

            <p className="mt-6 max-w-[16rem] font-display text-[1.05rem] italic leading-relaxed text-on-surface-variant">
              Celebrations, considered.
            </p>

            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant/70">
              San Francisco · Worldwide
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:col-span-8"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <ColumnHeading>{column.title}</ColumnHeading>
                <ul className="mt-5 space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="link-quiet text-[13px] leading-snug text-on-surface-variant transition-colors hover:text-primary"
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
                    href={phoneHref}
                    className="link-quiet transition-colors hover:text-primary"
                  >
                    {BRAND.phone}
                  </a>
                </li>
                <li className="max-w-[15rem]">{BRAND.address}</li>
                <li className="pt-1 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant/70">
                  By appointment · Worldwide
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Colophon */}
        <div className="flex flex-col items-center gap-6 border-t border-surface-container-high py-7 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant md:flex-row md:justify-between md:gap-8">
          <p className="order-2 text-center md:order-1 md:text-left">
            © {year} Yesly. All rights reserved.
          </p>

          <nav
            aria-label="Social"
            className="order-1 flex items-center gap-2.5 md:order-2"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} (opens in a new tab)`}
                title={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container-high/30 text-on-surface-variant transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-surface-container-high/70 hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
              >
                <span className="h-4 w-4">
                  <SocialIcon label={social.label} />
                </span>
              </a>
            ))}
          </nav>

          <a
            href={BRAND.developer.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group order-3 inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
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
