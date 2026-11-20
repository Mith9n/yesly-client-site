"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { api, errorMessage, initials } from "@/lib/api";
import { MOSAIC_LAYOUTS, mosaicImages } from "@/lib/mosaic";
import type { Vendor } from "@/lib/types";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";

interface VendorsResponse {
  vendors: Vendor[];
  total: number;
}

const DISCIPLINE_LABELS: Record<string, string> = {
  "Photography & Videography": "Photo & Film",
  "Wedding Venues": "Venues",
  "Decoration & Florist": "Florals",
  "Catering Services": "Catering",
  "Makeup & Styling": "Beauty",
  "Wedding Fashion": "Fashion",
};

function VendorTile({
  vendor,
  featured = false,
}: {
  vendor: Vendor;
  featured?: boolean;
}) {
  const gallery = mosaicImages(
    vendor.images?.length ? vendor.images : [vendor.image],
  );
  const layout = MOSAIC_LAYOUTS[Math.min(gallery.length, 4)] || MOSAIC_LAYOUTS[1];
  const categoryLine = vendor.categories.length
    ? vendor.categories.slice(0, 2).join(" · ")
    : "Wedding Atelier";

  return (
    <li className="flex h-full flex-col">
      <Link
        href={`/services?vendor=${vendor.id}`}
        className="group relative flex h-full flex-col rounded-xl p-2.5 transition-colors duration-300 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 md:p-3"
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container-high">
          {gallery.length ? (
            <>
              <div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-[2px]">
                {gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`relative overflow-hidden bg-surface-container ${layout[index]}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={index === 0 ? `${vendor.name} portfolio` : ""}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f3efe8,#e7e0d4)]">
              <span className="font-display text-[38px] leading-none text-secondary/70">
                {initials(vendor.name)}
              </span>
            </div>
          )}

          {vendor.premium && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-on-primary">
              <span className="material-symbols-outlined text-[11px]">
                workspace_premium
              </span>
              {featured ? "Yesly List 2026" : "Premium"}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-3">
          <p className="flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
            <span className="truncate">
              {categoryLine}
              {vendor.categories.length > 2 && (
                <span className="text-outline"> +{vendor.categories.length - 2}</span>
              )}
            </span>
            <span
              className="material-symbols-outlined shrink-0 text-[14px] text-secondary"
              title="Curator-approved"
            >
              verified
            </span>
          </p>

          <h3 className="mt-1.5 line-clamp-2 font-display text-[18px] leading-tight text-primary transition-colors duration-300 group-hover:text-secondary">
            {vendor.name}
          </h3>

          <p className="mt-1 truncate text-[12px] font-semibold text-on-surface-variant">
            {vendor.locations[0] || "By appointment"}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-surface-container-high/70 pt-2.5 mt-3">
            <span className="text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">
              {vendor.serviceCount} service{vendor.serviceCount === 1 ? "" : "s"}
            </span>
            <span className="material-symbols-outlined text-[15px] text-outline transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary">
              arrow_outward
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function VendorDirectory() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const directoryRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<VendorsResponse>("/api/vendors", { auth: false });
        if (cancelled) return;
        setVendors(data.vendors);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const featured = useMemo(
    () => vendors.filter((vendor) => vendor.premium),
    [vendors],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vendors.filter((vendor) => {
      const matchesCategory =
        category === "All" || vendor.categories.includes(category);
      if (!matchesCategory) return false;
      if (!term) return true;
      return (
        vendor.name.toLowerCase().includes(term) ||
        (vendor.contactName || "").toLowerCase().includes(term) ||
        vendor.categories.some((item) => item.toLowerCase().includes(term)) ||
        vendor.locations.some((item) => item.toLowerCase().includes(term))
      );
    });
  }, [vendors, search, category]);

  const reset = () => {
    setSearch("");
    setCategory("All");
  };

  const scrollToDirectory = () => {
    directoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chooseCategory = (discipline: string) => {
    setCategory((current) => (current === discipline ? "All" : discipline));
    scrollToDirectory();
  };

  const filtersActive = Boolean(search.trim()) || category !== "All";

  return (
    <>
      {/* --------------------------------- Hero --------------------------------- */}
      <section className="relative w-full overflow-hidden border-b border-surface-container-high bg-surface-container-low pb-10 pt-12 md:pb-14 md:pt-14">
        <div className="pointer-events-none absolute -right-36 -top-40 h-[420px] w-[420px] rounded-full bg-secondary-fixed/18 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-tertiary-fixed/25 blur-3xl" />

        <div className="container-editorial relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant"
          >
            <Link href="/" className="transition-colors hover:text-on-surface">
              Home
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-secondary">Ateliers</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">The Guild Register</span>
              <h1 className="display-hero mt-4 max-w-2xl text-balance text-primary">
                Meet the ateliers
              </h1>
              <p className="editorial-quote mt-4 max-w-xl text-on-surface-variant">
                Photographers, venues, florists and couturiers — every house here has
                been reviewed by our curation team before a single listing was
                published.
              </p>
            </div>

            <div className="lg:col-span-5 lg:justify-self-end">
              <div className="rounded-xl border border-surface-container-high bg-surface p-5 sm:w-[340px]">
                <span className="label-editorial text-[9px] text-on-surface-variant">
                  The standard
                </span>
                <p className="body-sm mt-3 text-on-surface-variant">
                  We review craft, insurance, response times and past celebrations.
                  Fewer than one in five applicants join the guild.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-container-high pt-3">
                  <div>
                    <span className="block font-display text-[22px] leading-none text-primary">
                      {loading ? "—" : vendors.length}
                    </span>
                    <span className="label-editorial mt-1.5 block text-[9px] text-on-surface-variant">
                      Houses
                    </span>
                  </div>
                  <div>
                    <span className="block font-display text-[22px] leading-none text-primary">
                      {String(CATEGORIES.length).padStart(2, "0")}
                    </span>
                    <span className="label-editorial mt-1.5 block text-[9px] text-on-surface-variant">
                      Disciplines
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-surface-container-high pt-3">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    verified_user
                  </span>
                  <span className="text-[11px] font-medium text-primary">
                    Curator-approved ateliers only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- Category rail ----------------------------- */}
      <section className="border-b border-surface-container-high bg-surface">
        <div className="container-editorial py-6 md:py-7">
          <div className="no-scrollbar flex items-start gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-6 md:gap-2 md:overflow-visible">
            {CATEGORIES.map((discipline) => {
              const meta = CATEGORY_META[discipline];
              const active = category === discipline;
              return (
                <button
                  key={discipline}
                  type="button"
                  onClick={() => chooseCategory(discipline)}
                  aria-pressed={active}
                  className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-2 rounded-lg text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 md:w-auto"
                >
                  <span
                    className={`relative h-16 w-16 overflow-hidden rounded-full bg-surface-container-high ring-1 transition-all duration-300 ${
                      active
                        ? "ring-2 ring-secondary ring-offset-2 ring-offset-surface"
                        : "ring-primary/10 group-hover:ring-secondary/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {active && (
                      <span className="pointer-events-none absolute inset-0 bg-primary/20" />
                    )}
                  </span>
                  <span
                    className={`text-[9.5px] font-semibold uppercase leading-tight tracking-[0.12em] transition-colors duration-300 ${
                      active
                        ? "text-secondary"
                        : "text-on-surface-variant group-hover:text-on-surface"
                    }`}
                  >
                    {DISCIPLINE_LABELS[discipline] || discipline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------ Yesly List ------------------------------- */}
      {featured.length > 0 && (
        <section className="section-tight bg-surface">
          <div className="container-editorial">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-surface-container-high pb-4">
              <div>
                <span className="eyebrow">The Yesly List 2026</span>
                <h2 className="headline-lg mt-2 text-balance text-primary">
                  The houses we return to
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  reset();
                  scrollToDirectory();
                }}
                className="group inline-flex items-center gap-3 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-primary transition-opacity duration-300 hover:opacity-60"
              >
                View all
                <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {featured.map((vendor) => (
                <VendorTile key={vendor.id} vendor={vendor} featured />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ------------------------------- Directory ------------------------------- */}
      <section
        id="vendor-directory"
        ref={directoryRef}
        className="section scroll-mt-24 bg-surface-container-low"
      >
        <div className="container-editorial">
          <div className="flex flex-col gap-5 border-b border-surface-container-high pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">
                {category === "All" ? "The Directory" : "The Discipline"}
              </span>
              <h2 className="headline-lg mt-2 text-balance text-primary">
                {category === "All" ? "All ateliers" : category}
              </h2>
              <p className="body-sm mt-2 text-on-surface-variant">
                {loading
                  ? "Consulting the register…"
                  : `${visible.length} ${
                      visible.length === 1 ? "house" : "houses"
                    } across ${CATEGORIES.length} disciplines.`}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <div className="flex w-full items-center gap-2 rounded-full border border-surface-container-high bg-surface px-4 py-2.5 shadow-editorial focus-within:ring-1 focus-within:ring-secondary/50 sm:w-[320px]">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full min-w-0 bg-transparent text-[12.5px] text-primary placeholder:text-outline-variant focus-visible:outline-none"
                  placeholder="Search by house, discipline or destination…"
                  type="search"
                  aria-label="Search vendors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="shrink-0 rounded-full p-0.5 text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
                    aria-label="Clear search"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                )}
              </div>

              {filtersActive && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    restart_alt
                  </span>
                  Reset
                </button>
              )}
            </div>
          </div>

          {category !== "All" && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary-fixed/15 px-3.5 py-1.5 text-[10.5px] font-medium text-on-surface transition-colors hover:border-secondary/60"
              >
                {DISCIPLINE_LABELS[category] || category}
                <span className="material-symbols-outlined text-[14px] text-outline">
                  close
                </span>
              </button>
            </div>
          )}

          {loading ? (
            <ul className="mt-6 grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <li key={index} className="animate-pulse">
                  <div className="aspect-square w-full rounded-lg bg-surface-container-high" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2.5 w-1/2 rounded bg-surface-container-high" />
                    <div className="h-4 w-3/4 rounded bg-surface-container-high" />
                    <div className="h-2.5 w-1/3 rounded bg-surface-container-high" />
                  </div>
                </li>
              ))}
            </ul>
          ) : error ? (
            <div className="mt-8 rounded-xl border border-error-container bg-error-container/40 p-12 text-center">
              <span className="material-symbols-outlined text-[36px] text-error">
                cloud_off
              </span>
              <h3 className="headline-sm mt-3 text-on-surface">
                The guild register could not load
              </h3>
              <p className="body-sm mt-2 text-on-surface-variant">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="btn btn-primary btn-sm mt-6"
              >
                Retry request
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-surface-container-high bg-surface/60 px-6 py-16 text-center">
              <span className="material-symbols-outlined text-[30px] text-secondary">
                storefront
              </span>
              <h3 className="headline-sm mt-4 text-on-surface">
                No ateliers found
              </h3>
              <p className="body-sm mt-2 max-w-sm text-balance text-on-surface-variant">
                Try a different discipline or destination — or clear your search to
                see the whole register.
              </p>
              <button
                type="button"
                onClick={reset}
                className="btn btn-primary btn-sm mt-6"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {visible.map((vendor) => (
                <VendorTile key={vendor.id} vendor={vendor} />
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ------------------------------- Join CTA -------------------------------- */}
      <section className="border-t border-surface-container-high bg-surface">
        <div className="container-editorial grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <span className="eyebrow">For Wedding Professionals</span>
            <h2 className="headline-lg mt-4 max-w-lg text-balance text-primary">
              Apply to the register
            </h2>
            <p className="body-md mt-3 max-w-lg text-on-surface-variant">
              Publish your portfolio to couples who are already planning, with no
              commission on booking requests.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-self-end">
            <Link href="/sign-up?role=vendor" className="btn btn-primary px-6 py-3 text-[12px]">
              Apply as a vendor
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link href="/services" className="btn btn-secondary px-6 py-3 text-[12px]">
              Browse services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
