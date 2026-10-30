"use client";

import { DsBox, DsButton, DsTypography } from "@/src/components";
import { useHealth } from "../../features";
import { useThemeStore } from "@/src/stores";

export default function Home() {
  const { health, isLoading, isError, refetch } = useHealth();
  const { toggleTheme, theme } = useThemeStore();

  return (
    <DsBox className="flex flex-1 flex-col items-center justify-center gap-4 px-6 font-sans">
      <DsTypography as="h1" color="info">
        NextJs boilerplate
      </DsTypography>
      <DsTypography color="black" variant="body">
        {isLoading && "Checking API status…"}
        {!isLoading && isError && "Could not connect to the API"}
        {!isLoading && !isError && health
          ? `API: ${health.service} — ${health.status}`
          : null}
      </DsTypography>
      <DsButton color="blue" onClick={() => void refetch()}>
        Restart
      </DsButton>
      <DsButton value={""} color="blue" onClick={toggleTheme}>
        {theme}
      </DsButton>
    </DsBox>
  );
}
