"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, api, errorMessage, uploadImageFile } from "@/lib/api";
import { CATEGORIES, CATEGORY_META } from "@/lib/constants";
import type { Service } from "@/lib/types";
import { PageLoader } from "@/components/ui/skeletons";

export function ServiceForm({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const isEdit = Boolean(serviceId);

  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [presetImageUrl, setPresetImageUrl] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!serviceId) return;
    const load = async () => {
      try {
        const data = await api<{ service: Service }>(`/api/services/${serviceId}`);
        const service = data.service;
        setServiceName(service.serviceName);
        setCategory(service.category);
        setDescription(service.description);
        setPrice(String(service.price));
        setLocation(service.location);
        setImages(service.images || []);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [serviceId]);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    if (images.length + files.length > 6) {
      toast.error("A service can have at most 6 images");
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        uploaded.push(await uploadImageFile(file));
      }
      setImages((current) => [...current, ...uploaded]);
      toast.success("Image uploaded to the Yesly atelier");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = presetImageUrl.trim();
    if (!/^https?:\/\//.test(url)) {
      toast.error("Enter a valid image URL starting with http");
      return;
    }
    if (images.includes(url)) return;
    if (images.length >= 6) {
      toast.error("A service can have at most 6 images");
      return;
    }
    setImages((current) => [...current, url]);
    setPresetImageUrl("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLimitReached(false);

    if (serviceName.trim().length < 3) {
      setError("Service name must be at least 3 characters");
      return;
    }
    if (description.trim().length < 20) {
      setError("Please write a description of at least 20 characters");
      return;
    }
    if (!Number(price) || Number(price) <= 0) {
      setError("Enter a valid positive price");
      return;
    }
    if (location.trim().length < 2) {
      setError("Enter the service location");
      return;
    }
    if (!images.length) {
      setError("Upload at least one service image");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images,
      };

      if (isEdit) {
        await api(`/api/services/${serviceId}`, { method: "PATCH", body });
        toast.success("Service updated");
      } else {
        const data = await api<{ message: string }>("/api/services", {
          method: "POST",
          body,
        });
        toast.success(data.message || "Service submitted for review");
      }
      await refresh();
      router.push("/dashboard/vendor/services");
    } catch (err) {
      const message = errorMessage(err);
      if (err instanceof ApiError && err.code === "LIMIT_REACHED") {
        setLimitReached(true);
      }
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader label="Opening this service folio…" />;

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">
          {isEdit ? "Edit Offering" : "New Offering"}
        </span>
        <h1 className="headline-lg mt-1 text-on-surface">
          {isEdit ? "Update Wedding Service" : "Publish a Wedding Service"}
        </h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Services are submitted for curator review. Only approved and active services are
          visible to couples on the marketplace.
        </p>
      </div>

      {user?.role === "vendor" && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3 shadow-editorial">
          <span className="body-sm text-on-surface-variant">
            {user.subscriptionPlan === "premium"
              ? "Premium vendor — unlimited active services."
              : "Free plan — up to 3 active services."}
          </span>
          <Link
            href="/dashboard/vendor/subscription"
            className="text-[11px] font-semibold text-secondary hover:underline"
          >
            {user.subscriptionPlan === "premium" ? "Manage plan" : "Upgrade"}
          </Link>
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-5 rounded-xl bg-surface-container-low p-6 shadow-editorial xl:col-span-8">
          <div>
            <label className="field-label" htmlFor="service-name">
              Service Name
            </label>
            <input
              id="service-name"
              value={serviceName}
              onChange={(event) => setServiceName(event.target.value)}
              className="field"
              placeholder="e.g. Céleste Editorial Wedding Photography & Cinema"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="service-category">
                Service Category
              </label>
              <select
                id="service-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="field cursor-pointer"
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="service-price">
                Price (USD)
              </label>
              <input
                id="service-price"
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="field"
                placeholder="3800"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="service-location">
              Location
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                location_on
              </span>
              <input
                id="service-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="field pl-11"
                placeholder="Napa Valley, CA"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="service-description">
              Description
            </label>
            <textarea
              id="service-description"
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="field resize-none"
              placeholder="Describe your atelier, what is included, coverage, team and signature style…"
              required
            />
            <p className="mt-1 text-right text-[11px] text-outline">
              {description.trim().length}/20 minimum
            </p>
          </div>

          <div>
            <span className="field-label">Service Images</span>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-surface-container-high bg-surface px-4 py-8 text-center transition-colors hover:border-secondary focus-within:ring-2 focus-within:ring-secondary/50">
              <span className="material-symbols-outlined text-[28px] text-secondary">
                add_photo_alternate
              </span>
              <span className="mt-2 text-[13px] font-semibold text-on-surface">
                {uploading ? "Uploading to ImgBB…" : "Upload service images"}
              </span>
              <span className="body-sm mt-1 text-on-surface-variant">
                PNG, JPG or WEBP · up to 5MB each · max 6 images
              </span>
              <input
                ref={fileInputRef}
                id="service-images"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="sr-only"
                disabled={uploading}
                aria-label="Upload service images"
                onChange={(event) => {
                  const input = event.currentTarget;
                  const files = input.files ? Array.from(input.files) : [];
                  // Clearing the value lets the vendor re-select the same file
                  // after removing it; the File objects above stay valid.
                  input.value = "";
                  void handleFiles(files);
                }}
              />
            </label>

            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <label className="field-label" htmlFor="service-image-url">
                  Image URL
                </label>
                <input
                  id="service-image-url"
                  value={presetImageUrl}
                  onChange={(event) => setPresetImageUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className="field"
                  placeholder="https://…"
                  type="url"
                />
              </div>
              <button
                type="button"
                onClick={addImageUrl}
                className="btn btn-ghost btn-sm self-end"
              >
                Add
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container-high"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt="Service"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages((current) => current.filter((item) => item !== image))
                      }
                      className="absolute right-1.5 top-1.5 rounded-full bg-primary/80 p-1 text-on-primary transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5 xl:col-span-4">
          <div className="rounded-xl bg-surface-container-low p-6 shadow-editorial">
            <span className="label-editorial text-secondary">Submission Rules</span>
            <ul className="mt-3 space-y-2.5">
              {[
                "New services are marked Pending until a curator approves them.",
                "Rejected services are never visible to couples.",
                "Free vendors may keep a maximum of 3 active services.",
                "Every service needs at least one image and a clear description.",
              ].map((rule) => (
                <li key={rule} className="flex items-start gap-2">
                  <span className="material-symbols-outlined mt-0.5 text-[16px] text-secondary">
                    check_circle
                  </span>
                  <span className="body-sm text-on-surface-variant">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-surface-container-low p-6 shadow-editorial">
            <span className="label-editorial text-secondary">Category Preview</span>
            <div className="mt-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-secondary">
                {CATEGORY_META[category]?.icon || "auto_awesome"}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-on-surface">{category}</p>
                <p className="text-[11px] text-on-surface-variant">
                  {CATEGORY_META[category]?.blurb}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-error-container p-4 text-sm text-error">
              {error}
              {limitReached && (
                <Link
                  href="/dashboard/vendor/subscription"
                  className="mt-3 flex items-center gap-1 font-semibold underline"
                >
                  Upgrade to Premium
                  <span className="material-symbols-outlined text-[14px]">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn btn-primary w-full py-3.5"
            >
              {submitting
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Submit for Review"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <Link href="/dashboard/vendor/services" className="btn btn-ghost w-full">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
