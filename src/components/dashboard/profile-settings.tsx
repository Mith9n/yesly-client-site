"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { api, errorMessage, formatDate, initials, uploadImageFile } from "@/lib/api";

export function ProfileSettings() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [image, setImage] = useState<string | null>(user?.image || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImageFile(file);
      setImage(url);
      toast.success("Image uploaded — save changes to apply");
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = { name: name.trim(), image };
      if (user.role === "vendor") body.businessName = businessName.trim();
      await api("/api/auth/profile", { method: "PATCH", body });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      const message = errorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="label-editorial text-secondary">Personal Registry</span>
        <h1 className="headline-lg mt-1 text-on-surface">Profile Settings</h1>
        <p className="body-md mt-1 max-w-2xl text-on-surface-variant">
          Update your name, portrait and atelier identity. Your account role and
          subscription can only be changed by the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <form
          onSubmit={submit}
          className="space-y-5 rounded-xl bg-surface-container-low p-6 shadow-editorial xl:col-span-8"
        >
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary-fixed/50 font-display text-xl text-secondary">
                {initials(user.name)}
              </span>
            )}
            <div>
              <span className="field-label">Profile Image</span>
              <div className="flex flex-wrap items-center gap-2">
                <label className="btn btn-ghost btn-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {uploading ? "Uploading…" : "Replace image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={uploading}
                    onChange={(event) => handleImage(event.target.files?.[0])}
                  />
                </label>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="body-sm mt-1 text-on-surface-variant">
                Uploaded securely to ImgBB. PNG, JPG or WEBP.
              </p>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="profile-name">
              Full Name
            </label>
            <input
              id="profile-name"
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {user.role === "vendor" && (
            <div>
              <label className="field-label" htmlFor="profile-business">
                Business / Atelier Name
              </label>
              <input
                id="profile-business"
                className="field"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Maison Florale Atelier"
              />
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="profile-email">
              Email Address (read only)
            </label>
            <input
              id="profile-email"
              className="field cursor-not-allowed opacity-70"
              value={user.email}
              readOnly
            />
          </div>

          {error && (
            <div className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save Changes"}
            <span className="material-symbols-outlined text-[18px]">save</span>
          </button>
        </form>

        <div className="space-y-5 xl:col-span-4">
          <div className="rounded-xl bg-surface-container p-5 shadow-editorial">
            <span className="label-editorial font-bold text-secondary">Account Record</span>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[12px] text-on-surface-variant">Role</dt>
                <dd className="text-[12px] font-semibold text-on-surface">
                  {user.role === "admin"
                    ? "Administrator"
                    : user.role === "vendor"
                      ? "Vendor"
                      : "Customer"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[12px] text-on-surface-variant">Subscription</dt>
                <dd className="text-[12px] font-semibold text-on-surface">
                  {user.role === "vendor"
                    ? user.subscriptionPlan === "premium"
                      ? "Premium"
                      : "Free"
                    : "Not applicable"}
                </dd>
              </div>
              {user.role === "vendor" && user.subscriptionExpiresAt && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[12px] text-on-surface-variant">Renews</dt>
                  <dd className="text-[12px] font-semibold text-on-surface">
                    {formatDate(user.subscriptionExpiresAt)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[12px] text-on-surface-variant">Member since</dt>
                <dd className="text-[12px] font-semibold text-on-surface">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
            <p className="body-sm mt-4 border-t border-surface-container-high pt-3 text-on-surface-variant">
              Role and subscription status cannot be edited from profile settings.
            </p>
          </div>

          <div className="rounded-xl bg-surface-container-low p-5 shadow-editorial">
            <span className="label-editorial text-secondary">Security</span>
            <p className="body-sm mt-2 text-on-surface-variant">
              Sessions are secured with Better Auth. Blocked accounts immediately lose
              access to protected platform features, including the API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
