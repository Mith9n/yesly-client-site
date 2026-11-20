"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import { ApiError, clearApiSession, getApiSession } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  blockedMessage: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  blockedMessage: null,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  // Only the newest session lookup may write state; older responses that land
  // late are discarded instead of overwriting a fresher role/logout.
  const requestRef = useRef(0);

  const resolve = useCallback(async (
    force = false,
    betterAuthUser?: Record<string, unknown>,
  ) => {
    const requestId = ++requestRef.current;
    const fallbackUser = betterAuthUser
      ? ({
          id: String(betterAuthUser.id ?? ""),
          name: String(betterAuthUser.name ?? ""),
          email: String(betterAuthUser.email ?? ""),
          image: (betterAuthUser.image as string | null | undefined) ?? null,
          role:
            betterAuthUser.role === "vendor" || betterAuthUser.role === "admin"
              ? betterAuthUser.role
              : "customer",
          isBlocked: betterAuthUser.isBlocked === true,
          businessName:
            (betterAuthUser.businessName as string | null | undefined) ?? null,
          subscriptionPlan:
            betterAuthUser.subscriptionPlan === "premium" ? "premium" : "free",
          subscriptionExpiresAt:
            (betterAuthUser.subscriptionExpiresAt as string | null | undefined) ??
            null,
          createdAt:
            (betterAuthUser.createdAt as string | undefined) ?? undefined,
        } satisfies User)
      : null;
    try {
      const apiSession = await getApiSession(force);
      if (requestId !== requestRef.current) return;
      const apiUser = apiSession?.user as User | null | undefined;
      setUser(apiUser ?? fallbackUser);
      setBlockedMessage(null);
    } catch (error) {
      if (requestId !== requestRef.current) return;
      if (error instanceof ApiError && error.status === 403) {
        setBlockedMessage(error.message);
        setUser(null);
      } else {
        setUser(fallbackUser);
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, []);

  const sessionUserId = session?.user?.id;

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;

    // Defer to a microtask so the effect body never calls setState synchronously.
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      if (!sessionUserId) {
        requestRef.current += 1;
        clearApiSession();
        setUser(null);
        setBlockedMessage(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      await resolve(
        true,
        session?.user as unknown as Record<string, unknown> | undefined,
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [isPending, sessionUserId, session?.user, resolve]);

  const refresh = useCallback(async () => {
    await refetch();
    await resolve(
      true,
      session?.user as unknown as Record<string, unknown> | undefined,
    );
  }, [refetch, resolve, session?.user]);

  const logout = useCallback(async () => {
    requestRef.current += 1;
    await authClient.signOut();
    clearApiSession();
    setUser(null);
    setBlockedMessage(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, blockedMessage, refresh, logout }),
    [user, loading, blockedMessage, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
