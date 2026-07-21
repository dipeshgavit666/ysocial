import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/auth.api";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const TestUser = useState<User | null>({
  //   _id: "1",
  //   name: "Test User",
  //   username: "test",
  //   email: "test@example.com",
  // });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        // setUser(TestUser[0]);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
