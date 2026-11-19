"use client";

import { useQuery } from "@tanstack/react-query";
import { isApiUnauthorizedError } from "@/src/api/api-error";
import { currentUserApi } from "../api";
import { authKeys } from "./auth.query-name";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const response = await currentUserApi();

      if (!response.data) {
        throw new Error("The current-user response did not include user data.");
      }

      return response.data;
    },
    // 401 is redirected to login by the query client; other errors go to error.tsx.
    throwOnError: (error) => !isApiUnauthorizedError(error),
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
