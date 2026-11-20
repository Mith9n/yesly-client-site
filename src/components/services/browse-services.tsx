"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api, errorMessage, isAbortError } from "@/lib/api";
import type { Service } from "@/lib/types";
import { CATEGORIES, PRICE_SORT_OPTIONS } from "@/lib/constants";
import { ServiceCard } from "@/components/site/service-card";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";

interface ServicesResponse {
  services: Service[];
  total: number;
  page: number;
  pages: number;
}

export function BrowseServices() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const paramString = params.toString();

  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [location, setLocation] = useState(params.get("location") || "");
  const [sort, setSort] = useState(params.get("sort") || "newest");
  const [vendor, setVendor] = useState(params.get("vendor") || "");
  const [vendorLabel, setVendorLabel] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedLocation, setDebouncedLocation] = useState(location);
  const [page, setPage] = useState(Number(params.get("page")) || 1);

  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // The last query string this component itself wrote. External navigations
  // (footer links, the Yesly Index) produce a different value and are applied
  // to the local state instead of being overwritten by the write effect.
  const lastWritten = useRef<string>(paramString);

  useEffect(() => {
    if (paramString === lastWritten.current) return;
    lastWritten.current = paramString;
    const next = new URLSearchParams(paramString);
    setSearch(next.get("search") || "");
    setLocation(next.get("location") || "");
    setCategory(next.get("category") || "All");
    setSort(next.get("sort") || "newest");
    setVendor(next.get("vendor") || "");
    setPage(Number(next.get("page")) || 1);
  }, [paramString]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedLocation(location);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, location]);

  // Keep the address bar shareable: filters survive refresh and back/forward.
  useEffect(() => {
    const query = new URLSearchParams();
    if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());
    if (category !== "All") query.set("category", category);
    if (debouncedLocation.trim()) query.set("location", debouncedLocation.trim());
    if (vendor) query.set("vendor", vendor);
    if (sort !== "newest") query.set("sort", sort);
    if (page > 1) query.set("page", String(page));

    const next = query.toString();
    if (next === paramString) return;
    lastWritten.current = next;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [
    debouncedSearch,
    debouncedLocation,
    category,
    sort,
    page,
    vendor,
    pathname,
    paramString,
    router,
  ]);

  const queryString = useMemo(() => {
    const query = new URLSearchParams();
    if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());
    if (category !== "All") query.set("category", category);
    if (debouncedLocation.trim()) query.set("location", debouncedLocation.trim());
    if (vendor) query.set("vendor", vendor);
    query.set("sort", sort);
    query.set("page", String(page));
    query.set("limit", "9");
    return query.toString();
  }, [debouncedSearch, debouncedLocation, category, sort, page, vendor]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await api<ServicesResponse>(`/api/services?${queryString}`, {
          auth: false,
          signal: controller.signal,
        });
        setData(response);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted || isAbortError(err)) return;
        setError(errorMessage(err));
        setData(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [queryString, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setLocation("");
    setDebouncedLocation("");
    setCategory("All");
    setSort("newest");
    setVendor("");
    setVendorLabel(null);
    setPage(1);
  };

  useEffect(() => {
    if (!vendor) return;
    const controller = new AbortController();
    void (async () => {
      try {
        const data = await api<{ vendor: { name: string } }>(`/api/vendors/${vendor}`, {
          auth: false,
          signal: controller.signal,
        });
        setVendorLabel({ id: vendor, name: data.vendor.name });
      } catch {
        if (!controller.signal.aborted) setVendorLabel(null);
      }
    })();
    return () => controller.abort();
  }, [vendor]);

  return (
    <>
      <section className="relative w-full overflow-hidden border-b border-surface-container-high bg-surface-container-low pb-10 pt-12 md:pt-14">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-secondary-fixed/15 blur-3xl" />
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
            <span className="text-secondary">Directory</span>
          </nav>

          <div className="mt-6 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="eyebrow">The Directory</span>
              <h1 className="display-hero mt-4 max-w-2xl text-balance text-primary">
                Find your wedding team
              </h1>
              <p className="editorial-quote mt-3 max-w-xl text-on-surface-variant">
                Photographers, estates, florists and couturiers — vetted houses,
                arranged by discipline and destination.
              </p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <div className="inline-flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface px-4 py-3">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  verified
                </span>
                <div className="flex flex-col">
                  <span className="label-editorial text-[9px] text-primary">
                    Curator-approved ateliers
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Every listing reviewed by Yesly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-b border-surface-container-high bg-surface">
        <div className="container-editorial py-6">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {["All", ...CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                aria-pressed={category === item}
                className={`chip shrink-0 ${category === item ? "chip-active" : ""}`}
              >
                {item === "All" ? "All collections" : item}
              </button>
            ))}
          </div>

          {vendor && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-secondary/30 bg-secondary-fixed/15 px-4 py-2.5">
              <span className="flex items-center gap-2 text-[11.5px] text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  storefront
                </span>
                Collection of{" "}
                <strong className="font-semibold">
                  {vendorLabel?.id === vendor ? vendorLabel.name : "the selected atelier"}
                </strong>
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/vendors"
                  className="text-[10px] font-medium uppercase tracking-[0.14em] text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  All ateliers
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setVendor("");
                    setVendorLabel(null);
                    setPage(1);
                  }}
                  className="text-outline transition-colors hover:text-on-surface"
                  aria-label="Clear vendor filter"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2 rounded-xl border border-surface-container-high bg-surface p-2 shadow-editorial md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 px-3 py-2.5 transition-colors focus-within:text-on-surface">
              <span className="material-symbols-outlined text-[20px] text-outline">search</span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent text-[13px] text-primary placeholder:text-outline-variant focus-visible:outline-none"
                placeholder="Search by service, vendor or destination…"
                type="search"
                aria-label="Search services"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-outline transition-colors hover:text-on-surface"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[17px]">close</span>
                </button>
              )}
            </div>

            <div className="hidden h-8 w-px bg-surface-container-high md:block" />

            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                location_on
              </span>
              <input
                id="browse-location"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  setPage(1);
                }}
                placeholder="Anywhere"
                aria-label="Filter by destination"
                className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-outline focus-visible:outline-none md:w-36"
              />
            </div>

            <div className="hidden h-8 w-px bg-surface-container-high md:block" />

            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">swap_vert</span>
              <select
                id="browse-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                aria-label="Sort services"
                className="w-full cursor-pointer bg-transparent text-[13px] text-on-surface focus-visible:outline-none md:w-auto"
              >
                {PRICE_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={reload}
              className="btn btn-primary px-6 py-3 text-[11px] uppercase tracking-[0.12em] md:w-auto"
            >
              Search
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-on-surface-variant">
              {loading
                ? "Consulting the Yesly directory…"
                : `${data?.total ?? 0} curated service${data?.total === 1 ? "" : "s"} found`}
            </p>
            <div className="flex items-center gap-4">
              {data && data.pages > 1 && (
                <p className="label-editorial text-[9px] text-outline">
                  Page {data.page} of {data.pages}
                </p>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                Reset filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface py-10 md:py-12">
        <div className="container-editorial">
          {loading ? (
            <CardGridSkeleton count={9} />
          ) : error ? (
            <div className="rounded-xl border border-error-container bg-error-container/40 p-12 text-center">
              <span className="material-symbols-outlined text-[36px] text-error">
                cloud_off
              </span>
              <h2 className="headline-sm mt-3 text-on-surface">Services could not load</h2>
              <p className="body-sm mt-2 text-on-surface-variant">{error}</p>
              <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-6">
                Retry request
              </button>
            </div>
          ) : !data || data.services.length === 0 ? (
            <EmptyState
              icon="search_off"
              title="No services match this curation"
              description="Try widening your destination, choosing another discipline, or clearing your search terms."
              actionLabel="Reset filters"
              onAction={resetFilters}
            />
          ) : (
            <>
              <h2 className="sr-only">Wedding services</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {data.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={data.page <= 1}
                    className="btn btn-ghost btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_back
                    </span>
                    Previous
                  </button>
                  {Array.from({ length: data.pages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPage(index + 1)}
                      aria-current={data.page === index + 1 ? "page" : undefined}
                      aria-label={`Page ${index + 1}`}
                      className={`h-9 w-9 rounded-lg text-xs font-semibold transition-colors ${
                        data.page === index + 1
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(data.pages, current + 1))}
                    disabled={data.page >= data.pages}
                    className="btn btn-ghost btn-sm"
                  >
                    Next
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
