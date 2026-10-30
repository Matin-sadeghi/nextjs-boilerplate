"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ROUTES } from "@/src/constants";
import { useCurrentUser } from "@/src/features/auth/hooks";
import { DsLoading } from "../Loading";

export const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const isForbidden = Boolean(user && !user.is_staff);

  useEffect(() => {
    if (isForbidden) router.replace(ROUTES.FORBIDDEN);
  }, [isForbidden, router]);

  if (!user?.is_staff) return <DsLoading fullScreen />;

  return children;
};
