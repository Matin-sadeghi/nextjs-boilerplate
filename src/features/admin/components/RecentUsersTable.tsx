"use client";
import { DsCustomTable } from "@/src/components";
import type { AdminUser } from "../types";
import { USER_TABLE_COLUMNS } from "./UserTableColumns";

export function RecentUsersTable({ users }: { users: AdminUser[] }) {
  return (
    <DsCustomTable
      columns={USER_TABLE_COLUMNS}
      data={users}
      emptyMessage="No users yet."
    />
  );
}
