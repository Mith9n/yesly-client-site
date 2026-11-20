export function ServiceCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-surface-container-lowest ring-1 ring-primary/5">
      <div className="grid aspect-[4/3] w-full grid-cols-4 grid-rows-2 gap-[3px] bg-surface-container-high">
        <div className="col-span-2 row-span-2 bg-surface-container-highest/70" />
        <div className="col-span-2 row-span-1 bg-surface-container-highest/70" />
        <div className="col-span-1 row-span-1 bg-surface-container-highest/70" />
        <div className="col-span-1 row-span-1 bg-surface-container-highest/70" />
      </div>
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 rounded bg-surface-container-high" />
        <div className="h-5 w-3/4 rounded bg-surface-container-high" />
        <div className="h-3 w-full rounded bg-surface-container-high" />
        <div className="h-3 w-2/3 rounded bg-surface-container-high" />
        <div className="h-10 w-full rounded bg-surface-container-high" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl bg-surface-container-low p-5 shadow-sm"
        >
          <div className="h-3 w-2/3 rounded bg-surface-container-high" />
          <div className="mt-5 h-8 w-1/2 rounded bg-surface-container-high" />
          <div className="mt-3 h-3 w-3/4 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export function RowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 rounded-xl bg-surface-container-low p-5"
        >
          <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-container-high" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-surface-container-high" />
            <div className="h-3 w-1/2 rounded bg-surface-container-high" />
          </div>
          <div className="h-8 w-24 rounded bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export function PageLoader({ label = "Preparing your folio…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-surface-container-high border-t-secondary" />
      <p className="label-editorial text-on-surface-variant">{label}</p>
    </div>
  );
}
