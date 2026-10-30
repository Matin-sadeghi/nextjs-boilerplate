import { api } from "@/src/api";
import type { AuthUser } from "../types";
import { API_ENDPOINTS } from "@/src/api/api-endpoints";

export const currentUserApi = () => api.get<AuthUser>(API_ENDPOINTS.auth.me);

export const logoutApi = () => api.post<never>(API_ENDPOINTS.auth.logout);
