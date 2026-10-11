import axios from "axios";
import { getToken } from "@clerk/react";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the backend's { data, message, success } envelope.
apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "Request failed";
    return Promise.reject(new Error(message));
  },
);

function get<T>(url: string) {
  return apiClient.get(url) as unknown as Promise<T>;
}

function post<T>(url: string, body?: unknown) {
  return apiClient.post(url, body) as unknown as Promise<T>;
}

function patch<T>(url: string, body?: unknown) {
  return apiClient.patch(url, body) as unknown as Promise<T>;
}

export { get, post, patch };
