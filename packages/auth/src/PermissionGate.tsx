import type React from "react";
import { usePermissions } from "./PermissionContext";

interface PermissionGateProps {
  /** Module code, e.g. "user-management" */
  module: string;
  /** Screen code, e.g. "users" */
  screen: string;
  /** Required operation, e.g. "create". If array, user needs ANY of them. */
  operation: string | string[];
  /** Content to render when permission is granted */
  children: React.ReactNode;
  /** Optional fallback when permission is denied (defaults to null) */
  fallback?: React.ReactNode;
}

export function PermissionGate({
  module,
  screen,
  operation,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can, canAny, loading } = usePermissions();

  if (loading) return null;

  const allowed = Array.isArray(operation)
    ? canAny(operation, module, screen)
    : can(operation, module, screen);

  return <>{allowed ? children : fallback}</>;
}
