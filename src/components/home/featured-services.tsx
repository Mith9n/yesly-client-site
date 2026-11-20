"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/api";
import type { Service } from "@/lib/types";
import { ServiceCard } from "@/components/site/service-card";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<{ services: Service[] }>("/api/services/featured", {
          auth: false,
        });
        if (cancelled) return;
        setServices(data.services);
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

  return (
    <section id="featured-services" className="section bg-surface">
      <div className="container-editorial">
        <div className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">The Portfolio</span>
            <h2 className="headline-lg mt-4 text-balance text-primary">
              The houses we return to
            </h2>
            <p className="body-md mt-3 text-on-surface-variant">
              Six studios at the top of their craft, each reviewed by our curation
              team before a single listing is published.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="label-editorial text-[9px] text-outline">
              {services.length} showcases
            </span>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-surface-container-high px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-on-surface transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary"
            >
              View all
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <CardGridSkeleton count={6} />
        ) : error ? (
          <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
            <span className="material-symbols-outlined text-[32px] text-error">cloud_off</span>
            <p className="headline-sm mt-3 text-on-surface">Collections unavailable</p>
            <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
            <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
              Try again
            </button>
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon="diamond"
            title="No curated collections yet"
            description="Approved atelier services will appear here as soon as our curators publish them."
            actionLabel="Browse all services"
            actionHref="/services"
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
