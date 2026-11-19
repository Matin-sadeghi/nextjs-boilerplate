"use client";
import Link from "next/link";

import { DsButton, DsForm, DsFormInput, DsTypography } from "@/src/components";
import { useAppForm } from "@/src/hooks";
import { useLogin } from "../hooks";
import { AuthLoginFormData, authLoginSchema } from "../types";

export const LoginForm = () => {
  const { loading, submit } = useLogin();
  const form = useAppForm(authLoginSchema);
  const onSubmit = (data: AuthLoginFormData) => {
    submit(data);
  };

  return (
    <DsForm onSubmit={onSubmit} form={form} className="grid grid-cols-1 gap-6">
      <DsTypography variant="h3" as="h1">
        Sign in to your account
      </DsTypography>
      <DsFormInput
        type="email"
        name="email"
        label="Email"
        autoComplete="email"
      />
      <DsFormInput
        type="password"
        name="password"
        label="Password"
        autoComplete="current-password"
      />
      <DsTypography variant="helperText">
        <Link href="/forgot-password" className="hover:text-primary">
          Forgot password?
        </Link>
      </DsTypography>
      <DsButton type="submit" className="w-full" loading={loading}>
        Login
      </DsButton>
    </DsForm>
  );
};
