import { createContext } from "react";

import type { LoginPayload } from "../api/auth";

export interface AuthContextValue {
  username: string | null;
  isAuthenticated: boolean;
  signIn: (credentials: LoginPayload) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);