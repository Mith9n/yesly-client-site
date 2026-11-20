"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, formatDate, initials } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

export function VendorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingReject, setPendingReject] = useState<Booking | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<{ bookings: Booking[] }>("/api/bookings/vendor");
        if (cancelled) return;
        setBookings(data.bookings);
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

  const filtered = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter],
  );

  const act = async (booking: Booking, status: "accepted" | "rejected") => {
    setBusyId(booking.id);
    try {
      const data = await api<{ booking: Booking; message: string }>(
        `/api/bookings/${booking.id}/status`,
        { method: "PATCH", body: { status } },
      );
      setBookings((current) =>
        current.map((item) => (item.id === booking.id ? data.booking : item)),
      );
      setPendingReject(null);
      toast.success(status === "accepted" ? "Booking accepted" : "Booking rejected");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">Inquiry Monograph</span>
        <h1 className="headline-lg mt-1 text-on-surface">Booking Requests</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Review requests from couples for your services and accept or decline pending
          inquiries. Decisions are final.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-container-low p-4 shadow-editorial">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`chip ${filter === item ? "chip-active" : ""}`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
            <span className="text-[10px] opacity-70">
              {item === "all"
                ? bookings.length
                : bookings.filter((booking) => booking.status === item).length}
            </span>
          </button>
        ))}
        {pendingCount > 0 && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
            {pendingCount} awaiting response
          </span>
        )}
      </div>

      {loading ? (
        <RowsSkeleton count={4} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Requests unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="event_note"
          title={filter === "all" ? "No booking requests yet" : `No ${filter} requests`}
          description="When a couple requests one of your services, it will appear here for review."
          actionLabel="Review my services"
          actionHref="/dashboard/vendor/services"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <article
              key={booking.id}
              className="rounded-xl bg-surface-container-low p-5 shadow-editorial"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                  {booking.customerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.customerImage}
                      alt={booking.customerName || "Customer"}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-fixed/40 text-[12px] font-semibold text-secondary">
                      {initials(booking.customerName)}
                    </span>
                  )}
                  <div>
                    <h3 className="text-[14px] font-semibold text-on-surface">
                      {booking.customerName}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant">
                      {booking.customerEmail}
                    </p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">
                      Requested {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-surface-container-lowest p-4 sm:grid-cols-2">
                <div>
                  <span className="label-editorial text-[9px] text-on-surface-variant">
                    Service
                  </span>
                  <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      storefront
                    </span>
                    {booking.serviceName}
                  </p>
                </div>
                <div>
                  <span className="label-editorial text-[9px] text-on-surface-variant">
                    Event Date
                  </span>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      calendar_month
                    </span>
                    {formatDate(booking.eventDate)}
                  </p>
                </div>
                <div>
                  <span className="label-editorial text-[9px] text-on-surface-variant">
                    Event Location
                  </span>
                  <p className="mt-1 flex items-center gap-2 text-[13px] text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      location_on
                    </span>
                    {booking.eventLocation}
                  </p>
                </div>
                <div>
                  <span className="label-editorial text-[9px] text-on-surface-variant">
                    Customer Message
                  </span>
                  <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
                    {booking.message?.trim() || "No additional message provided."}
                  </p>
                </div>
              </div>

              {booking.status === "pending" ? (
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingReject(booking)}
                    disabled={busyId === booking.id}
                    aria-busy={busyId === booking.id}
                    className="btn btn-danger btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => act(booking, "accepted")}
                    disabled={busyId === booking.id}
                    aria-busy={busyId === booking.id}
                    className="btn btn-primary btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    {busyId === booking.id ? "Updating…" : "Accept Request"}
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-right text-[11px] text-outline">
                  This request has been {booking.status} and can no longer be changed.
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(pendingReject)}
        onClose={() => setPendingReject(null)}
        title="Reject this request?"
        footer={
          pendingReject && (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setPendingReject(null)}
                disabled={busyId === pendingReject.id}
              >
                Keep request
              </button>
              <button
                type="button"
                data-autofocus
                className="btn btn-danger btn-sm"
                onClick={() => act(pendingReject, "rejected")}
                disabled={busyId === pendingReject.id}
                aria-busy={busyId === pendingReject.id}
              >
                {busyId === pendingReject.id ? "Rejecting…" : "Yes, reject"}
              </button>
            </>
          )
        }
      >
        {pendingReject && (
          <p className="body-sm text-on-surface-variant">
            <strong className="font-semibold text-on-surface">
              {pendingReject.customerName}
            </strong>{" "}
            will be told that this date is unavailable. Decisions are final and cannot be
            undone from the dashboard.
          </p>
        )}
      </Modal>
    </div>
  );
}
