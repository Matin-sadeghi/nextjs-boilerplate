"use client";

import { useQuery } from "@tanstack/react-query";

import type { HealthStatus } from "../types/health.types";
import { healthKeys } from "./health.query-name";
import { api } from "@/src/api";

export const useHealth = (enabled = true) => {
  const query = useQuery({
    queryKey: healthKeys.status(),
    queryFn: () => api.get<HealthStatus>("/health/"),
    enabled,
  });

  return {
    health: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
