"use client";
import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";

import {
  DsBox,
  DsButton,
  DsForm,
  DsFormInput,
  DsFormSwitch,
  DsTypography,
} from "@/src/components";
import { useCurrentUser } from "@/src/features/auth/hooks";
import { useAppForm } from "@/src/hooks";
import { cn } from "@/src/lib/utils";
import { useThemeStore, type ThemeMode } from "@/src/stores";
import {
  notificationSettingsSchema,
  profileSettingsSchema,
  type NotificationSettingsFormData,
  type ProfileSettingsFormData,
} from "../types";

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <DsBox
      variant="card"
      padding="lg"
      shadow="sm"
      className="grid gap-6 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-1">
        <DsTypography variant="h4" as="h2">
          {title}
        </DsTypography>
        <DsTypography variant="helperText">{description}</DsTypography>
      </div>
      <div className="lg:col-span-2">{children}</div>
    </DsBox>
  );
}

/** Simulated save — replace with a React Query mutation to your API. */
const fakeSave = () => new Promise((resolve) => setTimeout(resolve, 700));

function ProfileForm() {
  const { user } = useCurrentUser();
  const form = useAppForm(profileSettingsSchema, {
    firstName: user?.first_name ?? "",
    lastName: user?.last_name ?? "",
    email: user?.email ?? "",
  });

  const onSubmit = async (data: ProfileSettingsFormData) => {
    await fakeSave();
    form.reset(data);
    toast.success("Profile updated");
  };

  return (
    <DsForm form={form} onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <DsFormInput
          name="firstName"
          label="First name"
          autoComplete="given-name"
        />
        <DsFormInput
          name="lastName"
          label="Last name"
          autoComplete="family-name"
        />
      </div>
      <DsFormInput
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
      />
      <div className="flex justify-end">
        <DsButton
          type="submit"
          loading={form.formState.isSubmitting}
          disabled={!form.formState.isDirty}
        >
          Save changes
        </DsButton>
      </div>
    </DsForm>
  );
}

function NotificationsForm() {
  const form = useAppForm(notificationSettingsSchema, {
    emailNotifications: true,
    weeklyReport: false,
    securityAlerts: true,
  });

  const onSubmit = async (data: NotificationSettingsFormData) => {
    await fakeSave();
    form.reset(data);
    toast.success("Notification settings saved");
  };

  return (
    <DsForm form={form} onSubmit={onSubmit} className="flex flex-col gap-5">
      <DsFormSwitch
        name="emailNotifications"
        label="Email notifications"
        description="Mentions, invitations and replies."
      />
      <DsFormSwitch
        name="weeklyReport"
        label="Weekly report"
        description="A summary of activity every Monday."
      />
      <DsFormSwitch
        name="securityAlerts"
        label="Security alerts"
        description="New sign-ins and password changes."
      />
      <div className="flex justify-end">
        <DsButton
          type="submit"
          loading={form.formState.isSubmitting}
          disabled={!form.formState.isDirty}
        >
          Save preferences
        </DsButton>
      </div>
    </DsForm>
  );
}

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

function AppearanceSettings() {
  const { theme, applyTheme } = useThemeStore();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="grid grid-cols-2 gap-3 sm:max-w-sm"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => applyTheme(value)}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium transition outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
            theme === value &&
              "border-primary bg-primary-soft text-primary hover:bg-primary-soft",
          )}
        >
          <Icon className="size-5" />
          {label}
        </button>
      ))}
    </div>
  );
}

export function SettingsForms() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsCard
        title="Profile"
        description="Your name and email as other people see them."
      >
        <ProfileForm />
      </SettingsCard>
      <SettingsCard
        title="Appearance"
        description="Choose how the panel looks on this device."
      >
        <AppearanceSettings />
      </SettingsCard>
      <SettingsCard
        title="Notifications"
        description="Pick what we email you about."
      >
        <NotificationsForm />
      </SettingsCard>
    </div>
  );
}
