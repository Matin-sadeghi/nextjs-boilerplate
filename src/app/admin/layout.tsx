import { AdminLayout } from "@/src/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayout>{children}</AdminLayout>;
}
