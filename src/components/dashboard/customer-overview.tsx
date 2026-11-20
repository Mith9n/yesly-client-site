"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api, errorMessage, formatDate, initials } from "@/lib/api";
import type { Booking, CustomerStats } from "@/lib/types";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton, StatCardSkeleton } from "@/components/ui/skeletons";

export function CustomerOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [statsData, bookingData] = await Promise.all([
          api<{ stats: CustomerStats }>("/api/bookings/customer/stats"),
          api<{ bookings: Booking[] }>("/api/bookings/mine"),
        ]);
        if (cancelled) return;
        setStats(statsData.stats);
        setBookings(bookingData.bookings);
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
        <RowsSkeleton count={3} />
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="label-editorial font-bold text-secondary">Couple Portal</span>
            <span className="text-[10px] text-outline-variant">•</span>
            <span className="label-editorial text-[10px] text-outline">Dashboard</span>
          </div>
          <h1 className="headline-lg mt-1 text-on-surface">
            Welcome, {user?.name?.split(" ")[0] || "Couple"}
          </h1>
          <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
            Track your booking requests, confirmed ateliers and next steps for your
            celebration.
          </p>
        </div>
        <Link href="/services" className="btn btn-primary">
          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
          Discover Services
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Requests" value={stats.total} hint="All booking requests" icon="event_note" />
        <StatCard
          label="Pending"
          value={stats.pending}
          hint="Awaiting vendor response"
          icon="hourglass_top"
          tone="gold"
        />
        <StatCard
          label="Accepted"
          value={stats.accepted}
          hint="Confirmed by vendors"
          icon="celebration"
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          hint={`${stats.cancelled} cancelled by you`}
          icon="event_busy"
          tone="muted"
        />
      </div>

      <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="headline-sm text-on-surface">Recent Booking Requests</h2>
          <Link
            href="/dashboard/customer/bookings"
            className="text-[11px] font-semibold text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            icon="event_available"
            title="No booking requests yet"
            description="Browse the Yesly directory and send your first booking request to an atelier."
            actionLabel="Browse services"
            actionHref="/services"
          />
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col justify-between gap-3 rounded-lg bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                    {booking.serviceImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[11px] text-secondary">
                        {initials(booking.serviceName)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-on-surface">
                      {booking.serviceName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {booking.vendorName} · {formatDate(booking.eventDate)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
