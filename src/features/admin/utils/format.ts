import { APP_LANG } from "@/src/constants";

const dateFormatter = new Intl.DateTimeFormat(APP_LANG, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/** Same output on server and client (fixed locale), so no hydration mismatch. */
export const formatDate = (date: Date) => dateFormatter.format(date);

export const fullName = (user: { firstName: string; lastName: string }) =>
  `${user.firstName} ${user.lastName}`;

export const initials = (user: { firstName: string; lastName: string }) =>
  `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
