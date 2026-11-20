export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: string;
  tone?: "default" | "gold" | "muted";
}) {
  const toneClass =
    tone === "gold"
      ? "border-secondary-fixed/60 bg-secondary-fixed/20"
      : tone === "muted"
        ? "border-surface-container-high bg-surface-container"
        : "border-surface-container-high/70 bg-surface-container-low";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-editorial ${toneClass}`}
    >
      {tone === "gold" && (
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
      )}
      <div className="flex items-start justify-between gap-3">
        <span className="label-editorial text-[9px] text-on-surface-variant">{label}</span>
        {icon && (
          <span className="material-symbols-outlined text-[19px] text-secondary/80 transition-colors group-hover:text-secondary">
            {icon}
          </span>
        )}
      </div>
      <p className="headline-lg mt-3 leading-none text-on-surface">{value}</p>
      {hint && <p className="mt-2 text-[11.5px] text-on-surface-variant">{hint}</p>}
    </div>
  );
}
