import type { ApiEnvelope } from "./types";
import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });

  const envelope = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !envelope?.success) {
    throw new ApiError(
      envelope?.message ?? "Something went wrong. Please try again.",
      res.status
    );
  }
  return envelope.data as T;
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) });

export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) });

export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) });

export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: "DELETE" });
