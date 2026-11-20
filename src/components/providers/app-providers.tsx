"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "./auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        closeButton
        toastOptions={{
          style: {
            background: "#fbf9f6",
            border: "1px solid #eae8e5",
            color: "#1b1c1a",
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            borderRadius: "12px",
          },
        }}
      />
    </AuthProvider>
  );
}
