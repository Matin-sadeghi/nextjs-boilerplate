import Link from "next/link";
import { DsBox, DsButton, DsTypography } from "../components";

export default function NotFound() {
  return (
    <DsBox className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center space-y-5">
      <DsTypography as="span" color="muted" variant="h1">
        404
      </DsTypography>
      <DsTypography as="span" color="secondary" variant="h1">
        Page Not Found
      </DsTypography>
      <DsTypography as="span" variant="helperText">
        The page you are looking for does not exist or may have been moved.
      </DsTypography>
      <DsButton asChild>
        <Link href="/">Back to Home</Link>
      </DsButton>
    </DsBox>
  );
}
