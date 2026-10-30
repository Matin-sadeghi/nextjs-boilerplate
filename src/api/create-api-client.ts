import { API_ENDPOINTS } from "./api-endpoints";
import { ApiError, ApiSuccessResponse } from "./api-error";
import { tokenStore } from "./token-store";

export type ApiClient = {
  get: <TResponse>(
    path: string,
    init?: RequestInit,
  ) => Promise<ApiSuccessResponse<TResponse>>;
  post: <TResponse>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ) => Promise<ApiSuccessResponse<TResponse>>;
  put: <TResponse>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ) => Promise<ApiSuccessResponse<TResponse>>;
  patch: <TResponse>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ) => Promise<ApiSuccessResponse<TResponse>>;
  delete: <TResponse>(
    path: string,
    init?: RequestInit,
  ) => Promise<ApiSuccessResponse<TResponse>>;
};

export type CreateApiClientOptions = {
  baseUrl: string | (() => string);
  getToken?: () => string | null;
};

type RefreshResponse = {
  access: string;
};

const resolveBaseUrl = (baseUrl: string | (() => string)): string =>
  typeof baseUrl === "function" ? baseUrl() : baseUrl;

const joinUrl = (baseUrl: string, path: string): string => {
  const base = baseUrl.replace(/\/+$/, "");
  const segment = path.startsWith("/") ? path : `/${path}`;

  return `${base}${segment}`;
};

const parseJsonBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const buildHeaders = (
  init: RequestInit | undefined,
  body: unknown,
  token: string | null,
): Headers => {
  const headers = new Headers(init?.headers);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // The current token always replaces any Authorization header passed in.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return headers;
};

const getErrorMessage = (body: unknown, fallback: string): string => {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "detail" in body &&
    typeof body.detail === "string"
  ) {
    return body.detail;
  }

  return fallback || "Request failed";
};

const normalizePath = (path: string): string =>
  path.split("?")[0].replace(/\/+$/, "");

// Auth endpoints never trigger a token refresh (avoids refresh loops).
const NO_REFRESH_PATHS = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.refresh,
  API_ENDPOINTS.auth.logout,
  API_ENDPOINTS.auth.register,
].map(normalizePath);

const shouldRefreshToken = (path: string): boolean => {
  const pathname = normalizePath(path);

  return !NO_REFRESH_PATHS.some(
    (excluded) => pathname === excluded || pathname.endsWith(excluded),
  );
};

export function createApiClient({
  baseUrl,
  getToken = () => tokenStore.get(),
}: CreateApiClientOptions): ApiClient {
  let refreshPromise: Promise<string | null> | null = null;

  const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const response = await fetch(
          joinUrl(resolveBaseUrl(baseUrl), API_ENDPOINTS.auth.refresh),
          {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          tokenStore.clear();
          return null;
        }

        const envelope = (await parseJsonBody(response)) as
          | ApiSuccessResponse<Partial<RefreshResponse>>
          | undefined;
        const data = envelope?.data;

        if (!data || typeof data.access !== "string") {
          tokenStore.clear();
          return null;
        }

        tokenStore.set(data.access);

        return data.access;
      } catch {
        tokenStore.clear();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const request = async <TResponse>(
    path: string,
    init?: RequestInit,
    jsonBody?: unknown,
    alreadyRetried = false,
  ): Promise<ApiSuccessResponse<TResponse>> => {
    const token = getToken();
    const headers = buildHeaders(init, jsonBody, token);

    const response = await fetch(joinUrl(resolveBaseUrl(baseUrl), path), {
      ...init,
      headers,
      credentials: "include",
      body: jsonBody !== undefined ? JSON.stringify(jsonBody) : init?.body,
    });

    // If the access token has expired, refresh it once and retry the request.
    if (
      response.status === 401 &&
      !alreadyRetried &&
      shouldRefreshToken(path)
    ) {
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        return request<TResponse>(path, init, jsonBody, true);
      }
    }

    const parsedBody = await parseJsonBody(response);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        getErrorMessage(parsedBody, response.statusText),
        parsedBody,
      );
    }

    if (response.status === 204) {
      return {
        status: response.status,
        message: response.statusText || "Success",
      };
    }

    return parsedBody as ApiSuccessResponse<TResponse>;
  };

  return {
    get: (path, init) => request(path, { ...init, method: "GET" }),
    post: (path, body, init) =>
      request(path, { ...init, method: "POST" }, body),
    put: (path, body, init) => request(path, { ...init, method: "PUT" }, body),
    patch: (path, body, init) =>
      request(path, { ...init, method: "PATCH" }, body),
    delete: (path, init) => request(path, { ...init, method: "DELETE" }),
  };
}

/**
 * Base URL from `NEXT_PUBLIC_API_BASE_URL` (.env.local), used on both server and browser.
 * The backend must allow the frontend origin in CORS.
 */
export function resolveApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local.",
    );
  }

  return baseUrl;
}
