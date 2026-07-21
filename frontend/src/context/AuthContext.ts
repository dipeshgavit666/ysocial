import { createContext } from "react";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (Credentials: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
