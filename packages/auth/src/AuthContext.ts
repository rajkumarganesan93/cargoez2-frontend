import { createContext, useContext } from "react";
import type Keycloak from "keycloak-js";

export interface AuthContextValue {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
  token: string | undefined;
  userName: string | undefined;
  roles: string[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const defaultValue: AuthContextValue = {
  keycloak: null,
  initialized: false,
  authenticated: false,
  token: undefined,
  userName: undefined,
  roles: [],
  login: async () => {},
  logout: async () => {},
  hasRole: () => false,
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
