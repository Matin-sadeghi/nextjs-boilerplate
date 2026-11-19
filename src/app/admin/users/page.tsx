import type { Metadata } from "next";
import { UsersManagement } from "@/src/features/admin";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <UsersManagement />;
}
