import { z } from "zod";

export type AdminUserRole = "admin" | "editor" | "viewer";
export type AdminUserStatus = "active" | "invited" | "suspended";

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: Date;
};

export const ADMIN_ROLE_OPTIONS: { value: AdminUserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  role: z.enum(["admin", "editor", "viewer"], { error: "Pick a role" }),
  sendInvite: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const profileSettingsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
});

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  weeklyReport: z.boolean(),
  securityAlerts: z.boolean(),
});

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;
