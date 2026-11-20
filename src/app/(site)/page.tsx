import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { Reveal } from "@/components/motion/reveal";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

const whyYesly = [
  {
    icon: "verified_user",
    title: "Vetted artisans only",
    copy: "Every atelier is reviewed by our curation team before a single listing is published to couples.",
  },
  {
    icon: "payments",
    title: "Transparent pricing",
    copy: "Clear package pricing, no hidden concierge fees and secure Stripe-verified memberships.",
  },
  {
    icon: "history_edu",
    title: "Editorial standards",
    copy: "A marketplace composed like a magazine, so every shortlist feels considered rather than crowded.",
  },
  {
    icon: "support_agent",
    title: "Concierge guidance",
    copy: "Direct conversations with vendors, booking requests and milestone tracking in one private portal.",
  },
];

const steps = [
  {
    number: "01",
    icon: "travel_explore",
    title: "Discover",
    copy: "Search by discipline, destination and price to build a shortlist that matches your vision.",
  },
  {
    number: "02",
    icon: "event_available",
    title: "Request",
    copy: "Send a booking request with your event date, location and a personal note to the vendor.",
  },
  {
    number: "03",
    icon: "handshake",
    title: "Confirm",
    copy: "Vendors accept or decline from their dashboard, and your booking status updates instantly.",
  },
  {
    number: "04",
    icon: "celebration",
    title: "Celebrate",
    copy: "Keep every confirmed artisan, date and detail together in your Yesly couple portal.",
  },
];

const testimonials = [
  {
    quote:
      "Finding Céleste through Yesly made our Big Sur ceremony feel like a spread straight out of Vogue. Every vendor conversation was calm and considered.",
    name: "Sophie & Julian",
    detail: "Big Sur Oceanfront Celebration",
    vendor: "Céleste Fine Art Photography",
    image: {
      src: "/images/couple_03.jpeg",
      alt: "Bride looking up at her partner beside the water at dusk",
      caption: "Dusk by the water",
      crop: "",
    },
  },
  {
    quote:
      "We had one week and a single idea. The florist Yesly found us turned a cliffside sunset into something out of a film.",
    name: "Amara & Rohit",
    detail: "Sunset Cliffside Proposal",
    vendor: "Maison Rose Floral Atelier",
    image: {
      src: "/images/couple_01.jpeg",
      alt: "Couple celebrating their proposal at sunset with red roses",
      caption: "The proposal at sunset",
      crop: "",
    },
  },
  {
    quote:
      "Planning an elopement from abroad felt impossible until Yesly introduced us to vendors who understood quiet, intimate celebrations.",
    name: "Elena & Tomás",
    detail: "Tuscan Meadow Elopement",
    vendor: "Vittore Fine Art Weddings",
    image: {
      src: "/images/couple_02.jpeg",
      alt: "Couple sitting together on the grass as the bride kisses his cheek",
      caption: "On the meadow lawn",
      crop: "",
    },
  },
  {
    quote:
      "From the flowers to the final lantern, our harvest wedding came together without one stressful call. The curation on Yesly is remarkable.",
    name: "Hannah & Noah",
    detail: "Cotswolds Harvest Wedding",
    vendor: "Bramble & Vine Florals",
    image: {
      src: "/images/couple_04.jpeg",
      alt: "Couple embracing in an open field on their engagement afternoon",
      caption: "Engagement afternoon",
      crop: "scale-[1.6]",
    },
  },
];

const vendorBenefits = [
  "Direct connection with verified couples — no algorithmic noise.",
  "Booking requests, dates and status in a single dashboard.",
  "Premium badge and priority placement in discovery.",
  "A curation team that presents your portfolio editorially.",
];

