import type { Metadata } from "next";
import { AdminAuthGuard, AdminLayout } from "@/src/components";

/**
 * Everything under /admin is rendered only after AdminAuthGuard loads the
 * current user in the browser, so the pages can't be part of the prerendered
 * static shell. Opt this subtree out of instant-navigation validation
 * (recommended for auth-gated routes in the Cache Components auth guide).
 */
export const instant = false;

export const metadata: Metadata = {
  title: {
    template: "%s · Admin",
    default: "Admin",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
