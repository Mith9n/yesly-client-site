export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-surface-container-high border-t-secondary" />
      <p className="label-editorial text-on-surface-variant">Preparing your folio…</p>
    </div>
  );
}
