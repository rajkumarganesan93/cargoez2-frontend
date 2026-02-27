import React from "react";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRoles, fallback }: ProtectedRouteProps) {
  const { authenticated, hasRole } = useAuth();

  if (!authenticated) {
    return <>{fallback ?? <div className="p-8 text-center">Not authenticated. Please log in.</div>}</>;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasAllRoles = requiredRoles.every((role) => hasRole(role));
    if (!hasAllRoles) {
      return (
        <>{fallback ?? <div className="p-8 text-center">Access denied. Insufficient permissions.</div>}</>
      );
    }
  }

  return <>{children}</>;
}
