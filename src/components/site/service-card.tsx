import Link from "next/link";
import { CATEGORY_ICONS } from "@/lib/constants";
import { formatPrice, initials } from "@/lib/api";
import { MOSAIC_LAYOUTS, mosaicImages } from "@/lib/mosaic";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const images = mosaicImages(service.images);
  const layout = MOSAIC_LAYOUTS[Math.min(images.length, 4)] || MOSAIC_LAYOUTS[1];
  const isPremium = Boolean(service.vendor?.premium);
  const vendorName = service.vendor?.name || service.vendor?.businessName || "Yesly Atelier";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest ring-1 ring-primary/[0.06] shadow-editorial transition-all duration-500 hover:-translate-y-1.5 hover:ring-secondary/35 hover:shadow-editorial-xl">
      <div className="relative overflow-hidden">
        {images.length ? (
          <div className="grid aspect-[4/3] grid-cols-4 grid-rows-2 gap-[3px] bg-surface-container-high">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`relative overflow-hidden bg-surface-container ${layout[index]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${service.serviceName} — photograph ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-0 bg-primary/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface-container">
            <span className="material-symbols-outlined text-[42px] text-outline-variant">
              image
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-24px)] items-center gap-1.5 rounded-full bg-surface-container-lowest/92 px-3 py-1 shadow-sm backdrop-blur-md">
          <span className="material-symbols-outlined shrink-0 text-[14px] text-secondary">
            {CATEGORY_ICONS[service.category] || "auto_awesome"}
          </span>
          <span className="label-editorial truncate text-[10px] text-primary">
            {service.category}
          </span>
        </span>

        {images.length > 1 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/55 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-surface backdrop-blur-md">
            <span className="material-symbols-outlined text-[13px]">photo_library</span>
            {images.length} photos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px] text-secondary">place</span>
            <span className="truncate">{service.location}</span>
            {isPremium && (
              <span className="badge-gold ml-auto shrink-0 normal-case tracking-[0.1em]">
                <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                Premium
              </span>
            )}
          </div>

          <h3 className="headline-sm text-primary transition-colors duration-300 group-hover:text-secondary">
            {service.serviceName}
          </h3>
          <p className="body-sm mt-2 line-clamp-2 leading-relaxed text-on-surface-variant">
            {service.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-container-high/80 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {service.vendor?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.vendor.image}
                alt={vendorName}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-surface-container-high"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed/35 text-[11px] font-semibold text-secondary ring-1 ring-secondary-fixed/50">
                {initials(vendorName)}
              </span>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[12px] font-medium text-on-surface">{vendorName}</span>
              <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                <span className="material-symbols-outlined text-[13px] text-secondary">
                  verified
                </span>
                {isPremium ? "Premium vendor" : "Verified vendor"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <span className="block text-[9px] uppercase tracking-[0.16em] text-on-surface-variant">
                From
              </span>
              <span className="block text-[13px] font-semibold text-primary">
                {formatPrice(service.price)}
              </span>
            </div>
            <Link
              href={`/services/${service.id}`}
              aria-label={`View details for ${service.serviceName}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary transition-all duration-300 hover:bg-secondary hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 focus-visible:ring-offset-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
