import { LayoutDashboard, Palette, Settings, UsersRound } from "lucide-react";
import { DsNavSectionConfig } from "../types";
import { ROUTES } from "./routes";

/** Admin sidebar navigation. Also feeds the header breadcrumb and the ⌘K search. */
export const NAV_SECTIONS: DsNavSectionConfig[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: ROUTES.ADMIN.HOME, icon: LayoutDashboard, match: "exact" },
      { name: "Users", href: ROUTES.ADMIN.USERS, icon: UsersRound },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Settings", href: ROUTES.ADMIN.SETTINGS, icon: Settings },
      { name: "UI kit", href: ROUTES.UI_KIT, icon: Palette },
    ],
  },
];

export type UserNavItem =
  | { name: string; href: string }
  | { name: string; action: "logout" };

export const USER_NAVIGATION: UserNavItem[] = [
  { name: "Your profile", href: ROUTES.ADMIN.SETTINGS },
  { name: "Sign out", action: "logout" },
];

export const NOTIFICATION_COUNT = 5;

/** App name shown in the sidebar header. */
export const APP_NAME = "Admin Panel";
