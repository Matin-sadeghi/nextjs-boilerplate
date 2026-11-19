"use client";
import { useMemo, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  ShieldBan,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  createDsColumnHelper,
  DsAlertDialog,
  DsAlertDialogAction,
  DsAlertDialogCancel,
  DsAlertDialogContent,
  DsAlertDialogDescription,
  DsAlertDialogFooter,
  DsAlertDialogHeader,
  DsAlertDialogTitle,
  DsButton,
  DsDataTable,
  DsDropdownMenu,
  DsDropdownMenuContent,
  DsDropdownMenuItem,
  DsDropdownMenuSeparator,
  DsDropdownMenuTrigger,
  DsPageHeader,
} from "@/src/components";
import { DEMO_USERS } from "../data/demo-users";
import type { AdminUser, CreateUserFormData } from "../types";
import { formatDate, fullName } from "../utils";
import { CreateUserDialog } from "./CreateUserDialog";
import { UserCell, UserRoleBadge, UserStatusBadge } from "./UserBadges";

const col = createDsColumnHelper<AdminUser>();

/** Users list with add, suspend/activate and delete. State is local demo data — swap for API mutations. */
export function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>(DEMO_USERS);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const columns = useMemo(
    () =>
      col.columns([
        col.accessor((user) => fullName(user), {
          id: "name",
          header: "User",
          cell: ({ row }) => <UserCell user={row.original} />,
        }),
        col.accessor("role", {
          header: "Role",
          cell: ({ getValue }) => <UserRoleBadge role={getValue()} />,
        }),
        col.accessor("status", {
          header: "Status",
          cell: ({ getValue }) => <UserStatusBadge status={getValue()} />,
        }),
        col.accessor("joinedAt", {
          header: "Joined",
          cell: ({ getValue }) => (
            <span className="text-muted-foreground">
              {formatDate(getValue())}
            </span>
          ),
        }),
        col.display({
          id: "actions",
          meta: { align: "end", cellClassName: "w-12" },
          cell: ({ row }) => {
            const user = row.original;
            const suspended = user.status === "suspended";
            return (
              <DsDropdownMenu>
                <DsDropdownMenuTrigger asChild>
                  <DsButton
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${fullName(user)}`}
                  >
                    <MoreHorizontal />
                  </DsButton>
                </DsDropdownMenuTrigger>
                <DsDropdownMenuContent align="end">
                  <DsDropdownMenuItem
                    onSelect={() =>
                      toast(
                        `Edit ${fullName(user)} — connect this to an edit form.`,
                      )
                    }
                  >
                    <Pencil /> Edit
                  </DsDropdownMenuItem>
                  <DsDropdownMenuItem
                    onSelect={() => {
                      setUsers((list) =>
                        list.map((item) =>
                          item.id === user.id
                            ? {
                                ...item,
                                status: suspended ? "active" : "suspended",
                              }
                            : item,
                        ),
                      );
                      toast.success(
                        `${fullName(user)} ${suspended ? "activated" : "suspended"}`,
                      );
                    }}
                  >
                    {suspended ? <ShieldCheck /> : <ShieldBan />}
                    {suspended ? "Activate" : "Suspend"}
                  </DsDropdownMenuItem>
                  <DsDropdownMenuSeparator />
                  <DsDropdownMenuItem
                    variant="destructive"
                    onSelect={() => setUserToDelete(user)}
                  >
                    <Trash2 /> Delete
                  </DsDropdownMenuItem>
                </DsDropdownMenuContent>
              </DsDropdownMenu>
            );
          },
        }),
      ]),
    [],
  );

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

      <DsDataTable
        columns={columns}
        data={users}
        getRowId={(user) => user.id}
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
