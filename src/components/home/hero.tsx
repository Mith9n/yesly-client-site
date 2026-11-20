import Link from "next/link";
import { CATEGORIES, HERO_VIDEO } from "@/lib/constants";

const STATS = [
  { value: "06", label: "Curated disciplines" },
  { value: "100%", label: "Vetted ateliers" },
  { value: "24h", label: "Concierge reply" },
];

const INDEX = [
  { label: "Photography", category: CATEGORIES[0] },
  { label: "Venues", category: CATEGORIES[1] },
  { label: "Florals", category: CATEGORIES[2] },
  { label: "Catering", category: CATEGORIES[3] },
  { label: "Beauty", category: CATEGORIES[4] },
  { label: "Fashion", category: CATEGORIES[5] },
];

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-primary text-on-primary">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-105 object-cover brightness-[0.95] contrast-[1.03]"
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/25 to-primary/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/5 to-transparent" />
      </div>

      <div className="container-editorial relative z-10">
        <div className="flex flex-col items-center pb-14 pt-20 text-center md:pb-20 md:pt-28">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-surface/75 sm:text-xs">
            Plan. Book. Celebrate.
          </p>

          <h1 className="mt-6 max-w-[860px] font-display text-[clamp(2.25rem,5.9vw,4.35rem)] font-medium leading-[1.05] tracking-[-0.02em] text-surface">
            <span className="block">Plan Your Dream Wedding</span>
            <span className="block">Effortlessly</span>
          </h1> 

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="#featured-services"
              className="group relative flex w-full items-center justify-center gap-2.5 rounded-full border border-secondary-fixed/65 bg-primary/15 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-fixed shadow-[0_0_0_1px_rgba(255,224,136,0.12)] backdrop-blur-md transition-all duration-300 hover:border-secondary-fixed hover:bg-secondary-fixed/[0.12] hover:shadow-[0_0_0_1px_rgba(255,224,136,0.3),0_14px_34px_-22px_rgba(255,224,136,0.65)] sm:w-auto"
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 rotate-45 bg-secondary-fixed/80 transition-colors duration-300 group-hover:bg-secondary-fixed"
              />
              Explore wedding services
              <span className="material-symbols-outlined text-[17px] transition-transform duration-300 group-hover:translate-y-0.5">
                arrow_downward
              </span>
            </Link>
            <Link
              href="/sign-up?role=vendor"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-7 py-3.5 text-[13px] font-medium text-surface backdrop-blur-md transition-all duration-300 hover:border-white/45 hover:bg-white/15 sm:w-auto"
            >
              Become a vendor
              <span className="material-symbols-outlined text-[17px] text-secondary-fixed">
                arrow_forward
              </span>
            </Link>
          </div>

          <nav aria-label="Browse disciplines" className="mt-14 w-full max-w-5xl">
            <div className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-white/20" />
              <span className="text-[8.5px] font-semibold uppercase tracking-[0.3em] text-surface/55">
                The Yesly Index
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-white/20" />
            </div>

            <ul className="mt-6 grid grid-cols-2 border-t border-white/15 sm:grid-cols-3 lg:grid-cols-6">
              {INDEX.map((item, position) => (
                <li
                  key={item.label}
                  className="border-b border-white/10 sm:border-b-0 sm:[&:nth-child(3n)]:border-r sm:[&:nth-child(3n)]:border-white/10 lg:border-r lg:border-white/10 lg:last:border-r-0"
                >
                  <Link
                    href={`/services?category=${encodeURIComponent(item.category)}`}
                    className="group flex h-full flex-col items-center justify-between px-3 pb-4 pt-4 text-center transition-colors duration-300 hover:bg-white/[0.05]"
                  >
                    <span className="font-display text-[11px] leading-none text-secondary-fixed/60 transition-colors duration-300 group-hover:text-secondary-fixed">
                      0{position + 1}
                    </span>
                    <span className="mt-5 font-display text-[16px] leading-tight text-surface">
                      {item.label}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-surface/70 transition-colors duration-300 group-hover:text-secondary-fixed">
                      Explore
                      <span className="material-symbols-outlined text-[12px] transition-transform duration-300 group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-primary/50 backdrop-blur-md">
        <div className="container-editorial grid grid-cols-3 divide-x divide-white/10">
          {STATS.map((item) => (
            <div key={item.label} className="px-2 py-5 text-center sm:px-6 sm:text-left">
              <span className="block font-display text-[24px] leading-none text-secondary-fixed sm:text-[28px]">
                {item.value}
              </span>
              <span className="label-editorial mt-2 block text-[8.5px] text-surface-variant sm:text-[9px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
