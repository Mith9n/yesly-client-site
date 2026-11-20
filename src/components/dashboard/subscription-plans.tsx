"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { errorMessage, formatDate } from "@/lib/api";

const plans = [
  {
    id: "free",
    name: "Free Atelier",
    price: "$0",
    cadence: "forever",
    blurb: "Everything needed to publish your first three services.",
    features: [
      "Maximum 3 active services",
      "Basic vendor dashboard",
      "Booking request management",
      "Profile and portfolio settings",
    ],
  },
  {
    id: "premium",
    name: "Premium Guild",
    price: "$99",
    cadence: "per year",
    blurb: "For established ateliers publishing a full seasonal portfolio.",
    features: [
      "Unlimited active services",
      "Premium vendor badge",
      "Priority discovery placement",
      "All Free plan features",
      "Verified payment record",
    ],
  },
];

export function SubscriptionPlans() {
  const { user, refresh } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = user?.subscriptionPlan === "premium";

  const upgrade = async () => {
    setError(null);
    setRedirecting(true);
    try {
      // The Next.js route handler creates the Checkout session. Payment is
      // still confirmed by the Express webhook, not by this browser redirect.
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.message || "Could not start Stripe checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      toast.error(message);
      setRedirecting(false);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <span className="label-editorial text-secondary">Patron Privileges</span>
        <h1 className="headline-lg mt-1 text-on-surface">Subscription Plan</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Free vendors can keep three active services. Premium removes the limit and adds a
          premium badge to every listing.
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-surface-container p-5 shadow-editorial sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
          </span>
          <div>
            <p className="text-[13px] font-semibold text-on-surface">
              Current plan: {isPremium ? "Premium Guild" : "Free Atelier"}
            </p>
            <p className="body-sm text-on-surface-variant">
              {isPremium
                ? `Renews until ${formatDate(user?.subscriptionExpiresAt)}`
                : "Upgrade anytime — Premium is activated only after a verified Stripe payment."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="btn btn-ghost btn-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Refresh status
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {plans.map((plan) => {
          const active =
            plan.id === "premium" ? isPremium : !isPremium;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl p-7 shadow-editorial ${
                plan.id === "premium"
                  ? "border border-[#e6cf8b] bg-surface-container-lowest"
                  : "bg-surface-container-low"
              }`}
            >
              {plan.id === "premium" && (
                <span className="badge-gold absolute right-5 top-5">
                  <span className="material-symbols-outlined text-[12px]">star</span>
                  Recommended
                </span>
              )}
              <span className="label-editorial text-secondary">{plan.name}</span>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="headline-lg text-on-surface">{plan.price}</span>
                <span className="body-sm text-on-surface-variant">{plan.cadence}</span>
              </div>
              <p className="body-sm mt-2 text-on-surface-variant">{plan.blurb}</p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-secondary">
                      check_circle
                    </span>
                    <span className="body-sm text-on-surface-variant">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {plan.id === "premium" ? (
                  isPremium ? (
                    <div className="rounded-lg bg-[#e6f2e5] px-4 py-3 text-center text-[12px] font-semibold text-[#2f6b3a]">
                      Premium membership active
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={upgrade}
                      disabled={redirecting}
                      className="btn btn-primary w-full py-3.5"
                    >
                      {redirecting ? "Opening Stripe…" : "Upgrade to Premium"}
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </button>
                  )
                ) : (
                  <div className="rounded-lg bg-surface-container-high px-4 py-3 text-center text-[12px] font-semibold text-on-surface-variant">
                    {active ? "Your current plan" : "Included with every vendor account"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[22px] text-secondary">shield</span>
          <div>
            <p className="text-[13px] font-semibold text-on-surface">
              Secure Stripe Checkout
            </p>
            <p className="body-sm mt-1 text-on-surface-variant">
              You are redirected to Stripe to complete payment. Premium access is activated
              only by a verified Stripe webhook, never by the browser redirect. Cancelled
              payments leave your current plan untouched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
