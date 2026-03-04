import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type Keycloak from "keycloak-js";
import { getKeycloak, type KeycloakConfig } from "./keycloak";
import { AuthContext, type AuthContextValue } from "./AuthContext";

const TOKEN_REFRESH_INTERVAL_MS = 30_000;
const TOKEN_MIN_VALIDITY_SECONDS = 70;

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
  const [token, setToken] = useState<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  const publishToken = useCallback((kc: Keycloak) => {
    if (kc.token) {
      setToken(kc.token);
      onTokenRef.current?.(kc.token);
    }
  }, []);

  useEffect(() => {
    const kc = getKeycloak(config);

    kc.onTokenExpired = () => {
      kc.updateToken(TOKEN_MIN_VALIDITY_SECONDS)
        .then((refreshed) => {
          if (refreshed) {
            publishToken(kc);
          }
        })
        .catch(() => {
          console.warn("Token expired and refresh failed, redirecting to login");
          kc.login();
        });
    };

    kc.init({
      onLoad: "login-required",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
      .then((auth) => {
        setKeycloak(kc);
        setAuthenticated(auth);
        if (auth) {
          publishToken(kc);
        }
        setInitialized(true);
      })
      .catch((err) => {
        console.error("Keycloak init failed:", err);
        setInitialized(true);
      });

    const refreshInterval = setInterval(() => {
      if (kc.authenticated) {
        kc.updateToken(TOKEN_MIN_VALIDITY_SECONDS)
          .then((refreshed) => {
            if (refreshed) {
              publishToken(kc);
            }
          })
          .catch(() => {
            console.warn("Token refresh failed, redirecting to login");
            kc.login();
          });
      }
    }, TOKEN_REFRESH_INTERVAL_MS);

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

  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (!keycloak?.authenticated) return undefined;
    try {
      await keycloak.updateToken(TOKEN_MIN_VALIDITY_SECONDS);
      if (keycloak.token) {
        publishToken(keycloak);
        return keycloak.token;
      }
    } catch {
      keycloak.login();
    }
    return undefined;
  }, [keycloak, publishToken]);

  const value: AuthContextValue = useMemo(
    () => ({
      keycloak,
      initialized,
      authenticated,
      token,
      userName: keycloak?.tokenParsed?.preferred_username as string | undefined,
      roles: keycloak?.realmAccess?.roles ?? [],
      login,
      logout,
      hasRole,
      getToken,
    }),
    [keycloak, initialized, authenticated, token, login, logout, hasRole, getToken]
  );

  if (!initialized) {
    return <>{loadingComponent ?? <div className="flex items-center justify-center min-h-screen">Loading...</div>}</>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
