"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage, formatDate, initials } from "@/lib/api";
import type { AdminUser, Role } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { Modal } from "@/components/ui/modal";

const ROLE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All roles" },
  { value: "vendor", label: "Vendors" },
  { value: "customer", label: "Customers" },
  { value: "admin", label: "Admins" },
];

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingBlock, setPendingBlock] = useState<AdminUser | null>(null);
  const detailRequestRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const query = new URLSearchParams({ search: debounced, role });
        const data = await api<{ users: AdminUser[] }>(`/api/admin/users?${query}`);
        if (cancelled) return;
        setUsers(data.users);
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
  }, [debounced, role, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const openDetail = async (user: AdminUser) => {
    const requestId = ++detailRequestRef.current;
    setDetail(user);
    setDetailLoading(true);
    try {
      const data = await api<{ user: AdminUser }>(`/api/admin/users/${user.id}`);
      // A slower request for a previously selected row must not overwrite the
      // record the admin is currently looking at.
      if (requestId !== detailRequestRef.current) return;
      setDetail(data.user);
    } catch (err) {
      if (requestId === detailRequestRef.current) toast.error(errorMessage(err));
    } finally {
      if (requestId === detailRequestRef.current) setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    detailRequestRef.current += 1;
    setDetail(null);
  };

  const toggleBlock = async (user: AdminUser) => {
    setBusyId(user.id);
    try {
      const data = await api<{ message: string; isBlocked: boolean }>(
        `/api/admin/users/${user.id}/block`,
        { method: "PATCH", body: { isBlocked: !user.isBlocked } },
      );
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, isBlocked: data.isBlocked } : item,
        ),
      );
      setDetail((current) =>
        current && current.id === user.id
          ? { ...current, isBlocked: data.isBlocked }
          : current,
      );
      setPendingBlock(null);
      toast.success(data.message);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">User Ecosystem</span>
        <h1 className="headline-lg mt-1 text-on-surface">Manage Users</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Search the registry, review account details and restrict access for accounts that
          violate Yesly standards. Blocking takes effect on the API immediately.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4 shadow-editorial sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-lg bg-surface-container-lowest px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-secondary/50">
          <span className="material-symbols-outlined text-[18px] text-outline">search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-[13px] focus-visible:outline-none"
            placeholder="Search users by name or email…"
            aria-label="Search users"
          />
        </div>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded-lg bg-surface-container-lowest px-3 py-2 text-[13px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary/60"
          aria-label="Filter by role"
        >
          {ROLE_FILTERS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="label-editorial text-[10px] text-outline">{users.length} users</span>
      </div>

      {loading ? (
        <RowsSkeleton count={5} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Users unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon="person_search"
          title="No users match this search"
          description="Try a different name, email address or role filter."
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-surface-container-low shadow-editorial">
          <div className="hidden grid-cols-12 gap-3 border-b border-surface-container-high px-5 py-3 md:grid">
            <span className="label-editorial col-span-5 text-[9px] text-on-surface-variant">
              User
            </span>
            <span className="label-editorial col-span-2 text-[9px] text-on-surface-variant">
              Role
            </span>
            <span className="label-editorial col-span-2 text-[9px] text-on-surface-variant">
              Plan
            </span>
            <span className="label-editorial col-span-2 text-[9px] text-on-surface-variant">
              Status
            </span>
            <span className="col-span-1" />
          </div>
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 items-center gap-3 border-b border-surface-container-high px-5 py-4 last:border-b-0 md:grid-cols-12"
            >
              <div className="col-span-5 flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed/40 text-[11px] font-semibold text-secondary">
                    {initials(user.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-on-surface">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-on-surface-variant">{user.email}</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {user.role}
                </span>
              </div>
              <div className="col-span-2 text-[12px] text-on-surface-variant">
                {user.role === "vendor"
                  ? user.subscriptionPlan === "premium"
                    ? "Premium"
                    : "Free"
                  : "—"}
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    user.isBlocked ? "text-error" : "text-[#2f6b3a]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="col-span-1 flex justify-start gap-1 md:justify-end">
                <button
                  type="button"
                  onClick={() => openDetail(user)}
                  className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
                  aria-label={`View ${user.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPendingBlock(user)}
                  disabled={busyId === user.id}
                  aria-busy={busyId === user.id}
                  className={`rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 disabled:opacity-50 ${
                    user.isBlocked ? "text-[#2f6b3a]" : "text-error"
                  }`}
                  aria-label={user.isBlocked ? `Unblock ${user.name}` : `Block ${user.name}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {user.isBlocked ? "lock_open" : "block"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={closeDetail}
        title="User record"
        footer={
          detail && (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeDetail}
              >
                Close
              </button>
              <button
                type="button"
                className={`btn btn-sm ${detail.isBlocked ? "btn-primary" : "btn-danger"}`}
                onClick={() => setPendingBlock(detail)}
                disabled={busyId === detail.id || detail.role === "admin"}
              >
                {detail.isBlocked ? "Unblock user" : "Block user"}
              </button>
            </>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {detail.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={detail.image}
                  alt={detail.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed/40 font-display text-lg text-secondary">
                  {initials(detail.name)}
                </span>
              )}
              <div>
                <h3 className="headline-sm text-on-surface">{detail.name}</h3>
                <p className="body-sm text-on-surface-variant">{detail.email}</p>
                {detail.businessName && (
                  <p className="body-sm text-secondary">{detail.businessName}</p>
                )}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-lg bg-surface-container-low p-4">
              <div>
                <dt className="label-editorial text-[9px] text-on-surface-variant">Role</dt>
                <dd className="text-[13px] font-semibold text-on-surface">{detail.role}</dd>
              </div>
              <div>
                <dt className="label-editorial text-[9px] text-on-surface-variant">
                  Subscription
                </dt>
                <dd className="text-[13px] font-semibold text-on-surface">
                  {detail.role === "vendor" ? detail.subscriptionPlan : "—"}
                </dd>
              </div>
              <div>
                <dt className="label-editorial text-[9px] text-on-surface-variant">
                  Joined
                </dt>
                <dd className="text-[13px] text-on-surface">{formatDate(detail.createdAt)}</dd>
              </div>
              <div>
                <dt className="label-editorial text-[9px] text-on-surface-variant">
                  Status
                </dt>
                <dd
                  className={`text-[13px] font-semibold ${
                    detail.isBlocked ? "text-error" : "text-[#2f6b3a]"
                  }`}
                >
                  {detail.isBlocked ? "Blocked" : "Active"}
                </dd>
              </div>
            </dl>
            {detailLoading ? (
              <p className="body-sm text-on-surface-variant">Loading activity…</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <p className="headline-sm text-on-surface">{detail.services ?? 0}</p>
                  <p className="label-editorial text-[9px] text-on-surface-variant">
                    Services
                  </p>
                </div>
                <div className="rounded-lg bg-surface-container-low p-3 text-center">
                  <p className="headline-sm text-on-surface">{detail.bookings ?? 0}</p>
                  <p className="label-editorial text-[9px] text-on-surface-variant">
                    Bookings
                  </p>
                </div>
              </div>
            )}
            {detail.role === "admin" && (
              <p className="body-sm text-on-surface-variant">
                Admin accounts cannot be blocked from this console.
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(pendingBlock)}
        onClose={() => setPendingBlock(null)}
        title={pendingBlock?.isBlocked ? "Unblock this account?" : "Block this account?"}
        footer={
          pendingBlock && (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setPendingBlock(null)}
                disabled={busyId === pendingBlock.id}
              >
                Keep as is
              </button>
              <button
                type="button"
                data-autofocus
                className={`btn btn-sm ${pendingBlock.isBlocked ? "btn-primary" : "btn-danger"}`}
                onClick={() => toggleBlock(pendingBlock)}
                disabled={busyId === pendingBlock.id}
                aria-busy={busyId === pendingBlock.id}
              >
                {busyId === pendingBlock.id
                  ? "Updating…"
                  : pendingBlock.isBlocked
                    ? "Yes, unblock"
                    : "Yes, block"}
              </button>
            </>
          )
        }
      >
        {pendingBlock && (
          <p className="body-sm text-on-surface-variant">
            {pendingBlock.isBlocked ? (
              <>
                <strong className="font-semibold text-on-surface">{pendingBlock.name}</strong>{" "}
                will be able to sign in and use Yesly again immediately.
              </>
            ) : (
              <>
                <strong className="font-semibold text-on-surface">{pendingBlock.name}</strong>{" "}
                will lose access to Yesly immediately. Their sessions stop working on the
                next request, but their listings and bookings stay in the registry.
              </>
            )}
          </p>
        )}
      </Modal>
    </div>
  );
}

export type { Role };
