import Keycloak from "keycloak-js";

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const defaultConfig: KeycloakConfig = {
  url: "http://localhost:8080",
  realm: "cargoez",
  clientId: "cargoez-web",
};

let keycloakInstance: Keycloak | null = null;

export function getKeycloak(config?: Partial<KeycloakConfig>): Keycloak {
  if (!keycloakInstance) {
    const merged = { ...defaultConfig, ...config };
    keycloakInstance = new Keycloak({
      url: merged.url,
      realm: merged.realm,
      clientId: merged.clientId,
    });
  }
  return keycloakInstance;
}

export function resetKeycloak(): void {
  keycloakInstance = null;
}
