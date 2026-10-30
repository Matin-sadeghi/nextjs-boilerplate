"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutApi } from "../api";
import { tokenStore } from "@/src/api/token-store";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: logoutApi,
    onSuccess: (res) => {
      tokenStore.clear();
      queryClient.clear();
      toast.success(res.message);
      router.replace("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    logout: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
};
