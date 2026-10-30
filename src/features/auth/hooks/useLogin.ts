"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { tokenStore } from "@/src/api/token-store";
import { ROUTES } from "@/src/constants";
import { loginApi } from "../api";
import { AuthLoginFormData } from "../types";
import { authKeys } from "./auth.query-name";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (!res.data) {
        toast.error("The login response did not include authentication data.");
        return;
      }

      tokenStore.set(res.data.access);
      queryClient.setQueryData(authKeys.currentUser(), res.data.user);
      toast.success(res.message);
      router.replace(ROUTES.DASHBOARD.HOME);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return {
    submit: (data: AuthLoginFormData) => {
      console.log(data);
      mutation.mutate(data);
    },
    loading: mutation.isPending,
  };
};
