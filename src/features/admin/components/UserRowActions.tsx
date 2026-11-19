"use client";
import {
  MoreHorizontal,
  Pencil,
  ShieldBan,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  DsButton,
  DsDropdownMenu,
  DsDropdownMenuContent,
  DsDropdownMenuItem,
  DsDropdownMenuSeparator,
  DsDropdownMenuTrigger,
} from "@/src/components";
import type { AdminUser } from "../types";
import { fullName } from "../utils";

export type UserRowActionsHandlers = {
  onEdit: (user: AdminUser) => void;
  onToggleSuspend: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UserRowActions({
  user,
  onEdit,
  onToggleSuspend,
  onDelete,
}: UserRowActionsHandlers & { user: AdminUser }) {
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
        <DsDropdownMenuItem onSelect={() => onEdit(user)}>
          <Pencil /> Edit
        </DsDropdownMenuItem>
        <DsDropdownMenuItem onSelect={() => onToggleSuspend(user)}>
          {suspended ? <ShieldCheck /> : <ShieldBan />}
          {suspended ? "Activate" : "Suspend"}
        </DsDropdownMenuItem>
        <DsDropdownMenuSeparator />
        <DsDropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(user)}
        >
          <Trash2 /> Delete
        </DsDropdownMenuItem>
      </DsDropdownMenuContent>
    </DsDropdownMenu>
  );
}
