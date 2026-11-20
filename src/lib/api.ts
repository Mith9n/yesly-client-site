export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const SESSION_TTL_MS = 60 * 1000;
const DEFAULT_TIMEOUT_MS = 15 * 1000;

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type TokenCache = { token: string; user: unknown; at: number };
let cache: TokenCache | null = null;
let inflight: Promise<TokenCache | null> | null = null;

export function clearApiSession() {
  cache = null;
  inflight = null;
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

interface RequestOptions {
  /** Caller-owned cancellation (component unmount, filter change). */
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Combine the caller's signal with a hard timeout so a slow API can never hang
 * a page forever. `timedOut` lets us report a friendly message instead of a
 * bare AbortError.
 */
function createGuard(signal: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  let timedOut = false;

  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, Math.max(1000, timeoutMs));

  return {
    signal: controller.signal,
    get timedOut() {
      return timedOut;
    },
    cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

export async function getApiSession(
  force = false,
  { signal, timeoutMs = DEFAULT_TIMEOUT_MS }: RequestOptions = {},
) {
  if (!force && cache && Date.now() - cache.at < SESSION_TTL_MS) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const guard = createGuard(signal, timeoutMs);
    try {
      const response = await fetch(`${API_URL}/api/auth/session`, {
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: guard.signal,
      });

      if (!response.ok) {
        cache = null;
        if (response.status === 401) return null;
        const data = await response.json().catch(() => null);
        throw new ApiError(
          data?.message || "Unable to verify your session",
          response.status,
        );
      }

      const data = await response.json();
      cache = { token: data.token, user: data.user, at: Date.now() };
      return cache;
    } catch (error) {
      if (guard.timedOut) {
        throw new ApiError("Verifying your session timed out. Please try again.", 408);
      }
      throw error;
    } finally {
      guard.cleanup();
      inflight = null;
    }
  })();

  return inflight;
}

export async function api<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    auth?: boolean;
    signal?: AbortSignal;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = true,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const run = async (force = false) => {
    const session = auth
      ? await getApiSession(force, { signal, timeoutMs })
      : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;

    const guard = createGuard(signal, timeoutMs);
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        credentials: "include",
        cache: "no-store",
        signal: guard.signal,
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new ApiError(
          data?.message || "Request failed",
          response.status,
          data?.code,
        );
      }
      return data as T;
    } catch (error) {
      if (guard.timedOut) {
        throw new ApiError("The request timed out. Please try again.", 408);
      }
      throw error;
    } finally {
      guard.cleanup();
    }
  };

  try {
    return await run();
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      auth &&
      !signal?.aborted
    ) {
      cache = null;
      return run(true);
    }
    throw error;
  }
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "Network error — is the Yesly API running?";
  if (isAbortError(error)) return "Request cancelled";
  if (error instanceof Error) return error.message;
  return "Something unexpected happened";
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(
  file: File,
  options: { avatar?: boolean } = {},
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new ApiError("Please choose an image file", 400);
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError("Image must be smaller than 5MB", 400);
  }
  const image = await fileToDataUrl(file);
  const data = await api<{ url: string }>(
    options.avatar ? "/api/uploads/avatar" : "/api/uploads",
    { method: "POST", body: { image }, auth: !options.avatar, timeoutMs: 60_000 },
  );
  return data.url;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function initials(name?: string | null) {
  if (!name) return "YS";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
