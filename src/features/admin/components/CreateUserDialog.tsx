"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";

import {
  DsButton,
  DsDialog,
  DsDialogClose,
  DsDialogContent,
  DsDialogDescription,
  DsDialogFooter,
  DsDialogHeader,
  DsDialogTitle,
  DsDialogTrigger,
  DsForm,
  DsFormInput,
  DsFormSelect,
  DsFormSwitch,
} from "@/src/components";
import { useAppForm } from "@/src/hooks";
import {
  ADMIN_ROLE_OPTIONS,
  createUserSchema,
  type CreateUserFormData,
} from "../types";

export function CreateUserDialog({
  onCreate,
}: {
  onCreate: (data: CreateUserFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const form = useAppForm(createUserSchema, {
    firstName: "",
    lastName: "",
    email: "",
    sendInvite: true,
  });

  return (
    <DsDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DsDialogTrigger asChild>
        <DsButton>
          <UserPlus /> Add user
        </DsButton>
      </DsDialogTrigger>
      <DsDialogContent className="sm:max-w-md">
        <DsDialogHeader>
          <DsDialogTitle>Add user</DsDialogTitle>
          <DsDialogDescription>
            They will get access with the role you choose.
          </DsDialogDescription>
        </DsDialogHeader>
        <DsForm
          form={form}
          onSubmit={(data) => {
            onCreate(data);
            setOpen(false);
            form.reset();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DsFormInput
              name="firstName"
              label="First name"
              autoComplete="off"
            />
            <DsFormInput name="lastName" label="Last name" autoComplete="off" />
          </div>
          <DsFormInput
            name="email"
            type="email"
            label="Email"
            autoComplete="off"
          />
          <DsFormSelect
            name="role"
            label="Role"
            placeholder="Select a role"
            options={ADMIN_ROLE_OPTIONS}
          />
          <DsFormSwitch name="sendInvite" label="Send invitation email" />
          <DsDialogFooter>
            <DsDialogClose asChild>
              <DsButton variant="outline">Cancel</DsButton>
            </DsDialogClose>
            <DsButton type="submit">Add user</DsButton>
          </DsDialogFooter>
        </DsForm>
      </DsDialogContent>
    </DsDialog>
  );
}
