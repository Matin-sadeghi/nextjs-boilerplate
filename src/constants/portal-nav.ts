import {
  ChartLine,
  FileText,
  HomeIcon,
  IdCard,
  UsersRound,
} from "lucide-react";
import { DsNavSectionConfig } from "../types";
import { ROUTES } from "./routes";

export const NAV_SECTIONS: DsNavSectionConfig[] = [
  {
    title: "WORKSPACE",
    items: [
      { name: "Home", href: ROUTES.DASHBOARD.HOME, icon: HomeIcon },
      { name: "Home", href: ROUTES.DASHBOARD.HOME, icon: ChartLine },
      {
        name: "Home",
        href: ROUTES.DASHBOARD.HOME,
        icon: FileText,
      },
      {
        name: "Home",
        href: ROUTES.DASHBOARD.HOME,
        icon: FileText,
      },
      {
        name: "Home",
        href: ROUTES.DASHBOARD.HOME,
        icon: FileText,
      },
    ],
  },
  {
    title: "TOOLS",
    items: [
      {
        name: "Home",
        href: ROUTES.DASHBOARD.HOME,
        icon: UsersRound,
      },
      {
        name: "Home",
        href: ROUTES.DASHBOARD.HOME,
        icon: IdCard,
      },
    ],
  },
];

export type UserNavItem =
  | { name: string; href: string }
  | { name: string; action: "logout" };

export const USER_NAVIGATION: UserNavItem[] = [
  { name: "Your profile", href: ROUTES.DASHBOARD.HOME },
  { name: "Sign out", action: "logout" },
];

export const NOTIFICATION_COUNT = 5;
