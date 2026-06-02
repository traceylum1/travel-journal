import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
  type AuthUser,
} from "./authContext";
import apiCalls from "../Requests/apiCalls";
import type { UserCredentialsProps } from "../Types/Props";

export type {
  AuthUser,
  AuthStatus,
  AuthContextValue,
  LoginResult,
  RegisterResult,
} from "./authContext";

function clearAuthLocalStorage() {
  localStorage.removeItem("username");
  localStorage.removeItem("userId");
  localStorage.removeItem("tripList");
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const currentUser = await apiCalls.getCurrentUser();
      if (cancelled) return;

      if (currentUser) {
        setUser(currentUser);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: UserCredentialsProps) => {
    const result = await apiCalls.login(credentials);
    if (result.success) {
      const currentUser = await apiCalls.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStatus("authenticated");
      }
    }
    return result;
  }, []);

  const register = useCallback(async (credentials: UserCredentialsProps) => {
    const result = await apiCalls.register(credentials);
    if (result.success) {
      const currentUser = await apiCalls.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStatus("authenticated");
      }
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await apiCalls.logout();
    clearAuthLocalStorage();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      login,
      register,
      logout,
    }),
    [status, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
