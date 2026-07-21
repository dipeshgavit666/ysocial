import { get, post } from "../lib/api-client";

interface AuthUser {
  _id: string;
  username: string;
  email: string;
  name: string;
}

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function register(payload: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  return post<{ user: AuthUser }>("/auth/register", payload);
}

export function login(payload: { email: string; password: string }) {
  return post<LoginResponse>("/auth/login", payload);
}

export function logout() {
  return post<void>("/auth/logout");
}

export function getCurrentUser() {
  return get<AuthUser>("/auth/profile");
}
