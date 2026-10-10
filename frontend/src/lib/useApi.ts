import { useAuth } from "@clerk/react";
import { useCallback } from "react";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export function useApi() {
  const { getToken } = useAuth();
  return useCallback(
    async <T>(path: string, init: RequestInit = {}): Promise<T> => {
      const token = await getToken();
      const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      return res.json() as Promise<T>;
    },
    [getToken],
  );
}
