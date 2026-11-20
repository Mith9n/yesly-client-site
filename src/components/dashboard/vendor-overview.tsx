"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api, errorMessage, formatDate, formatPrice, initials } from "@/lib/api";
import type { Booking, Service, VendorStats } from "@/lib/types";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader, StatCardSkeleton } from "@/components/ui/skeletons";

export function VendorOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [statsData, bookingData, serviceData] = await Promise.all([
          api<{ stats: VendorStats; subscriptionPlan: string }>(
            "/api/services/vendor/stats",
          ),
          api<{ bookings: Booking[] }>("/api/bookings/vendor"),
          api<{ services: Service[] }>("/api/services/vendor/mine"),
        ]);
        if (cancelled) return;
        setStats(statsData.stats);
        setBookings(bookingData.bookings);
        setServices(serviceData.services);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <StatCardSkeleton count={4} />
        <PageLoader label="Preparing your atelier monograph…" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
        <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
        <p className="headline-sm mt-3">Dashboard unavailable</p>
        <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
        <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
          Retry
        </button>
      </div>
    );
  }

  const pending = bookings.filter((booking) => booking.status === "pending");

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-editorial font-bold text-secondary">Atelier Monograph</span>
            <span className="text-[10px] text-outline-variant">•</span>
            <span className="label-editorial text-[10px] text-outline">
              Vendor Dashboard
            </span>
          </div>
          <h1 className="headline-lg mt-1 text-on-surface">
            {user?.businessName || user?.name || "Your Atelier"}
          </h1>
          <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
            Overview of your published services, booking requests and membership.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/vendor/services/new" className="btn btn-primary">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Publish Service
          </Link>
          <Link href="/dashboard/vendor/subscription" className="btn btn-ghost">
            Manage plan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Services"
          value={stats.totalServices}
          hint={`${stats.approvedServices} approved · ${stats.pendingServices} in review`}
          icon="storefront"
        />
        <StatCard
          label="Active Services"
          value={stats.activeServices}
          hint={
            user?.subscriptionPlan === "premium"
              ? "Unlimited listings on Premium"
              : "Free plan allows 3 active services"
          }
          icon="visibility"
        />
        <StatCard
          label="Pending Requests"
          value={stats.pendingBookings}
          hint="Awaiting your response"
          icon="hourglass_top"
          tone="gold"
        />
        <StatCard
          label="Accepted Bookings"
          value={stats.acceptedBookings}
          hint={`${stats.totalBookings} total requests`}
          icon="celebration"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="headline-sm text-on-surface">Latest Booking Requests</h2>
              <Link
                href="/dashboard/vendor/bookings"
                className="text-[11px] font-semibold text-secondary hover:underline"
              >
                View all
              </Link>
            </div>
            {pending.length === 0 ? (
              <EmptyState
                icon="event_available"
                title="No pending requests"
                description="New booking requests from couples will appear here."
              />
            ) : (
              <div className="space-y-3">
                {pending.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-lg bg-surface-container-lowest p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed/40 text-[11px] font-semibold text-secondary">
                          {initials(booking.customerName)}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold text-on-surface">
                            {booking.customerName}
                          </p>
                          <p className="body-sm text-on-surface-variant">
                            {booking.serviceName}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          calendar_month
                        </span>
                        {formatDate(booking.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          location_on
                        </span>
                        {booking.eventLocation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <div className="rounded-xl bg-surface-container p-5 shadow-editorial">
            <div className="flex items-center justify-between">
              <span className="label-editorial font-bold text-secondary">
                Patron Privileges
              </span>
              <span className="material-symbols-outlined text-[18px] text-secondary">
                workspace_premium
              </span>
            </div>
            <p className="headline-sm mt-3 text-on-surface">
              {user?.subscriptionPlan === "premium" ? "Premium Guild" : "Free Atelier"}
            </p>
            <p className="body-sm mt-1 text-on-surface-variant">
              {user?.subscriptionPlan === "premium"
                ? "Unlimited editorial folios with priority discovery."
                : "Up to 3 active services with core booking management."}
            </p>
            <Link href="/dashboard/vendor/subscription" className="btn btn-primary btn-sm mt-4 w-full">
              {user?.subscriptionPlan === "premium" ? "Review membership" : "Upgrade to Premium"}
            </Link>
          </div>

          <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial">
            <h2 className="headline-sm mb-3 text-on-surface">Catalog Snapshot</h2>
            {services.length === 0 ? (
              <p className="body-sm text-on-surface-variant">
                You have not published a service yet.
              </p>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                      {service.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.images[0]}
                          alt={service.serviceName}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-on-surface">
                        {service.serviceName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {formatPrice(service.price)} · {service.isActive ? "Active" : "Paused"}
                      </p>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/vendor/services"
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:underline"
            >
              Manage services
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
