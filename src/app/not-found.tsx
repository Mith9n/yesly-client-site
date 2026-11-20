import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-20 text-center">
      <span className="label-editorial text-secondary">Page Not Found</span>
      <p className="font-display mt-3 text-[92px] leading-none text-surface-container-highest">
        404
      </p>
      <h1 className="headline-lg mt-2 text-primary">
        This page has left the celebration
      </h1>
      <p className="body-md mx-auto mt-3 max-w-md text-on-surface-variant">
        The page you are looking for may have been moved, removed, or never existed in the
        Yesly directory.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Return home
          <span className="material-symbols-outlined text-[18px]">home</span>
        </Link>
        <Link href="/services" className="btn btn-ghost">
          Browse services
          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
        </Link>
      </div>
    </div>
  );
}
