"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Yesly client error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-20 text-center">
      <span className="material-symbols-outlined text-[46px] text-secondary">
        sentiment_dissatisfied
      </span>
      <h1 className="headline-lg mt-4 text-primary">Something interrupted the celebration</h1>
      <p className="body-md mx-auto mt-3 max-w-md text-on-surface-variant">
        An unexpected error occurred while preparing this page. You can try again, or return
        to the Yesly directory.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
        <Link href="/" className="btn btn-ghost">
          Return home
        </Link>
      </div>
    </div>
  );
}
