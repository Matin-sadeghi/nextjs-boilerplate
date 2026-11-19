import { NAV_SECTIONS } from "@/src/constants";
import type { DsNavItem } from "@/src/types";

const allItems = NAV_SECTIONS.flatMap((section) => section.items);

/** `exact` items match only their own path; others also match sub-pages (/admin/users/42). */
export function isNavItemActive(item: DsNavItem, pathname: string) {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Breadcrumb trail for a path, using nav names where a segment matches a nav item. */
export function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const item = allItems.find((navItem) => navItem.href === href);
    const label =
      item?.name ??
      decodeURIComponent(segment)
        .replace(/[-_]/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
    return { href, label };
  });
}

export function getInitials(
  firstName?: string,
  lastName?: string,
  fallback = "?",
) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  return initials || fallback;
}
