"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api, errorMessage, formatDate } from "@/lib/api";

interface PaymentStatus {
  sessionId: string;
  paymentStatus: string;
  plan: string;
  subscriptionPlan: string;
  subscriptionExpiresAt: string | null;
}

export function PaymentSuccess() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { refresh } = useAuth();

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(
    sessionId ? null : "No checkout session was provided.",
  );
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const check = async (attempt: number) => {
      try {
        const data = await api<PaymentStatus>(`/api/payments/status/${sessionId}`);
        if (cancelled) return;
        setStatus(data);
        setAttempts(attempt);
        setLoading(false);
        if (data.paymentStatus === "paid" && data.subscriptionPlan === "premium") {
          await refresh();
          return;
        }
        if (attempt < 5) {
          timer = setTimeout(() => void check(attempt + 1), 2500);
        }
      } catch (err) {
        if (cancelled) return;
        setError(errorMessage(err));
        setLoading(false);
      }
    };

    void check(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const activated = status?.subscriptionPlan === "premium";

  return (
    <div className="container-editorial flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-xl bg-surface-container-lowest p-8 text-center shadow-editorial-xl sm:p-10">
        {loading ? (
          <>
            <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-2 border-surface-container-high border-t-secondary" />
            <h1 className="headline-md mt-6 text-on-surface">Verifying your payment</h1>
            <p className="body-sm mt-2 text-on-surface-variant">
              We are confirming the Stripe checkout session with the Yesly server.
            </p>
          </>
        ) : error ? (
          <>
            <span className="material-symbols-outlined text-[44px] text-error">error</span>
            <h1 className="headline-md mt-4 text-on-surface">We could not verify this payment</h1>
            <p className="body-sm mt-2 text-on-surface-variant">{error}</p>
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/dashboard/vendor/subscription" className="btn btn-primary">
                Back to subscription
              </Link>
              <Link href="/" className="btn btn-ghost">
                Return home
              </Link>
            </div>
          </>
        ) : activated ? (
          <>
            <span className="material-symbols-outlined text-[48px] text-[#2f6b3a]">
              verified
            </span>
            <h1 className="headline-md mt-4 text-on-surface">Premium membership activated</h1>
            <p className="body-sm mx-auto mt-2 max-w-md text-on-surface-variant">
              Your payment was verified and your Premium Guild membership is active. You can
              now publish unlimited weddings services.
            </p>
            <div className="mt-6 rounded-lg bg-surface-container-low p-4 text-left">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-on-surface-variant">Plan</span>
                <span className="font-semibold text-on-surface">Premium Guild</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-on-surface-variant">Membership renews</span>
                <span className="font-semibold text-on-surface">
                  {formatDate(status?.subscriptionExpiresAt)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-on-surface-variant">Stripe reference</span>
                <span className="max-w-[180px] truncate font-mono text-[10px] text-on-surface-variant">
                  {status?.sessionId}
                </span>
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/dashboard/vendor/services/new" className="btn btn-primary">
                Publish a new service
                <span className="material-symbols-outlined text-[18px]">add</span>
              </Link>
              <Link href="/dashboard/vendor/subscription" className="btn btn-ghost">
                View membership
              </Link>
            </div>
          </>
        ) : status?.paymentStatus === "paid" ? (
          <>
            <span className="material-symbols-outlined text-[44px] text-secondary">
              hourglass_top
            </span>
            <h1 className="headline-md mt-4 text-on-surface">Payment received</h1>
            <p className="body-sm mt-2 text-on-surface-variant">
              Stripe confirmed your payment. Premium is activated by the verified webhook,
              which may take a moment. Refresh this page shortly or refresh your status from
              the subscription page.
            </p>
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/dashboard/vendor/subscription" className="btn btn-primary">
                Refresh membership status
              </Link>
              <Link href="/" className="btn btn-ghost">
                Return home
              </Link>
            </div>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[44px] text-secondary">
              pending_actions
            </span>
            <h1 className="headline-md mt-4 text-on-surface">Payment not confirmed yet</h1>
            <p className="body-sm mt-2 text-on-surface-variant">
              Stripe reports this checkout as {status?.paymentStatus || "unpaid"}. Premium
              access is never granted from a browser redirect, so your plan has not changed.
            </p>
            {attempts > 0 && (
              <p className="body-sm mt-2 text-outline">
                Checked {attempts + 1} time{attempts === 0 ? "" : "s"}.
              </p>
            )}
            <div className="mt-7 flex flex-col gap-2">
              <Link href="/dashboard/vendor/subscription" className="btn btn-primary">
                Try checkout again
              </Link>
              <Link href="/" className="btn btn-ghost">
                Return home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
