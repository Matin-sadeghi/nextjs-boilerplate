import { DsPageHeader } from "@/src/components";
import { DashboardOverview } from "@/src/features/admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <>
      <DsPageHeader
        title="Dashboard"
        description="An overview of your workspace."
      />
      <DashboardOverview />
    </>
  );
}
