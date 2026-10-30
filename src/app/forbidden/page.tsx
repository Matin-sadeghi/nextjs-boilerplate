import type { Metadata } from "next";
import Link from "next/link";

import { DsBox, DsTypography } from "@/src/components";
import { ROUTES } from "@/src/constants";

export const metadata: Metadata = {
  title: "Access Denied",
};

export default function ForbiddenPage() {
  return (
    <DsBox className="flex min-h-[70vh] flex-col items-center justify-center space-y-5 px-6 py-16 text-center">
      <DsTypography as="span" variant="h1">
        403
      </DsTypography>
      <DsTypography variant="h3">Access Denied</DsTypography>
      <DsTypography variant="helperText">You do not have permission to view this page.</DsTypography>
      <Link
        href={ROUTES.DASHBOARD.HOME}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-(--color-primary) px-4 text-sm font-medium text-(--color-text-inverse) transition hover:opacity-90"
      >
        Back to Home
      </Link>
    </DsBox>
  );
}
