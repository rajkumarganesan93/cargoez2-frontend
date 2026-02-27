import React, { useCallback, useEffect, useMemo, useState } from "react";
import type Keycloak from "keycloak-js";
import { getKeycloak, type KeycloakConfig } from "./keycloak";
import { AuthContext, type AuthContextValue } from "./AuthContext";

interface AuthProviderProps {
  config?: Partial<KeycloakConfig>;
  children: React.ReactNode;
  onToken?: (token: string) => void;
  loadingComponent?: React.ReactNode;
}

export function AuthProvider({ config, children, onToken, loadingComponent }: AuthProviderProps) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const kc = getKeycloak(config);

    kc.init({
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
      .then((auth) => {
        setKeycloak(kc);
        setAuthenticated(auth);
        setInitialized(true);
        if (auth && kc.token && onToken) {
          onToken(kc.token);
        }
      })
      .catch((err) => {
        console.error("Keycloak init failed:", err);
        setInitialized(true);
      });

    // Token refresh
    const refreshInterval = setInterval(() => {
      if (kc.authenticated) {
        kc.updateToken(30)
          .then((refreshed) => {
            if (refreshed && kc.token && onToken) {
              onToken(kc.token);
            }
          })
          .catch(() => {
            console.warn("Token refresh failed, redirecting to login");
            kc.login();
          });
      }
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async () => {
    if (keycloak) {
      await keycloak.login();
    }
  }, [keycloak]);

  const logout = useCallback(async () => {
    if (keycloak) {
      await keycloak.logout({ redirectUri: window.location.origin });
    }
  }, [keycloak]);

  const hasRole = useCallback(
    (role: string) => {
      if (!keycloak) return false;
      return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role);
    },
    [keycloak]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      keycloak,
      initialized,
      authenticated,
      token: keycloak?.token,
      userName: keycloak?.tokenParsed?.preferred_username as string | undefined,
      roles: keycloak?.realmAccess?.roles ?? [],
      login,
      logout,
      hasRole,
    }),
    [keycloak, initialized, authenticated, login, logout, hasRole]
  );

  if (!initialized) {
    return <>{loadingComponent ?? <div className="flex items-center justify-center min-h-screen">Loading...</div>}</>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
