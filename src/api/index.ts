import { createApiClient, resolveApiBaseUrl } from "./create-api-client";

export const api = createApiClient({
  baseUrl: resolveApiBaseUrl,
});

export * from "./create-query-client";