/* Asymmetric mosaic: one hero frame, two tall companions, three wide strips. */
const CATEGORY_SPANS = [
  "lg:col-span-3 lg:row-span-2",
  "lg:col-span-3 lg:row-span-1",
  "lg:col-span-3 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
  "lg:col-span-2 lg:row-span-1",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <FeaturedServices />

      {/* ------------------------------ Disciplines ------------------------------ */}
      <section className="section bg-surface-container-low">
        <div className="container-editorial">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <span className="eyebrow">The Disciplines</span>
                <h2 className="headline-lg mt-4 text-balance text-primary">
                  Six crafts, one wedding
                </h2>
                <p className="body-md mt-3 max-w-xl text-on-surface-variant">
                  Photography, venue, flowers, table, beauty, dress — each discipline
                  kept as its own small collection, never a crowded feed.
                </p>
              </div>
              <Link
                href="/services"
                className="group inline-flex shrink-0 items-center gap-2 whitespace-nowrap pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-opacity duration-300 hover:opacity-60"
              >
                Browse all disciplines
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-6 lg:auto-rows-[220px]">
            {CATEGORIES.map((category, index) => {
              const meta = CATEGORY_META[category];
              return (
                <Reveal
                  key={category}
                  delay={index * 0.05}
                  className={`${CATEGORY_SPANS[index]} min-h-[220px]`}
                >
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-xl bg-primary p-6 transition-shadow duration-500 hover:shadow-editorial-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.image}
                      alt={category}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-primary/5 transition-opacity duration-500 group-hover:from-primary/95" />

                    <div className="relative z-10">
                      <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md">
                        <span className="material-symbols-outlined text-[17px] text-secondary-fixed">
                          {meta.icon}
                        </span>
                      </span>
                      <h3 className="headline-sm text-surface">{category}</h3>
                      <p className="body-sm mt-1 max-w-xs text-surface-variant">
                        {meta.blurb}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-fixed">
                        Explore collection
                        <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------- Why Yesly ------------------------------ */}
      <section className="section bg-surface">
        <div className="container-editorial">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <span className="eyebrow">Why Yesly</span>
                  <h2 className="headline-lg mt-4 text-balance text-primary">
                    An eye, not an algorithm
                  </h2>
                  <p className="body-md mt-4 text-on-surface-variant">
                    Yesly is not an open directory. Every vendor, listing and booking
                    request passes through the same standards our curators apply to a
                    print lookbook.
                  </p>
                  <Link href="/sign-up" className="btn btn-primary mt-8">
                    Create your couple account
                    <span className="material-symbols-outlined text-[17px]">favorite</span>
                  </Link>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-surface-container-high">
                {whyYesly.map((item, index) => (
                  <Reveal key={item.title} delay={index * 0.06}>
                    <div className="group flex gap-5 border-b border-surface-container-high py-7 transition-colors duration-300 hover:bg-surface-container-low/60 sm:gap-7 sm:px-2">
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/25 transition-colors duration-300 group-hover:bg-secondary-fixed/45">
                        <span className="material-symbols-outlined text-[21px] text-secondary">
                          {item.icon}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-3">
                          <h3 className="headline-sm text-primary">{item.title}</h3>
                          <span className="label-editorial text-[9px] text-outline">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="body-sm mt-1.5 max-w-xl text-on-surface-variant">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ How it works ----------------------------- */}
      <section className="section bg-surface-container-low">
        <div className="container-editorial">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <span className="eyebrow eyebrow-center">The Process</span>
              <h2 className="headline-lg mt-4 text-balance text-primary">
                From first look to first dance
              </h2>
              <p className="body-md mt-3 text-on-surface-variant">
                Four quiet steps, and a real person at the end of each one.
              </p>
            </div>
          </Reveal>

          <div className="relative mt-10 md:mt-12">
            <div
              className="pointer-events-none absolute inset-x-0 top-[26px] hidden h-px bg-gradient-to-r from-transparent via-secondary/35 to-transparent md:block"
              aria-hidden
            />
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 0.07}>
                  <div className="group relative">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-surface-container-high bg-surface-container-lowest shadow-editorial transition-all duration-500 group-hover:border-secondary/50 group-hover:shadow-gold">
                        <span className="material-symbols-outlined text-[22px] text-secondary">
                          {step.icon}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="font-display text-[28px] leading-none text-secondary-fixed-dim"
                      >
                        {step.number}
                      </span>
                    </div>
                    <h3 className="headline-sm text-primary">{step.title}</h3>
                    <p className="body-sm mt-2 max-w-xs text-on-surface-variant">
                      {step.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ Testimonials ----------------------------- */}
      <section className="section relative overflow-hidden bg-surface-container-low">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-secondary-fixed/10 blur-[130px]"
        />
        <div className="container-editorial relative">
          {/* Masthead — rubric left, standfirst right, closed by a rule */}
          <Reveal>
            <div className="border-b border-outline-variant/60 pb-10">
              <p className="eyebrow">Client Monograph</p>
              <h2 className="headline-lg mt-4 text-primary">In their words</h2>
              <p className="body-md mt-4 max-w-2xl text-on-surface-variant">
                Four celebrations, told by the couples who lived them — and by
                the ateliers who made them happen.
              </p>
            </div>
          </Reveal>

          {/* Story cards — four-up strip, compact plates + letters, staggered */}
          <div className="mt-2 grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {testimonials.map((testimonial, index) => (
              <Reveal
                key={testimonial.name}
                delay={index * 0.05}
                className={index % 2 === 1 ? "lg:mt-16" : ""}
              >
                <article className="flex flex-col gap-6">
                  {/* Plate — framed photograph with caption bar */}
                  <figure className="group/photo w-full">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-outline-variant/50 bg-surface-container-lowest shadow-editorial transition-shadow duration-500 group-hover/photo:shadow-gold">
                      <div className={`absolute inset-0 ${testimonial.image.crop}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={testimonial.image.src}
                          alt={testimonial.image.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/photo:scale-[1.05]"
                        />
                      </div>
                    </div>
                    <figcaption className="mt-4 flex items-start justify-between gap-3 border-t border-outline-variant/60 pt-3">
                      <span className="label-editorial text-[9px] leading-[1.6] text-outline">
                        {testimonial.image.caption}
                      </span>
                      <span className="shrink-0 whitespace-nowrap font-display text-[12px] text-secondary">
                        {String(index + 1).padStart(2, "0")}
                        <span className="text-on-surface-variant"> / 04</span>
                      </span>
                    </figcaption>
                  </figure>

                  {/* Letter — framed story card: header rule, pull-quote, signed byline */}
                  <div className="group/words relative overflow-hidden rounded-sm border border-outline-variant/50 bg-surface-container-lowest shadow-editorial transition-shadow duration-500 group-hover/words:shadow-gold">
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/45 to-transparent"
                    />

                    {/* Header — story index, rule, destination */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-outline-variant/60 px-5 py-3">
                      <span className="font-display text-[12px] leading-none text-secondary">
                        {String(index + 1).padStart(2, "0")}
                        <span className="text-on-surface-variant"> / 04</span>
                      </span>
                      <span aria-hidden className="h-px min-w-6 flex-1 bg-outline-variant/70" />
                      <span className="label-editorial text-[9px] text-outline">
                        {testimonial.detail}
                      </span>
                    </div>

                    {/* Pull-quote */}
                    <div className="px-5 py-4">
                      <blockquote className="text-pretty font-display text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.55] text-primary">
                        <span aria-hidden className="text-secondary/50">
                          &ldquo;
                        </span>
                        {testimonial.quote}
                        <span aria-hidden className="text-secondary/50">
                          &rdquo;
                        </span>
                      </blockquote>
                    </div>

                    {/* Signed byline */}
                    <div className="flex items-end justify-between gap-3 border-t border-outline-variant/60 px-5 py-3.5">
                      <div>
                        <p className="font-display text-[17px] italic leading-none text-primary">
                          {testimonial.name}
                        </p>
                        <p className="label-editorial mt-2 flex items-center gap-1.5 text-[9.5px] text-secondary">
                          <span className="material-symbols-outlined text-[13px]">
                            verified
                          </span>
                          {testimonial.vendor}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Archive credit — closes the monograph */}
          <Reveal className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/60 pt-7">
              <p className="label-editorial text-[9px] text-outline">
                Plates shared by our couples · Yesly client archive
              </p>
              <p className="label-editorial text-[9px] text-outline">
                04 plates · 04 stories
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Vendor CTA ------------------------------ */}
      <section className="section relative w-full bg-surface">
        <div className="container-editorial">
          <div className="relative overflow-hidden rounded-[28px] border border-secondary/15 bg-surface-container-lowest p-7 shadow-editorial md:p-12 lg:p-14">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/35 to-transparent"
            />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-surface-container-low px-3.5 py-1.5">
                  <span className="material-symbols-outlined text-[13px] text-secondary">
                    star
                  </span>
                  <span className="label-editorial text-[9px] text-secondary">
                    For Wedding Professionals
                  </span>
                </span>
                <h2 className="headline-lg mt-6 text-balance text-primary">
                  A quieter way to be found
                </h2>
                <p className="body-md mt-4 max-w-lg font-light text-on-surface-variant">
                  Publish up to three services on the free plan, or move to Premium for
                  unlimited listings, a premium badge and priority in discovery.
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/sign-up?role=vendor"
                    className="btn btn-primary px-7 py-3.5 text-[13px]"
                  >
                    Join as a vendor
                    <span className="material-symbols-outlined text-[17px]">verified</span>
                  </Link>
                  <span className="body-sm text-on-surface-variant">
                    No commission on booking requests.
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <div className="lg:border-l lg:border-surface-container-high lg:pl-12">
                  <h3 className="label-editorial text-[10px] text-secondary">
                    Why top artisans partner with us
                  </h3>
                  <ul className="mt-5 divide-y divide-surface-container-high">
                    {vendorBenefits.map((item) => (
                      <li key={item} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                        <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-secondary">
                          check_circle
                        </span>
                        <span className="body-sm text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- Final CTA ------------------------------- */}
      <section className="section bg-surface-container-low">
        <div className="container-editorial text-center">
          <Reveal>
            <span className="eyebrow eyebrow-center">The Invitation</span>
            <h2 className="headline-lg mx-auto mt-4 max-w-2xl text-balance text-primary">
              Your shortlist starts here
            </h2>
            <p className="body-md mx-auto mt-4 max-w-lg text-balance text-on-surface-variant">
              Keep the ateliers you love, the dates that matter and every conversation
              in one private portal — then book with confidence.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/sign-up" className="btn btn-primary px-7 py-3.5 text-[13px]">
                Create couple account
                <span className="material-symbols-outlined text-[17px]">favorite</span>
              </Link>
              <Link href="/services" className="btn btn-secondary px-7 py-3.5 text-[13px]">
                Browse wedding services
                <span className="material-symbols-outlined text-[17px]">
                  travel_explore
                </span>
              </Link>
            </div>

            <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center justify-center gap-4 border-t border-surface-container-high pt-8 sm:flex-row sm:gap-10">
              {[
                { icon: "shield", label: "Secure payments" },
                { icon: "verified_user", label: "Hand-selected pros" },
                { icon: "volunteer_activism", label: "No hidden fees" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-secondary">
                    {item.icon}
                  </span>
                  <span className="text-[12px] text-on-surface-variant">{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
