import { apiClient } from "../lib/api-client";

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface loginPayload {
  email: string;
  password: string;
}

export function registerPayload(payload: RegisterPayload) {
  return apiClient.post("auth/register", payload);
}

export function login(payload: loginPayload) {
  return apiClient.post("auth/login", payload);
}

export function logout() {
  return apiClient.post("auth/logout");
}

export function getCurrentUser() {
  return apiClient.get("auth/profile");
}
