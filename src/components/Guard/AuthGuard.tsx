"use client";

import { useCurrentUser } from "@/src/features/auth/hooks";
import { DsLoading } from "../Loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useCurrentUser();

  if (!user) return <DsLoading fullScreen />;

  return children;
};
