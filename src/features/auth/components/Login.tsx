"use client";

import { DsBox, DsTypography } from "@/src/components";
import { LoginForm } from "./LoginForm";

export const Login = () => {
  return (
    <DsBox variant="card" className="w-full max-w-sm p-6 space-y-6">
      <DsBox className="w-20 h-20 rounded-lg">
        <DsTypography>Logo</DsTypography>
      </DsBox>
      <LoginForm />
    </DsBox>
  );
};
