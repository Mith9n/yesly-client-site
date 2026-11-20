import { STATUS_STYLES } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        STATUS_STYLES[status] || "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {label}
    </span>
  );
}
