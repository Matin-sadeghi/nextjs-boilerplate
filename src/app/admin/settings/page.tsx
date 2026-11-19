import type { Metadata } from "next";
import { DsPageHeader } from "@/src/components";
import { SettingsForms } from "@/src/features/admin";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <>
      <DsPageHeader title="Settings" description="Manage your profile and preferences." />
      <SettingsForms />
    </>
  );
}
