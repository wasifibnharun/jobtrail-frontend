import {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { login } from "../api/auth";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("access"),
  );
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem("username"),
  );

  const signIn = useCallback(
    async (credentials: { username: string; password: string }) => {
      const tokens = await login(credentials);

      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
      localStorage.setItem("username", credentials.username);

      queryClient.clear();
      setAccessToken(tokens.access);
      setUsername(credentials.username);
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");

    queryClient.clear();
    setAccessToken(null);
    setUsername(null);
  }, [queryClient]);

  const value = useMemo(
    () => ({
      username,
      isAuthenticated: Boolean(accessToken),
      signIn,
      signOut,
    }),
    [accessToken, signIn, signOut, username],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
