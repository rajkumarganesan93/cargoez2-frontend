import { usePermissions } from "./PermissionContext";
import type { UserContextData } from "./PermissionContext";

export function useUserContext(): UserContextData | null {
  const { userContext } = usePermissions();
  return userContext;
}
