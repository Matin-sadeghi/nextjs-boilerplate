import { DsAvatar, DsAvatarFallback, DsBadge } from "@/src/components";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "../types";
import { fullName, initials } from "../utils";

export function UserCell({ user }: { user: AdminUser }) {
  return (
    <div className="flex items-center gap-3">
      <DsAvatar size="sm">
        <DsAvatarFallback className="bg-primary-soft text-xs text-primary">
          {initials(user)}
        </DsAvatarFallback>
      </DsAvatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-foreground">
          {fullName(user)}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
    </div>
  );
}

const roleLabels: Record<AdminUserRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export function UserRoleBadge({ role }: { role: AdminUserRole }) {
  return (
    <DsBadge
      variant={
        role === "admin"
          ? "brand"
          : role === "editor"
            ? "tertiary"
            : "secondary"
      }
    >
      {roleLabels[role]}
    </DsBadge>
  );
}

const statusVariant = {
  active: "success",
  invited: "info",
  suspended: "destructive",
} as const satisfies Record<AdminUserStatus, string>;

const statusLabels: Record<AdminUserStatus, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};

export function UserStatusBadge({ status }: { status: AdminUserStatus }) {
  return (
    <DsBadge variant={statusVariant[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </DsBadge>
  );
}
