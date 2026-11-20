"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { authClient, signIn, signUp } from "@/lib/auth-client";
import {
  ApiError,
  clearApiSession,
  errorMessage,
  getApiSession,
  uploadImageFile,
} from "@/lib/api";
import type { Role } from "@/lib/types";

const roleOptions: { value: Role; title: string; copy: string; icon: string }[] = [
  {
    value: "customer",
    title: "Couple / Customer",
    copy: "Discover ateliers and request wedding bookings.",
    icon: "favorite",
  },
  {
    value: "vendor",
    title: "Vendor / Atelier",
    copy: "Publish services and manage booking requests.",
    icon: "storefront",
  },
];

function passwordIssue(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Better Auth reports an OAuth failure by redirecting back with ?error=<code>. */
function oauthErrorMessage(code: string | null) {
  if (!code) return null;
  const messages: Record<string, string> = {
    account_not_linked:
      "This email already has a Yesly account. Sign in with your password first, then link Google again.",
    access_denied:
      "Google sign-in was cancelled or blocked for this app. Try again, or use email and password.",
    state_mismatch: "The Google sign-in session expired. Please try again.",
    please_restart_the_process: "The Google sign-in session expired. Please try again.",
    invalid_code: "Google did not return a valid code. Please try again.",
    signup_disabled: "New accounts are not being accepted right now.",
  };
  return messages[code] || "Google sign-in could not be completed. Please try again.";
}

/**
 * Only same-origin paths are valid destinations. A protocol-relative URL such
 * as `//evil.tld` starts with "/" but browsers treat it as another origin.
 */
function safeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  return value;
}

