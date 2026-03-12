import type React from "react";
import { usePermissions } from "./PermissionContext";

interface PermissionGateProps {
  /** Module code, e.g. "freight" */
  module: string;
  /** Screen code (optional, kept for backward compat but not used in new module.operation format) */
  screen?: string;
  /** Required operation, e.g. "create". If array, user needs ANY of them. */
  operation: string | string[];
  children: React.ReactNode;
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
