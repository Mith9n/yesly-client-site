"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, formatDate } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

export function CustomerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<{ bookings: Booking[] }>("/api/bookings/mine");
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

  const cancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const data = await api<{ booking: Booking }>(
        `/api/bookings/${cancelTarget.id}/cancel`,
        { method: "PATCH" },
      );
      setBookings((current) =>
        current.map((item) => (item.id === cancelTarget.id ? data.booking : item)),
      );
      toast.success("Booking request cancelled");
      setCancelTarget(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="label-editorial text-secondary">Couple Monograph</span>
          <h1 className="headline-lg mt-1 text-on-surface">My Bookings</h1>
          <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
            Every request you have sent to a Yesly atelier, with its current status. Pending
            requests can be cancelled.
          </p>
        </div>
        <Link href="/services" className="btn btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Book another service
        </Link>
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
      </div>

      {loading ? (
        <RowsSkeleton count={4} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Bookings unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="event_note"
          title={filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
          description="Explore the Yesly directory and request your first wedding service."
          actionLabel="Browse services"
          actionHref="/services"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <article
              key={booking.id}
              className="overflow-hidden rounded-xl bg-surface-container-low shadow-editorial"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-high sm:h-36 sm:w-44">
                  {booking.serviceImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="material-symbols-outlined text-[26px] text-outline-variant">
                        image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="label-editorial text-[10px] text-secondary">
                        {booking.serviceCategory || "Wedding Service"}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <h3 className="headline-sm mt-1 text-on-surface">{booking.serviceName}</h3>
                    <p className="body-sm text-on-surface-variant">
                      Atelier: {booking.vendorName}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-[12px] text-on-surface-variant sm:grid-cols-2">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        calendar_month
                      </span>
                      {formatDate(booking.eventDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        location_on
                      </span>
                      {booking.eventLocation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        schedule
                      </span>
                      Requested {formatDate(booking.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        chat
                      </span>
                      {booking.message?.trim() ? "Message included" : "No message"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/services/${booking.serviceId}`}
                      className="btn btn-ghost btn-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        visibility
                      </span>
                      View Details
                    </Link>
                    {booking.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => setCancelTarget(booking)}
                        className="btn btn-danger btn-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        Cancel Request
                      </button>
                    ) : (
                      <span className="text-[11px] text-outline">
                        {booking.status === "accepted"
                          ? "Accepted bookings cannot be cancelled here."
                          : `This request is ${booking.status}.`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {booking.message?.trim() && (
                <div className="border-t border-surface-container-high bg-surface-container-lowest px-5 py-3">
                  <span className="label-editorial text-[9px] text-on-surface-variant">
                    Your message
                  </span>
                  <p className="body-sm mt-1 text-on-surface-variant">{booking.message}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this booking request?"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setCancelTarget(null)}
            >
              Keep request
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={cancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling…" : "Cancel request"}
            </button>
          </>
        }
      >
        <p className="body-md text-on-surface-variant">
          Your pending request for{" "}
          <span className="font-semibold text-on-surface">{cancelTarget?.serviceName}</span>{" "}
          on {formatDate(cancelTarget?.eventDate)} will be withdrawn. You can send a new
          request later.
        </p>
      </Modal>
    </div>
  );
}
