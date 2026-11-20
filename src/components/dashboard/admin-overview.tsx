"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, errorMessage, formatPrice } from "@/lib/api";
import type { AdminStats, Service } from "@/lib/types";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardSkeleton } from "@/components/ui/skeletons";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [statsData, serviceData] = await Promise.all([
          api<{ stats: AdminStats }>("/api/admin/stats"),
          api<{ services: Service[] }>("/api/admin/services?status=pending"),
        ]);
        if (cancelled) return;
        setStats(statsData.stats);
        setPending(serviceData.services);
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
        <StatCardSkeleton count={2} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
        <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
        <p className="headline-sm mt-3">Platform metrics unavailable</p>
        <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
        <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-editorial font-bold text-secondary">Curator Console</span>
            <span className="text-[10px] text-outline-variant">•</span>
            <span className="label-editorial text-[10px] text-outline">Platform Overview</span>
          </div>
          <h1 className="headline-lg mt-1 text-on-surface">Yesly Platform Overview</h1>
          <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
            Monitor the user ecosystem, service moderation queue and premium transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/services" className="btn btn-primary">
            Review Queue
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link href="/dashboard/admin/users" className="btn btn-ghost">
            Manage Users
          </Link>
        </div>
      </div>

      {stats.pendingServices > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-5 shadow-editorial">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[22px]">priority_high</span>
              </span>
              <div>
                <span className="label-editorial text-[9px] font-bold text-secondary">
                  Priority Curation Alert
                </span>
                <h2 className="headline-sm mt-0.5 text-on-surface">
                  {stats.pendingServices} service listing
                  {stats.pendingServices === 1 ? "" : "s"} awaiting approval
                </h2>
                <p className="body-sm mt-1 text-on-surface-variant">
                  Approve or reject listings so couples only see verified ateliers.
                </p>
              </div>
            </div>
            <Link href="/dashboard/admin/services?status=pending" className="btn btn-primary btn-sm">
              Review now
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Registered Users"
          value={stats.totalUsers}
          hint={`${stats.totalVendors} vendors · ${stats.totalCustomers} couples`}
          icon="people_alt"
        />
        <StatCard
          label="Total Services"
          value={stats.totalServices}
          hint={`${stats.pendingServices} pending review`}
          icon="category"
          tone="gold"
        />
        <StatCard
          label="Transactions"
          value={stats.totalTransactions}
          hint={`${stats.premiumTransactions} verified payments`}
          icon="receipt_long"
        />
        <StatCard
          label="Premium Revenue"
          value={formatPrice(stats.revenue)}
          hint="Verified Stripe payments only"
          icon="payments"
          tone="muted"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="headline-sm text-on-surface">Pending Review</h2>
            <Link
              href="/dashboard/admin/services"
              className="text-[11px] font-semibold text-secondary hover:underline"
            >
              Manage all services
            </Link>
          </div>
          {pending.length === 0 ? (
            <EmptyState
              icon="task_alt"
              title="Moderation queue is clear"
              description="Every submitted service has been reviewed."
            />
          ) : (
            <div className="space-y-3">
              {pending.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 rounded-lg bg-surface-container-lowest p-4 shadow-sm"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
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
                    <p className="truncate text-[13px] font-semibold text-on-surface">
                      {service.serviceName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {service.vendor?.name} · {service.category}
                    </p>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 xl:col-span-5">
          {[
            {
              href: "/dashboard/admin/users",
              icon: "group",
              title: "Manage Users",
              copy: "Search, inspect, block and unblock vendors and customers.",
            },
            {
              href: "/dashboard/admin/services",
              icon: "category",
              title: "Manage Services",
              copy: "Approve, reject, pause or remove marketplace listings.",
            },
            {
              href: "/dashboard/admin/transactions",
              icon: "receipt_long",
              title: "Transactions",
              copy: "Read-only record of every verified premium payment.",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 rounded-xl bg-surface-container-low p-5 shadow-editorial transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[22px] text-secondary">
                {item.icon}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-on-surface">{item.title}</p>
                <p className="body-sm mt-1 text-on-surface-variant">{item.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
