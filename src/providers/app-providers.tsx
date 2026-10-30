"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { createQueryClient } from "../api";
import { ROUTES } from "../constants";
import { useThemeStore } from "../stores";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // One client per browser session / server request, never shared between users.
  const [queryClient] = useState(() =>
    createQueryClient({
      onUnauthorized: () => router.replace(ROUTES.SIGNUP),
      onForbidden: () => router.replace(ROUTES.FORBIDDEN),
    }),
  );

  useEffect(() => {
    void useThemeStore.persist.rehydrate();
  }, []);

  return (
    <>
      <Toaster richColors position="top-center" closeButton duration={4000} />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
