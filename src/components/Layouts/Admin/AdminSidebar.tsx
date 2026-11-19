"use client";
import {
  ChevronsUpDown,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAME, NAV_SECTIONS, USER_NAVIGATION } from "@/src/constants";
import { useCurrentUser, useLogout } from "@/src/features/auth/hooks";
import { useThemeStore } from "@/src/stores";
import { DsAvatar, DsAvatarFallback } from "../../Avatar";
import {
  DsDropdownMenu,
  DsDropdownMenuContent,
  DsDropdownMenuGroup,
  DsDropdownMenuItem,
  DsDropdownMenuLabel,
  DsDropdownMenuSeparator,
  DsDropdownMenuTrigger,
} from "../../DropdownMenu";
import {
  DsSidebar,
  DsSidebarContent,
  DsSidebarFooter,
  DsSidebarGroup,
  DsSidebarGroupContent,
  DsSidebarGroupLabel,
  DsSidebarHeader,
  DsSidebarMenu,
  DsSidebarMenuBadge,
  DsSidebarMenuButton,
  DsSidebarMenuItem,
  DsSidebarRail,
  useDsSidebar,
} from "../../Sidebar";
import { getInitials, isNavItemActive } from "./admin-nav";

function AdminUserMenu() {
  const { user } = useCurrentUser();
  const { logout, isPending } = useLogout();
  const { theme, toggleTheme } = useThemeStore();
  const { isMobile } = useDsSidebar();

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "User";
  const initials = getInitials(
    user?.first_name,
    user?.last_name,
    user?.email?.[0]?.toUpperCase(),
  );

  const identity = (
    <>
      <DsAvatar className="rounded-lg">
        <DsAvatarFallback className="rounded-lg bg-primary-soft text-primary">
          {initials}
        </DsAvatarFallback>
      </DsAvatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-medium">{fullName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user?.email}
        </span>
      </div>
    </>
  );

  return (
    <DsSidebarMenu>
      <DsSidebarMenuItem>
        <DsDropdownMenu>
          <DsDropdownMenuTrigger asChild>
            <DsSidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              {identity}
              <ChevronsUpDown className="ms-auto" />
            </DsSidebarMenuButton>
          </DsDropdownMenuTrigger>
          <DsDropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DsDropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                {identity}
              </div>
            </DsDropdownMenuLabel>
            <DsDropdownMenuSeparator />
            <DsDropdownMenuGroup>
              {USER_NAVIGATION.map((item) =>
                "href" in item ? (
                  <DsDropdownMenuItem key={item.name} asChild>
                    <Link href={item.href}>
                      <UserRound /> {item.name}
                    </Link>
                  </DsDropdownMenuItem>
                ) : null,
              )}
              <DsDropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  toggleTheme();
                }}
              >
                {theme === "dark" ? <Sun /> : <Moon />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </DsDropdownMenuItem>
            </DsDropdownMenuGroup>
            <DsDropdownMenuSeparator />
            {USER_NAVIGATION.map((item) =>
              "action" in item && item.action === "logout" ? (
                <DsDropdownMenuItem
                  key={item.name}
                  variant="destructive"
                  disabled={isPending}
                  onSelect={logout}
                >
                  <LogOut /> {item.name}
                </DsDropdownMenuItem>
              ) : null,
            )}
          </DsDropdownMenuContent>
        </DsDropdownMenu>
      </DsSidebarMenuItem>
    </DsSidebarMenu>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useDsSidebar();
  // Close the drawer after navigating on phones.
  const closeOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <DsSidebar collapsible="icon" variant="inset">
      <DsSidebarHeader>
        <DsSidebarMenu>
          <DsSidebarMenuItem>
            <DsSidebarMenuButton size="lg" asChild>
              <Link
                href={NAV_SECTIONS[0]?.items[0]?.href ?? "/"}
                onClick={closeOnMobile}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-card-sm">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">{APP_NAME}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Management
                  </span>
                </div>
              </Link>
            </DsSidebarMenuButton>
          </DsSidebarMenuItem>
        </DsSidebarMenu>
      </DsSidebarHeader>

      <DsSidebarContent>
        {NAV_SECTIONS.map((section) => (
          <DsSidebarGroup key={section.title}>
            <DsSidebarGroupLabel>{section.title}</DsSidebarGroupLabel>
            <DsSidebarGroupContent>
              <DsSidebarMenu>
                {section.items.map((item) => {
                  const active = isNavItemActive(item, pathname);
                  return (
                    <DsSidebarMenuItem key={item.href}>
                      <DsSidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.name}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeOnMobile}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </Link>
                      </DsSidebarMenuButton>
                      {item.unread ? (
                        <DsSidebarMenuBadge>{item.unread}</DsSidebarMenuBadge>
                      ) : null}
                    </DsSidebarMenuItem>
                  );
                })}
              </DsSidebarMenu>
            </DsSidebarGroupContent>
          </DsSidebarGroup>
        ))}
      </DsSidebarContent>

      <DsSidebarFooter>
        <AdminUserMenu />
      </DsSidebarFooter>
      <DsSidebarRail />
    </DsSidebar>
  );
}
