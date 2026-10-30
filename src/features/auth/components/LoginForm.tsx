"use client";
import {
  DsBox,
  DsButton,
  DsForm,
  DsFormInput,
  DsTypography,
} from "@/src/components";
import { DsField, DsLabel } from "@/src/components/Field";

import { useAppForm } from "@/src/hooks";
import Link from "next/link";
import { useLogin } from "../hooks";
import { AuthLoginFormData, authLoginSchema } from "../types";

export const LoginForm = () => {
  const { loading, submit } = useLogin();
  const form = useAppForm(authLoginSchema);
  const onSubmit = (data: AuthLoginFormData) => {
    submit(data);
  };

  return (
    <DsForm onSubmit={onSubmit} form={form} className="grid grid-cols-1 gap-8">
      <DsTypography>Sign in to your account</DsTypography>
      <DsField>
        <DsLabel>Email</DsLabel>
        <DsFormInput type="email" name="email" />
      </DsField>
      <DsField>
        <DsLabel>Password</DsLabel>
        <DsFormInput type="password" name="password" />
      </DsField>
      <DsBox className="flex items-center justify-between">
        <DsTypography variant="helperText">
          <Link href="/forgot-password">Forgot password?</Link>
        </DsTypography>
      </DsBox>
      <DsButton type="submit" className="w-full">
        {loading ? "Loading..." : "Login"}
      </DsButton>
    </DsForm>
  );
};
