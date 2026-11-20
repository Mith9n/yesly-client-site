import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancelled — Yesly",
};

export default function PaymentCancelPage() {
  return (
    <div className="container-editorial flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-xl bg-surface-container-lowest p-8 text-center shadow-editorial-xl sm:p-10">
        <span className="material-symbols-outlined text-[46px] text-secondary">undo</span>
        <h1 className="headline-md mt-4 text-on-surface">Checkout cancelled</h1>
        <p className="body-sm mx-auto mt-2 max-w-md text-on-surface-variant">
          No payment was taken and your current plan is unchanged. You can return to your
          vendor subscription whenever you are ready.
        </p>
        <div className="mt-7 flex flex-col gap-2">
          <Link href="/dashboard/vendor/subscription" className="btn btn-primary">
            Back to subscription
          </Link>
          <Link href="/dashboard/vendor" className="btn btn-ghost">
            Vendor dashboard
          </Link>
        </div>
        <div className="mt-7 rounded-lg bg-surface-container-low p-4 text-left">
          <p className="label-editorial text-[9px] text-secondary">Premium benefits</p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Unlimited active service listings",
              "Premium vendor badge on every listing",
              "Priority placement in Yesly discovery",
            ].map((item) => (
              <li key={item} className="body-sm flex items-start gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  check_circle
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
