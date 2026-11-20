import Link from "next/link";

export function EmptyState({
  icon = "auto_awesome",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-container-high bg-surface-container-low/50 px-6 py-16 text-center">
      <div className="relative mb-6">
        <span className="absolute inset-0 rounded-full bg-secondary-fixed/30 blur-xl" aria-hidden />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-secondary-fixed/50 bg-secondary-fixed/25">
          <span className="material-symbols-outlined text-[24px] text-secondary">{icon}</span>
        </span>
      </div>
      <h2 className="headline-sm text-on-surface">{title}</h2>
      {description && (
        <p className="body-sm mt-2 max-w-sm text-balance text-on-surface-variant">
          {description}
        </p>
      )}
      {actionLabel && (actionHref || onAction) && (
        <div className="mt-7">
          {actionHref ? (
            <Link href={actionHref} className="btn btn-primary btn-sm">
              {actionLabel}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
