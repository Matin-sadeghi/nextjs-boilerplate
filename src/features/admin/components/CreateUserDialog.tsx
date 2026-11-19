"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";

import {
  DsButton,
  DsCustomDialog,
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

const FORM_ID = "create-user-form";

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
    <DsCustomDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
      trigger={
        <DsButton>
          <UserPlus /> Add user
        </DsButton>
      }
      title="Add user"
      description="They will get access with the role you choose."
      confirmText="Add user"
      formId={FORM_ID}
      className="sm:max-w-md"
    >
      <DsForm
        id={FORM_ID}
        form={form}
        onSubmit={(data) => {
          onCreate(data);
          setOpen(false);
          form.reset();
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <DsFormInput name="firstName" label="First name" autoComplete="off" />
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
      </DsForm>
    </DsCustomDialog>
  );
}
