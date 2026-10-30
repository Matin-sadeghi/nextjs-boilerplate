import { API_ENDPOINTS } from "@/src/api/api-endpoints";
import { AuthLoginFormData } from "../types";
import type { AuthUser } from "../types";
import { api } from "@/src/api";

type LoginResponse = {
  user: AuthUser;
  access: string;
};

export const loginApi = async (data: AuthLoginFormData) =>
  api.post<LoginResponse>(API_ENDPOINTS.auth.login, data);
