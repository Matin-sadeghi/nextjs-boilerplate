import { AuthLayout, DsBox } from "@/src/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup/Signin",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout>
      <DsBox className="flex min-h-dvh flex-col">
        <DsBox className="flex grow items-center justify-center p-6 lg:rounded-lg">
          {children}
        </DsBox>
      </DsBox>
    </AuthLayout>
  );
}
