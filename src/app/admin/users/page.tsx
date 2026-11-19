import { UsersManagement } from "@/src/features/admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <UsersManagement />;
}
