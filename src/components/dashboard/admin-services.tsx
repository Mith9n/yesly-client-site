"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, formatDate, formatPrice } from "@/lib/api";
import type { Service } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const query = new URLSearchParams({ search: debounced, status });
        const data = await api<{ services: Service[] }>(`/api/admin/services?${query}`);
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
  }, [debounced, status, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const update = async (service: Service, body: Record<string, unknown>) => {
    setBusyId(service.id);
    try {
      await api(`/api/admin/services/${service.id}`, { method: "PATCH", body });
      setServices((current) =>
        current.map((item) => (item.id === service.id ? { ...item, ...body } : item)),
      );
      toast.success(
        body.status === "approved"
          ? "Service approved and published"
          : body.status === "rejected"
            ? "Service rejected"
            : body.isActive === false
              ? "Service paused"
              : "Service activated",
      );
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
      await api(`/api/admin/services/${deleteTarget.id}`, { method: "DELETE" });
      setServices((current) => current.filter((item) => item.id !== deleteTarget.id));
      toast.success("Service removed from the marketplace");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">Curation Console</span>
        <h1 className="headline-lg mt-1 text-on-surface">Manage Services</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Review submissions, approve listings, change publication status or remove
          inappropriate services. Only approved and active services appear publicly.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4 shadow-editorial">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-3 py-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-outline">search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-[13px] focus:outline-none"
              placeholder="Search services by name, category or location…"
              aria-label="Search services"
            />
          </div>
          <span className="label-editorial text-[10px] text-outline">
            {services.length} listings
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              aria-pressed={status === item}
              className={`chip ${status === item ? "chip-active" : ""}`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <RowsSkeleton count={5} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Services unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon="task_alt"
          title="No services match this view"
          description="Change the status filter or clear your search to see more listings."
        />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-xl bg-surface-container-low p-4 shadow-editorial"
            >
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                    {service.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.images[0]}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="label-editorial text-[10px] text-secondary">
                        {service.category}
                      </span>
                      <StatusBadge status={service.status} />
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          service.isActive
                            ? "bg-[#e6f2e5] text-[#2f6b3a]"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {service.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <h3 className="headline-sm mt-1 text-on-surface">
                      {service.serviceName}
                    </h3>
                    <p className="body-sm text-on-surface-variant">
                      {service.vendor?.name} · {service.location} ·{" "}
                      {formatPrice(service.price)} · {formatDate(service.createdAt)}
                    </p>
                    <p className="body-sm mt-1 line-clamp-1 max-w-2xl text-on-surface-variant">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      visibility
                    </span>
                    Preview
                  </Link>
                  {service.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => update(service, { status: "approved" })}
                      disabled={busyId === service.id}
                      className="btn btn-primary btn-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Approve
                    </button>
                  )}
                  {service.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => update(service, { status: "rejected" })}
                      disabled={busyId === service.id}
                      className="btn btn-danger btn-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      Reject
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => update(service, { isActive: !service.isActive })}
                    disabled={busyId === service.id}
                    className="btn btn-ghost btn-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {service.isActive ? "pause" : "play_arrow"}
                    </span>
                    {service.isActive ? "Pause" : "Activate"}
                  </button>
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
        title="Remove this service?"
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Removing…" : "Remove permanently"}
            </button>
          </>
        }
      >
        <p className="body-md text-on-surface-variant">
          <span className="font-semibold text-on-surface">{deleteTarget?.serviceName}</span>{" "}
          will be deleted from the marketplace immediately.
        </p>
      </Modal>
    </div>
  );
}
