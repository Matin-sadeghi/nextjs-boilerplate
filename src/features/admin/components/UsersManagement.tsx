"use client";
import { useState } from "react";
import { toast } from "sonner";

import {
  DsAlertDialog,
  DsAlertDialogAction,
  DsAlertDialogCancel,
  DsAlertDialogContent,
  DsAlertDialogDescription,
  DsAlertDialogFooter,
  DsAlertDialogHeader,
  DsAlertDialogTitle,
  DsCustomTable,
  DsPageHeader,
} from "@/src/components";
import { DEMO_USERS } from "../data/demo-users";
import type { AdminUser, CreateUserFormData } from "../types";
import { fullName } from "../utils";
import { CreateUserDialog } from "./CreateUserDialog";
import { UserRowActions } from "./UserRowActions";
import { USER_TABLE_COLUMNS } from "./UserTableColumns";

const PAGE_SIZE = 10;

/** Users list with add, suspend/activate and delete. State is local demo data — swap for API mutations. */
export function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>(DEMO_USERS);
  const [page, setPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const toggleSuspend = (user: AdminUser) => {
    const suspended = user.status === "suspended";
    setUsers((list) =>
      list.map((item) =>
        item.id === user.id
          ? { ...item, status: suspended ? "active" : "suspended" }
          : item,
      ),
    );
    toast.success(`${fullName(user)} ${suspended ? "activated" : "suspended"}`);
  };

  const handleCreate = (data: CreateUserFormData) => {
    const user: AdminUser = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      status: data.sendInvite ? "invited" : "active",
      joinedAt: new Date(),
    };
    setUsers((list) => [user, ...list]);
    toast.success(
      `${fullName(user)} added${data.sendInvite ? " — invitation sent" : ""}`,
    );
  };

  return (
    <>
      <DsPageHeader
        title="Users"
        description={`${users.length} people have access to this workspace.`}
        actions={<CreateUserDialog onCreate={handleCreate} />}
      />

      <DsCustomTable
        columns={USER_TABLE_COLUMNS}
        data={users}
        actions={{
          render: (user) => (
            <UserRowActions
              user={user}
              onEdit={(u) =>
                toast(`Edit ${fullName(u)} — connect this to an edit form.`)
              }
              onToggleSuspend={toggleSuspend}
              onDelete={setUserToDelete}
            />
          ),
        }}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          entityLabel: "users",
          onPageChange: setPage,
        }}
      />

      <DsAlertDialog
        open={userToDelete !== null}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <DsAlertDialogContent size="sm">
          <DsAlertDialogHeader>
            <DsAlertDialogTitle>
              Delete {userToDelete ? fullName(userToDelete) : "user"}?
            </DsAlertDialogTitle>
            <DsAlertDialogDescription>
              They lose access immediately. This can’t be undone.
            </DsAlertDialogDescription>
          </DsAlertDialogHeader>
          <DsAlertDialogFooter>
            <DsAlertDialogCancel>Cancel</DsAlertDialogCancel>
            <DsAlertDialogAction
              variant="danger"
              onClick={() => {
                if (!userToDelete) return;
                setUsers((list) =>
                  list.filter((item) => item.id !== userToDelete.id),
                );
                toast.success(`${fullName(userToDelete)} deleted`);
              }}
            >
              Delete
            </DsAlertDialogAction>
          </DsAlertDialogFooter>
        </DsAlertDialogContent>
      </DsAlertDialog>
    </>
  );
}
