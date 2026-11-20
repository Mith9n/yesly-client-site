"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, formatDate, formatPrice } from "@/lib/api";
import type { Service } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/components/providers/auth-provider";

const FILTERS = ["all", "pending", "approved", "rejected"] as const;

export function VendorServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<{ services: Service[] }>("/api/services/vendor/mine");
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

  const filtered = useMemo(
    () => (filter === "all" ? services : services.filter((s) => s.status === filter)),
    [services, filter],
  );

  const toggleAvailability = async (service: Service) => {
    setBusyId(service.id);
    try {
      const data = await api<{ service: Service }>(`/api/services/${service.id}`, {
        method: "PATCH",
        body: { isActive: !service.isActive },
      });
      setServices((current) =>
        current.map((item) => (item.id === service.id ? data.service : item)),
      );
      toast.success(data.service.isActive ? "Service is now active" : "Service paused");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api(`/api/services/${deleteTarget.id}`, { method: "DELETE" });
      setServices((current) => current.filter((item) => item.id !== deleteTarget.id));
      toast.success("Service deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = services.filter((service) => service.isActive).length;
  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="label-editorial text-secondary">Atelier Catalog</span>
          <h1 className="headline-lg mt-1 text-on-surface">My Wedding Services</h1>
          <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
            Publish, edit and pause your services. New listings are reviewed by a Yesly
            curator before appearing publicly.
          </p>
        </div>
        <Link href="/dashboard/vendor/services/new" className="btn btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Service
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-xl bg-surface-container-low p-4 shadow-editorial sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`chip ${filter === item ? "chip-active" : ""}`}
            >
              {item === "all" ? "All Offerings" : item.charAt(0).toUpperCase() + item.slice(1)}
              <span className="text-[10px] opacity-70">
                {item === "all"
                  ? services.length
                  : services.filter((service) => service.status === item).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isPremium
                ? "bg-secondary-fixed/40 text-on-secondary-fixed"
                : activeCount >= 3
                  ? "bg-error-container text-error"
                  : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isPremium ? "all_inclusive" : "sell"}
            </span>
            {isPremium ? "Unlimited listings" : `${activeCount}/3 active services`}
          </span>
        </div>
      </div>

      {loading ? (
        <RowsSkeleton count={4} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Services unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="storefront"
          title={filter === "all" ? "No services published yet" : `No ${filter} services`}
          description={
            filter === "all"
              ? "Publish your first wedding service to start receiving booking requests from couples."
              : "Try another status filter or publish a new service."
          }
          actionLabel="Add your first service"
          actionHref="/dashboard/vendor/services/new"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((service) => (
            <article
              key={service.id}
              className="rounded-xl bg-surface-container-low p-4 shadow-editorial transition-colors hover:bg-surface-container"
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4 sm:items-center">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high sm:h-28 sm:w-24">
                    {service.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.images[0]}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-[22px] text-outline-variant">
                          image
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="label-editorial text-[10px] text-secondary">
                        {service.category}
                      </span>
                      <StatusBadge status={service.status} />
                      {!service.isActive && (
                        <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Paused
                        </span>
                      )}
                    </div>
                    <h3 className="headline-sm text-on-surface">{service.serviceName}</h3>
                    <p className="body-sm mt-1 line-clamp-1 max-w-xl text-on-surface-variant">
                      {service.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant">
                      <span className="font-semibold text-on-surface">
                        {formatPrice(service.price)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">place</span>
                        {service.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">
                          calendar_month
                        </span>
                        {formatDate(service.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/vendor/services/${service.id}/edit`}
                      className="btn btn-ghost btn-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleAvailability(service)}
                      disabled={busyId === service.id}
                      className="btn btn-ghost btn-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {service.isActive ? "pause" : "play_arrow"}
                      </span>
                      {service.isActive ? "Pause" : "Activate"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(service)}
                    className="rounded-lg p-2 text-on-surface-variant transition-colors hover:text-error"
                    aria-label={`Delete ${service.serviceName}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this service?"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setDeleteTarget(null)}
            >
              Keep service
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </button>
          </>
        }
      >
        <p className="body-md text-on-surface-variant">
          <span className="font-semibold text-on-surface">{deleteTarget?.serviceName}</span>{" "}
          will be removed from the marketplace. Existing booking records are kept for your
          history.
        </p>
      </Modal>
    </div>
  );
}
