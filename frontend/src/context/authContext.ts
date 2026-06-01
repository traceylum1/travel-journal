import { createContext } from "react";
import type apiCalls from "../Requests/apiCalls";
import type { UserCredentialsProps } from "../Types/Props";

export type AuthUser = {
  userId: number;
  username: string;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type LoginResult = Awaited<ReturnType<typeof apiCalls.login>>;
export type RegisterResult = Awaited<ReturnType<typeof apiCalls.register>>;

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: UserCredentialsProps) => Promise<LoginResult>;
  register: (credentials: UserCredentialsProps) => Promise<RegisterResult>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
