"use client";

import { useEffect, useState } from "react";
import { api, errorMessage, formatDate, formatPrice } from "@/lib/api";
import type { Transaction } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { StatCard } from "@/components/ui/stat-card";

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await api<{ transactions: Transaction[] }>(
          "/api/admin/transactions",
        );
        if (cancelled) return;
        setTransactions(data.transactions);
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

  const paid = transactions.filter((transaction) => transaction.status === "paid");
  const revenue = paid.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">Premium Ledger</span>
        <h1 className="headline-lg mt-1 text-on-surface">Transactions</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          A read-only record of premium memberships created by verified Stripe webhooks.
          Payment status cannot be edited manually anywhere in this console.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Transactions" value={transactions.length} icon="receipt_long" />
        <StatCard label="Verified Payments" value={paid.length} icon="verified" tone="gold" />
        <StatCard label="Revenue" value={formatPrice(revenue)} icon="payments" tone="muted" />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-surface-container-low px-4 py-3 shadow-editorial">
        <span className="material-symbols-outlined text-[20px] text-secondary">lock</span>
        <p className="body-sm text-on-surface-variant">
          Transactions are written only by the Stripe webhook after signature verification.
          Admins have view-only access.
        </p>
      </div>

      {loading ? (
        <RowsSkeleton count={4} />
      ) : error ? (
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[34px] text-error">cloud_off</span>
          <p className="headline-sm mt-3">Transactions unavailable</p>
          <p className="body-sm mt-1 text-on-surface-variant">{error}</p>
          <button type="button" onClick={reload} className="btn btn-primary btn-sm mt-5">
            Retry
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="No transactions recorded"
          description="Premium membership payments will appear here once vendors complete Stripe Checkout."
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-surface-container-low shadow-editorial">
          <div className="hidden grid-cols-12 gap-3 border-b border-surface-container-high px-5 py-3 md:grid">
            {["Vendor", "Plan", "Amount", "Status", "Date"].map((heading, index) => (
              <span
                key={heading}
                className={`label-editorial text-[9px] text-on-surface-variant ${
                  index === 0 ? "col-span-4" : index === 4 ? "col-span-2" : "col-span-2"
                }`}
              >
                {heading}
              </span>
            ))}
          </div>
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-2 items-center gap-3 border-b border-surface-container-high px-5 py-4 last:border-b-0 md:grid-cols-12"
            >
              <div className="col-span-2 md:col-span-4">
                <p className="text-[13px] font-semibold text-on-surface">
                  {transaction.vendorName}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {transaction.vendorEmail || "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="rounded-full bg-secondary-fixed/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-fixed">
                  {transaction.plan}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-[13px] font-semibold text-on-surface">
                  {formatPrice(Number(transaction.amount))}
                </p>
                <p className="text-[10px] uppercase text-outline">{transaction.currency}</p>
              </div>
              <div className="md:col-span-2">
                <StatusBadge status={transaction.status} />
              </div>
              <div className="md:col-span-2 text-[12px] text-on-surface-variant">
                {formatDate(transaction.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
