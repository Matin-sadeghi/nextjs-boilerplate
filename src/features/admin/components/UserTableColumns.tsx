import type { DsCustomTableColumn } from "@/src/components";
import type { AdminUser } from "../types";
import { formatDate } from "../utils";
import { UserCell, UserRoleBadge, UserStatusBadge } from "./UserBadges";

export const USER_TABLE_COLUMNS: DsCustomTableColumn<AdminUser>[] = [
  {
    name: "user",
    header: "User",
    width: "40%",
    render: (user) => <UserCell user={user} />,
  },
  {
    name: "role",
    header: "Role",
    render: (user) => <UserRoleBadge role={user.role} />,
  },
  {
    name: "status",
    header: "Status",
    render: (user) => <UserStatusBadge status={user.status} />,
  },
  {
    name: "joinedAt",
    header: "Joined",
    render: (user) => (
      <span className="text-muted-foreground">{formatDate(user.joinedAt)}</span>
    ),
  },
];
