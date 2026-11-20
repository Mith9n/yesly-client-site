"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, api, errorMessage, formatPrice, initials, isAbortError } from "@/lib/api";
import type { Service } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/skeletons";

export function ServiceDetails() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // The folio is public: guests can read every listing. Only booking asks
        // for an account.
        const data = await api<{ service: Service }>(`/api/services/${params.id}`, {
          auth: false,
          signal: controller.signal,
        });
        setService(data.service);
        setEventLocation(data.service.location);
      } catch (err) {
        if (isAbortError(err)) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(errorMessage(err));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (params.id) void load();
    return () => controller.abort();
  }, [params.id]);

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!eventDate) {
      setFormError("Please choose your event date");
      return;
    }
    if (eventLocation.trim().length < 3) {
      setFormError("Please enter the event location");
      return;
    }

    setSubmitting(true);
    try {
      await api("/api/bookings", {
        method: "POST",
        body: { serviceId: params.id, eventDate, eventLocation, message },
      });
      setSuccess(true);
      setMessage("");
      toast.success("Booking request submitted — the vendor will respond shortly");
    } catch (err) {
      const text = errorMessage(err);
      setFormError(text);
      toast.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader label="Preparing this atelier spread…" />;

  if (notFound) {
    return (
      <div className="container-editorial py-20">
        <EmptyState
          icon="broken_image"
          title="This service could not be found"
          description="The listing may have been removed or is awaiting curator approval."
          actionLabel="Back to the directory"
          actionHref="/services"
        />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container-editorial py-20">
        <div className="rounded-xl border border-error-container bg-error-container/40 p-10 text-center">
          <span className="material-symbols-outlined text-[36px] text-error">cloud_off</span>
          <h2 className="headline-sm mt-3">This service could not be loaded</h2>
          <p className="body-sm mt-2 text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm mt-6"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const images = service.images?.length ? service.images : [];
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "Yesly Atelier";
  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";
  const isOwner = user?.id === service.vendorId;

  return (
    <div className="bg-surface pb-16">
      <section className="container-editorial pt-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
          <Link href="/" className="transition-colors hover:text-on-surface">
            Home
          </Link>
          <span className="text-outline-variant">/</span>
          <Link href="/services" className="transition-colors hover:text-on-surface">
            Directory
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-secondary">{service.category}</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-gold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {service.vendor?.premium ? "Premium Atelier" : "Verified Atelier"}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  star
                </span>
                Curator approved
              </span>
              <span className="text-outline-variant">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-outline">
                  location_on
                </span>
                {service.location}
              </span>
            </div>
            <h1 className="display-hero mt-4 max-w-3xl text-balance text-primary">
              {service.serviceName}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-[12px] text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                storefront
              </span>
              Presented by {vendorName}
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-surface-container-low px-4 py-3 text-right">
            <span className="label-editorial block text-secondary">Starting from</span>
            <span className="headline-sm block text-primary">
              {formatPrice(service.price)}
            </span>
            <span className="body-sm block text-on-surface-variant">{service.category}</span>
          </div>
        </div>
      </section>

      <section className="container-editorial mt-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative h-[320px] overflow-hidden rounded-xl bg-surface-container md:col-span-7 md:h-[460px]">
            {images[activeImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeImage]}
                alt={service.serviceName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">
                  image
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-5">
              <span className="label-editorial text-[10px] text-secondary-fixed">
                Editorial Feature
              </span>
              <p className="headline-sm text-surface">{service.category}</p>
            </div>
          </div>
          <div className="grid auto-rows-[112px] grid-cols-3 content-start gap-3 md:col-span-5 md:auto-rows-[222px] md:grid-cols-2 md:content-center">
            {(images.length > 1
              ? images.map((image, index) => ({ image, index })).filter((entry) => entry.index !== activeImage)
              : [null, null, null, null].map((image, index) => ({ image, index }))
            )
              .slice(0, 4)
              .map(({ image, index }) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(index)}
                className="relative overflow-hidden rounded-xl bg-surface-container transition-all"
                aria-label={`View image ${index + 1}`}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={`${service.serviceName} ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-outline-variant">
                      photo_library
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-editorial mt-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="rounded-xl bg-surface-container-low p-6 shadow-editorial">
              <h2 className="headline-sm text-primary">The Atelier Story</h2>
              <p className="body-md mt-3 whitespace-pre-line text-on-surface-variant">
                {service.description}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-surface-container-high pt-5 sm:grid-cols-4">
                {[
                  { icon: "category", label: "Discipline", value: service.category },
                  { icon: "location_on", label: "Destination", value: service.location },
                  { icon: "sell", label: "From", value: formatPrice(service.price) },
                  {
                    icon: "verified",
                    label: "Status",
                    value: service.isActive ? "Available" : "Paused",
                  },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <span className="material-symbols-outlined text-[22px] text-secondary">
                      {item.icon}
                    </span>
                    <p className="label-editorial mt-1 text-[9px] text-on-surface-variant">
                      {item.label}
                    </p>
                    <p className="body-sm font-semibold text-on-surface">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low p-6 shadow-editorial">
              <span className="label-editorial text-secondary">Presented by</span>
              <div className="mt-4 flex items-center gap-4">
                {service.vendor?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.vendor.image}
                    alt={vendorName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed/40 font-display text-lg text-secondary">
                    {initials(vendorName)}
                  </span>
                )}
                <div>
                  <h3 className="headline-sm text-primary">{vendorName}</h3>
                  {service.vendor?.contactName && (
                    <p className="body-sm text-on-surface-variant">
                      Contact: {service.vendor.contactName}
                    </p>
                  )}
                  <span className="badge-gold mt-2">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Yesly verified artisan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-editorial-lg">
              <div className="mb-5">
                <span className="label-editorial text-secondary">Reserve this atelier</span>
                <h2 className="headline-md mt-1 text-primary">Request a Booking</h2>
                <p className="body-sm mt-1 text-on-surface-variant">
                  Share your date and venue. The vendor accepts or declines from their
                  dashboard — no payment is taken here.
                </p>
              </div>

              {success ? (
                <div className="rounded-lg bg-[#e6f2e5] p-5 text-center">
                  <span className="material-symbols-outlined text-[30px] text-[#2f6b3a]">
                    mark_email_read
                  </span>
                  <p className="headline-sm mt-2 text-primary">Request submitted</p>
                  <p className="body-sm mt-1 text-on-surface-variant">
                    Track the status of this request under My Bookings.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link href="/dashboard/customer/bookings" className="btn btn-primary btn-sm">
                      View My Bookings
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSuccess(false)}
                    >
                      Send another request
                    </button>
                  </div>
                </div>
              ) : !user ? (
                authLoading ? (
                  <div className="flex items-center justify-center rounded-lg bg-surface-container-low px-5 py-8">
                    <span className="body-sm text-on-surface-variant">
                      Checking your account…
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg bg-surface-container-low p-5 text-center">
                    <span className="material-symbols-outlined text-[26px] text-secondary">
                      lock
                    </span>
                    <p className="body-sm mt-2 text-on-surface-variant">
                      Sign in with a couple account to request this date. You can
                      browse every atelier without one.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href={`/sign-in?redirect=${encodeURIComponent(
                          `/services/${params.id}`,
                        )}`}
                        className="btn btn-primary btn-sm"
                      >
                        Sign in to book
                      </Link>
                      <Link
                        href={`/sign-up?redirect=${encodeURIComponent(
                          `/services/${params.id}`,
                        )}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Create a couple account
                      </Link>
                    </div>
                  </div>
                )
              ) : isAdmin ? (
                <div className="rounded-lg bg-surface-container-low p-5 text-center">
                  <span className="material-symbols-outlined text-[26px] text-secondary">
                    admin_panel_settings
                  </span>
                  <p className="body-sm mt-2 text-on-surface-variant">
                    Admin accounts cannot submit customer booking requests. Manage this
                    listing from the admin dashboard.
                  </p>
                  <Link href="/dashboard/admin/services" className="btn btn-ghost btn-sm mt-4">
                    Manage services
                  </Link>
                </div>
              ) : isVendor ? (
                <div className="rounded-lg bg-surface-container-low p-5 text-center">
                  <span className="material-symbols-outlined text-[26px] text-secondary">
                    storefront
                  </span>
                  <p className="body-sm mt-2 text-on-surface-variant">
                    {isOwner
                      ? "This is your own service, so you cannot book it. Manage it from your vendor dashboard."
                      : "Vendor accounts cannot submit customer booking requests. Sign in with a couple account to book."}
                  </p>
                  <Link
                    href={isOwner ? "/dashboard/vendor/services" : "/services"}
                    className="btn btn-ghost btn-sm mt-4"
                  >
                    {isOwner ? "Manage my services" : "Keep browsing"}
                  </Link>
                </div>
              ) : (
                <form onSubmit={submitBooking} className="flex flex-col gap-4">
                  <div>
                    <label className="field-label" htmlFor="event-date">
                      Event Date
                    </label>
                    <input
                      id="event-date"
                      type="date"
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      value={eventDate}
                      onChange={(event) => setEventDate(event.target.value)}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="event-location">
                      Event Location
                    </label>
                    <input
                      id="event-location"
                      type="text"
                      required
                      value={eventLocation}
                      onChange={(event) => setEventLocation(event.target.value)}
                      className="field"
                      placeholder="Venue name, city"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="event-message">
                      Additional Message
                    </label>
                    <textarea
                      id="event-message"
                      rows={4}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="field resize-none"
                      placeholder="Tell the atelier about your celebration, guest count or vision…"
                    />
                  </div>

                  {formError && (
                    <p className="rounded-lg bg-error-container px-3 py-2 text-xs text-error">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full py-3.5"
                  >
                    {submitting ? "Sending request…" : "Submit Booking Request"}
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </button>
                  <p className="text-center text-[11px] text-outline">
                    You must be signed in as a customer. Duplicate active requests for the
                    same date are prevented.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
