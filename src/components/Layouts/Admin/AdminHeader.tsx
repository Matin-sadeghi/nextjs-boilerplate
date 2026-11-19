"use client";
import { Bell, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { NAV_SECTIONS, NOTIFICATION_COUNT } from "@/src/constants";
import { useThemeStore } from "@/src/stores";
import {
  DsBreadcrumb,
  DsBreadcrumbItem,
  DsBreadcrumbLink,
  DsBreadcrumbList,
  DsBreadcrumbPage,
  DsBreadcrumbSeparator,
} from "../../Breadcrumb";
import { DsButton } from "../../Button";
import {
  DsCommand,
  DsCommandDialog,
  DsCommandEmpty,
  DsCommandGroup,
  DsCommandInput,
  DsCommandItem,
  DsCommandList,
  DsCommandSeparator,
} from "../../Command";
import {
  DsDropdownMenu,
  DsDropdownMenuContent,
  DsDropdownMenuItem,
  DsDropdownMenuLabel,
  DsDropdownMenuSeparator,
  DsDropdownMenuTrigger,
} from "../../DropdownMenu";
import { DsSeparator } from "../../Separator";
import { DsSidebarTrigger } from "../../Sidebar";
import { DsTooltip, DsTooltipContent, DsTooltipTrigger } from "../../Tooltip";
import { getBreadcrumbs } from "./admin-nav";

/** ⌘K / Ctrl+K: jump to any page in the nav, or toggle the theme. */
function AdminCommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <>
      <DsButton
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-9 justify-start px-2 text-muted-foreground sm:w-56 sm:px-3"
        aria-label="Search"
      >
        <Search />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="ms-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] sm:inline">
          Ctrl K
        </kbd>
      </DsButton>

      <DsCommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Jump to a page or run a command"
      >
        <DsCommand>
          <DsCommandInput placeholder="Type a page or command…" />
          <DsCommandList>
            <DsCommandEmpty>No results.</DsCommandEmpty>
            {NAV_SECTIONS.map((section) => (
              <DsCommandGroup key={section.title} heading={section.title}>
                {section.items.map((item) => (
                  <DsCommandItem
                    key={item.href}
                    onSelect={() => run(() => router.push(item.href))}
                  >
                    <item.icon /> {item.name}
                  </DsCommandItem>
                ))}
              </DsCommandGroup>
            ))}
            <DsCommandSeparator />
            <DsCommandGroup heading="Preferences">
              <DsCommandItem onSelect={() => run(toggleTheme)}>
                {theme === "dark" ? <Sun /> : <Moon />}
                Switch to {theme === "dark" ? "light" : "dark"} mode
              </DsCommandItem>
            </DsCommandGroup>
          </DsCommandList>
        </DsCommand>
      </DsCommandDialog>
    </>
  );
}

function AdminNotifications() {
  return (
    <DsDropdownMenu>
      <DsDropdownMenuTrigger asChild>
        <DsButton
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label={`Notifications (${NOTIFICATION_COUNT})`}
        >
          <Bell />
          {NOTIFICATION_COUNT > 0 && (
            <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {NOTIFICATION_COUNT > 9 ? "9+" : NOTIFICATION_COUNT}
            </span>
          )}
        </DsButton>
      </DsDropdownMenuTrigger>
      <DsDropdownMenuContent align="end" className="w-72">
        <DsDropdownMenuLabel>Notifications</DsDropdownMenuLabel>
        <DsDropdownMenuSeparator />
        {/* Replace with real notifications from the API. */}
        {[
          "New user signed up",
          "Weekly report is ready",
          "Password changed",
        ].map((text) => (
          <DsDropdownMenuItem
            key={text}
            className="flex-col items-start gap-0.5"
          >
            <span>{text}</span>
            <span className="text-xs text-muted-foreground">Just now</span>
          </DsDropdownMenuItem>
        ))}
      </DsDropdownMenuContent>
    </DsDropdownMenu>
  );
}

export function AdminHeader() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur md:rounded-t-xl">
      <DsSidebarTrigger className="-ms-1" />
      <DsSeparator orientation="vertical" className="me-1 h-4" />

      <DsBreadcrumb className="hidden min-w-0 md:block">
        <DsBreadcrumbList>
          {crumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              {index > 0 && <DsBreadcrumbSeparator />}
              <DsBreadcrumbItem>
                {index === crumbs.length - 1 ? (
                  <DsBreadcrumbPage>{crumb.label}</DsBreadcrumbPage>
                ) : (
                  <DsBreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </DsBreadcrumbLink>
                )}
              </DsBreadcrumbItem>
            </Fragment>
          ))}
        </DsBreadcrumbList>
      </DsBreadcrumb>

      <div className="ms-auto flex items-center gap-1">
        <AdminCommandMenu />
        <DsTooltip>
          <DsTooltipTrigger asChild>
            <DsButton
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </DsButton>
          </DsTooltipTrigger>
          <DsTooltipContent>Toggle theme</DsTooltipContent>
        </DsTooltip>
        <AdminNotifications />
      </div>
    </header>
  );
}
