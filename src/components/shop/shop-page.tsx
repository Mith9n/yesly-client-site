"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/api";
import {
  SHOP_BRANDS,
  SHOP_CATEGORIES,
  SHOP_EVENTS,
  SHOP_HERO_QUICK_PICKS,
  SHOP_PRODUCTS,
} from "@/lib/shop-data";

const ALL = "All";

function EnquireLink({ subject }: { subject: string }) {
  const href = `mailto:concierge@yesly.com?subject=${encodeURIComponent(
    `Shop enquiry — ${subject}`,
  )}`;
  return (
    <a
      href={href}
      className="group/enquire inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant transition-colors duration-300 hover:text-secondary"
    >
      Enquire
      <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover/enquire:translate-x-0.5">
        arrow_outward
      </span>
    </a>
  );
}

export function ShopPage() {
  const [category, setCategory] = useState<string>(ALL);
  const [event, setEvent] = useState<string>(ALL);
  const collectionRef = useRef<HTMLElement | null>(null);

  const products = useMemo(
    () =>
      SHOP_PRODUCTS.filter(
        (product) =>
          (category === ALL || product.category === category) &&
          (event === ALL || product.events.includes(event)),
      ),
    [category, event],
  );

  const focusCollection = () => {
    collectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const chooseCategory = (name: string) => {
    setCategory(name);
    focusCollection();
  };

  const reset = () => {
    setCategory(ALL);
    setEvent(ALL);
  };

  return (
    <>
      {/* --------------------------------- Hero --------------------------------- */}
      <section className="relative w-full overflow-hidden border-b border-surface-container-high bg-surface-container-low">
        <div className="pointer-events-none absolute -right-40 -top-44 h-[440px] w-[440px] rounded-full bg-secondary-fixed/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-tertiary-fixed/30 blur-3xl" />

        <div className="container-editorial relative z-10 pb-10 pt-12 md:pb-14 md:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant"
          >
            <Link href="/" className="transition-colors hover:text-on-surface">
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-secondary">The Shop</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">The Wedding Shop</span>
              <h1 className="display-hero mt-4 max-w-xl text-balance text-primary">
                The Wedding Shop
              </h1>
              <p className="editorial-quote mt-4 max-w-xl text-on-surface-variant">
                Objects, heirlooms and quiet luxuries chosen by our editors — for the
                engagement, the day itself and every anniversary after.
              </p>
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <div className="grid w-full grid-cols-3 divide-x divide-surface-container-high rounded-xl border border-surface-container-high bg-surface sm:w-[380px]">
                {[
                  { value: `${SHOP_PRODUCTS.length}`, label: "Pieces curated" },
                  { value: `${SHOP_CATEGORIES.length}`, label: "Categories" },
                  { value: "24h", label: "Concierge reply" },
                ].map((item) => (
                  <div key={item.label} className="px-4 py-4">
                    <span className="block font-display text-[24px] leading-none text-primary">
                      {item.value}
                    </span>
                    <span className="label-editorial mt-2 block text-[8px] text-on-surface-variant">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-surface-container-high pt-6 sm:flex-row sm:items-center">
            <span className="label-editorial shrink-0 text-[9px] text-outline">
              Most loved
            </span>
            <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5">
              {SHOP_HERO_QUICK_PICKS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => chooseCategory(item)}
                  aria-pressed={category === item}
                  className={`chip shrink-0 ${category === item ? "chip-active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- Popular categories ------------------------- */}
      <section className="section bg-surface">
        <div className="container-editorial">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">Browse the shop</span>
              <h2 className="headline-lg mt-4 text-balance text-primary">
                Popular categories
              </h2>
            </div>
            <p className="body-md max-w-sm text-on-surface-variant md:text-right">
              Eight houses of craft, from the gown to the final letterpress
              thank-you.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SHOP_CATEGORIES.map((item) => {
              const active = category === item.name;
              return (
                <div
                  key={item.name}
                  className={`group relative isolate aspect-[4/5] overflow-hidden rounded-xl text-left ring-1 transition-shadow duration-500 ${
                    active
                      ? "ring-2 ring-secondary shadow-editorial-lg"
                      : "ring-primary/5 hover:shadow-editorial-lg"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/92 via-primary/35 to-primary/5 transition-opacity duration-500 group-hover:from-primary/96" />

                  <div className="pointer-events-none flex h-full flex-col justify-end p-5">
                    <h3 className="headline-sm text-surface">{item.name}</h3>
                    <p className="body-sm mt-1.5 max-w-[15rem] text-surface-variant/90">
                      {item.blurb}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-secondary-fixed">
                      Shop the edit
                      <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => chooseCategory(item.name)}
                    aria-pressed={active}
                    aria-label={`Shop ${item.name}`}
                    className="absolute inset-0 z-10 rounded-xl"
                  />

                  {active && (
                    <span className="pointer-events-none absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ Shop by event --------------------------- */}
      <section className="relative w-full overflow-hidden bg-primary py-14 text-on-primary md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-secondary-fixed)_1px,transparent_1px)] opacity-[0.07] [background-size:26px_26px]" />
        <div className="container-editorial relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-lg">
              <span className="eyebrow text-secondary-fixed">The Occasion</span>
              <h2 className="headline-lg mt-4 text-balance text-surface">
                Shop by event
              </h2>
              <p className="body-sm mt-3 max-w-md font-light leading-relaxed text-surface-variant">
                From the engagement toast to the last dance of the anniversary — pieces
                chosen for each moment of the celebration.
              </p>
            </div>
            <p className="label-editorial text-[9px] text-surface-variant">
              {products.length} of {SHOP_PRODUCTS.length} pieces
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[ALL, ...SHOP_EVENTS].map((item) => {
              const active = event === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setEvent(item);
                    focusCollection();
                  }}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-[11.5px] font-medium transition-all duration-300 ${
                    active
                      ? "border-secondary-fixed bg-secondary-fixed text-on-secondary-fixed"
                      : "border-white/20 text-surface-variant hover:border-secondary-fixed/60 hover:text-surface"
                  }`}
                >
                  {item === ALL ? "All events" : item}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ Brands we love -------------------------- */}
      <section className="section-tight bg-surface">
        <div className="container-editorial">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">The Houses</span>
              <h2 className="headline-lg mt-4 text-balance text-primary">
                Brands we love
              </h2>
            </div>
            <Link
              href="/vendors"
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-surface-container-high px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-on-surface transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary md:self-auto"
            >
              Meet the ateliers
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SHOP_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="group flex items-start gap-4 rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-editorial"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-secondary/25 bg-secondary-fixed/20 font-display text-[15px] tracking-wide text-secondary">
                  {brand.monogram}
                </span>
                <div className="min-w-0">
                  <p className="label-editorial text-[8.5px] text-secondary">
                    {brand.discipline}
                  </p>
                  <h3 className="mt-1.5 text-[15px] font-semibold text-primary">
                    {brand.name}
                  </h3>
                  <p className="body-sm mt-1.5 text-on-surface-variant">{brand.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Shop everything ------------------------- */}
      <section
        id="shop-everything"
        ref={collectionRef}
        className="section scroll-mt-24 bg-surface-container-low"
      >
        <div className="container-editorial">
          <div className="flex flex-col gap-5 border-b border-surface-container-high pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">The Collection</span>
              <h2 className="headline-lg mt-4 text-balance text-primary">
                Shop everything
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {category !== ALL && (
                <button
                  type="button"
                  onClick={() => setCategory(ALL)}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-container-high bg-surface px-3.5 py-1.5 text-[11px] text-on-surface transition-colors hover:border-secondary/50"
                >
                  {category}
                  <span className="material-symbols-outlined text-[14px] text-outline">
                    close
                  </span>
                </button>
              )}
              {event !== ALL && (
                <button
                  type="button"
                  onClick={() => setEvent(ALL)}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-container-high bg-surface px-3.5 py-1.5 text-[11px] text-on-surface transition-colors hover:border-secondary/50"
                >
                  {event}
                  <span className="material-symbols-outlined text-[14px] text-outline">
                    close
                  </span>
                </button>
              )}
              <span className="text-[11.5px] text-on-surface-variant">
                {products.length} piece{products.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-surface-container-high bg-surface/60 px-6 py-16 text-center">
              <span className="material-symbols-outlined text-[30px] text-secondary">
                auto_awesome
              </span>
              <h3 className="headline-sm mt-4 text-primary">
                Nothing in this pairing yet
              </h3>
              <p className="body-sm mt-2 max-w-sm text-balance text-on-surface-variant">
                Our editors refresh the shop each week. Try another event, or clear your
                filters to see the full collection.
              </p>
              <button type="button" onClick={reset} className="btn btn-primary btn-sm mt-6">
                View the full collection
              </button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-high ring-1 ring-primary/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label-editorial text-[8.5px] text-secondary">
                        {product.brand}
                      </p>
                      <h3 className="mt-1.5 text-[14px] font-medium leading-snug text-primary">
                        {product.name}
                      </h3>
                    </div>
                    <p className="shrink-0 font-display text-[15px] leading-tight text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <p className="body-sm mt-1.5 line-clamp-2 text-on-surface-variant">
                    {product.note}
                  </p>

                  <div className="mt-3">
                    <EnquireLink subject={product.name} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------- Concierge ----------------------------- */}
      <section className="border-t border-surface-container-high bg-surface">
        <div className="container-editorial grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-6">
            <span className="eyebrow">The Concierge</span>
            <h2 className="headline-lg mt-4 max-w-md text-balance text-primary">
              Looking for something not on the shelf?
            </h2>
          </div>
          <div className="md:col-span-6 md:justify-self-end">
            <p className="body-md max-w-md text-on-surface-variant">
              Our editors source gowns, stationery and honeymoon suites on request.
              Write to the concierge with your date, palette and budget — we reply
              within a day.
            </p>
            <a
              href="mailto:concierge@yesly.com?subject=Shop%20sourcing%20request"
              className="btn btn-primary mt-6 px-6 py-3 text-[12px]"
            >
              Write to the concierge
              <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