export function AuthPanel({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh, user, loading: authLoading } = useAuth();
  const redirect = params.get("redirect");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(
    params.get("role") === "vendor" ? "vendor" : "customer",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    oauthErrorMessage(params.get("error")),
  );
  const [success, setSuccess] = useState<string | null>(null);

  const isSignIn = mode === "signin";

  // A browser that already holds a session (a finished Google redirect, a
  // second tab, or a stale link to /sign-in) must be sent on to its dashboard
  // instead of being left sitting on the form.
  useEffect(() => {
    if (authLoading || !user) return;
    const next = safeRedirect(redirect);
    const destination =
      next && !/^\/sign-(in|up)/.test(next) ? next : `/dashboard/${user.role}`;
    router.replace(destination);
  }, [authLoading, user, redirect, router]);

  const finish = async () => {
    clearApiSession();
    let session = null;
    try {
      await refresh();
      session = await getApiSession();
      if (!session) session = await getApiSession(true);
    } catch {
      // The account already exists at this point. A session hiccup must not be
      // reported as a failed sign-up; the next page load resolves it again.
    }
    const destination =
      safeRedirect(redirect) ||
      (session?.user
        ? `/dashboard/${(session.user as { role?: string }).role || "customer"}`
        : "/dashboard");
    router.replace(destination);
    router.refresh();
  };

  const toggleParams = new URLSearchParams();
  const safeDestination = safeRedirect(redirect);
  if (safeDestination) toggleParams.set("redirect", safeDestination);
  if (role === "vendor" || params.get("role") === "vendor") {
    toggleParams.set("role", "vendor");
  }
  const toggleHref = `${isSignIn ? "/sign-up" : "/sign-in"}${
    toggleParams.toString() ? `?${toggleParams.toString()}` : ""
  }`;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isSignIn) {
        if (!email.trim() || !password) {
          setError("Enter your email and password");
          return;
        }
        if (!EMAIL_PATTERN.test(email.trim())) {
          setError("Enter a valid email address");
          return;
        }
        const result = await signIn.email({
          email: email.trim(),
          password,
          rememberMe: true,
        });
        if (result.error) {
          setError(result.error.message || "Email or password does not match our registry");
          return;
        }
        clearApiSession();
        setSuccess("Identity verified. Opening your dashboard…");
        toast.success("Welcome back to Yesly");
        await finish();
        return;
      }

      const issue = passwordIssue(password);
      if (name.trim().length < 2) {
        setError("Please enter your full name");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email address");
        return;
      }
      if (!EMAIL_PATTERN.test(email.trim())) {
        setError("Enter a valid email address");
        return;
      }
      if (issue) {
        setError(issue);
        return;
      }

      let image: string | undefined;
      if (imageFile) {
        try {
          image = await uploadImageFile(imageFile, { avatar: true });
        } catch (uploadError) {
          setError(errorMessage(uploadError));
          return;
        }
      }

      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image,
        role,
      });
      if (result.error) {
        setError(result.error.message || "Registration could not be completed");
        return;
      }

      clearApiSession();
      setSuccess("Account created. Preparing your dashboard…");
      toast.success(
        role === "vendor" ? "Vendor account created" : "Couple account created",
      );
      await finish();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    try {
      // A session cookie left over from an earlier visit (a different account,
      // or one whose user no longer exists) survives a browser restart and can
      // shadow the new sign-in, which a fresh incognito window never has.
      // Clearing it first makes the Google flow behave the same in both.
      await authClient.signOut().catch(() => undefined);
      clearApiSession();

      const result = await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/dashboard`,
        // Errors must come back to the sign-in page so they can be shown
        // instead of silently returning the visitor to the home page.
        errorCallbackURL: `${window.location.origin}/sign-in`,
      });
      if (result?.error) {
        setError(
          result.error.message ||
            "Google sign-in is not configured yet. Use email and password.",
        );
      }
    } catch {
      setError("Google sign-in is not configured yet. Use email and password.");
    }
  };

  return (
    <div className="container-editorial py-12 lg:py-16">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="label-editorial text-secondary">
              Sanctuary of High Bridal Craft
            </span>
          </div>
          <h1 className="headline-lg tracking-tight text-on-surface">
            The Yesly Salon &amp; Atelier Guild
          </h1>
        </div>
        <p className="editorial-quote max-w-md italic text-on-surface-variant">
          &ldquo;Where eternal vows meet the vanguard of bespoke couture, floristry, and
          historic châteaux.&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-editorial-xl ring-1 ring-primary/[0.05] sm:p-10">
            <div className="mb-8 flex items-center justify-between rounded-full bg-surface-container-low p-1">
              <Link
                href={`/sign-in${toggleParams.toString() ? `?${toggleParams.toString()}` : ""}`}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 sm:px-4 sm:text-[11px] sm:tracking-[0.14em] ${
                  isSignIn
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined hidden text-[15px] sm:inline">lock_open</span>
                Sign In
              </Link>
              <Link
                href={`/sign-up${toggleParams.toString() ? `?${toggleParams.toString()}` : ""}`}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 sm:px-4 sm:text-[11px] sm:tracking-[0.14em] ${
                  !isSignIn
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined hidden text-[15px] sm:inline">how_to_reg</span>
                Create an Account
              </Link>
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                <span aria-hidden className="h-px w-6 bg-secondary/60" />
                {isSignIn ? "Welcome Back" : "Join the Guild"}
              </span>
              <h2 className="headline-md mt-3 text-balance tracking-tight text-on-surface">
                {isSignIn ? "Access Your Atelier Suite" : "Create Your Yesly Account"}
              </h2>
              <p className="body-sm mt-2.5 max-w-md leading-relaxed text-on-surface-variant">
                {isSignIn
                  ? "Enter your credentials to view bookings, contracts and curated portfolios."
                  : "Register as a couple to book ateliers, or as a vendor to publish your services."}
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-lg bg-error-container p-4 text-on-error-container">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-error">
                  error
                </span>
                <div>
                  <p className="text-sm font-semibold text-error">Authentication issue</p>
                  <p className="body-sm text-on-error-container">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-lg bg-surface-container-low p-4">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-secondary">
                  verified
                </span>
                <div>
                  <p className="text-sm font-semibold text-secondary">
                    Verified Atelier Identity
                  </p>
                  <p className="body-sm text-on-surface-variant">{success}</p>
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {!isSignIn && (
                <div>
                  <label className="field-label" htmlFor="auth-name">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                      person
                    </span>
                    <input
                      id="auth-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="field rounded-xl border-surface-container-high bg-surface-container-lowest py-3.5 pl-11"
                      placeholder="Charlotte Vane"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="field-label" htmlFor="auth-email">
                  Correspondence Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                    mail
                  </span>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                                          className="field rounded-xl border-surface-container-high bg-surface-container-lowest py-3.5 pl-11"
                      placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="field-label mb-0" htmlFor="auth-password">
                    Passcode
                  </label>
                  <span className="text-[11px] text-secondary">
                    Min. 6 chars, upper &amp; lower case
                  </span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                    lock
                  </span>
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="field rounded-xl border-surface-container-high bg-surface-container-lowest py-3.5 pl-11 pr-12"
                    placeholder="••••••••••••"
                    autoComplete={isSignIn ? "current-password" : "new-password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-outline transition-colors hover:text-on-surface"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {!isSignIn && (
                <>
                  <div>
                    <span className="field-label">Account Role</span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {roleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={`flex items-start gap-3 rounded-lg border p-3.5 text-left transition-all ${
                            role === option.value
                              ? "border-primary bg-surface-container-low shadow-sm"
                              : "border-surface-container-high bg-surface hover:bg-surface-container-low"
                          }`}
                          aria-pressed={role === option.value}
                        >
                          <span className="material-symbols-outlined text-[20px] text-secondary">
                            {option.icon}
                          </span>
                          <span>
                            <span className="block text-[13px] font-semibold text-on-surface">
                              {option.title}
                            </span>
                            <span className="block text-[11px] text-on-surface-variant">
                              {option.copy}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-outline">
                      Admin accounts are assigned securely by the platform and cannot be
                      created here.
                    </p>
                  </div>

                  <div>
                    <span className="field-label">Profile Image (optional)</span>
                    <div className="flex items-center gap-4">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-outline">
                          <span className="material-symbols-outlined text-[20px]">
                            add_a_photo
                          </span>
                        </span>
                      )}
                      <label className="btn btn-ghost btn-sm cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">
                          upload
                        </span>
                        Choose image
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setImageFile(file);
                            setImagePreview(file ? URL.createObjectURL(file) : null);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary mt-1 w-full rounded-full py-3.5 text-[12px] uppercase tracking-[0.18em]"
              >
                {submitting
                  ? "Verifying…"
                  : isSignIn
                    ? "Enter Sanctuary"
                    : "Create Account"}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              <div className="relative my-2 flex items-center justify-center">
                <div className="h-px w-full bg-surface-container-high" />
                <span className="absolute bg-surface-container-lowest px-4 text-[9px] uppercase tracking-[0.22em] text-outline">
                  Or authenticate with
                </span>
              </div>

              <button
                type="button"
                onClick={onGoogle}
                className="btn w-full rounded-full border border-surface-container-high bg-surface-container-lowest py-3 text-[12px] font-semibold tracking-[0.04em] text-on-surface shadow-sm transition-all duration-300 hover:-translate-y-px hover:border-secondary/40 hover:bg-surface-container-low hover:shadow-editorial"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                  <svg
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    focusable="false"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                </span>
                Continue with Google
              </button>

              <p className="text-center text-[11px] text-on-surface-variant">
                {isSignIn ? "New to Yesly? " : "Already registered? "}
                <Link
                  href={toggleHref}
                  className="link-quiet ml-1 font-semibold text-secondary hover:text-on-surface"
                >
                  {isSignIn ? "Create an account" : "Sign in instead"}
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="relative hidden overflow-hidden rounded-2xl ring-1 ring-primary/[0.06] lg:col-span-5 lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
            alt="Editorial wedding celebration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/35 to-primary/10" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary-fixed">
              <span aria-hidden className="h-px w-6 bg-secondary-fixed/60" />
              The Yesly Standard
            </span>
            <p className="editorial-quote mt-4 text-[17px] leading-relaxed italic text-surface">
              &ldquo;Every atelier in our directory is reviewed for artistry, reliability
              and the quiet confidence of a celebration composed perfectly.&rdquo;
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-surface-variant">
              {[
                { icon: "verified_user", label: "Vetted ateliers" },
                { icon: "shield", label: "Secure accounts" },
                { icon: "support_agent", label: "Concierge support" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
