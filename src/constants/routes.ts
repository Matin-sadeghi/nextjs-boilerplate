/**
 * Absolute app paths for navigation and redirects.
 * Keep in sync with `app/routes.ts`.
 */
export const ROUTES = {
  DASHBOARD: {
    HOME: "/",
  },
  ADMIN: {
    HOME: "/admin",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },
  UI_KIT: "/ui-kit",
  SIGNUP: "/login",
  FORBIDDEN: "/forbidden",
} as const;
