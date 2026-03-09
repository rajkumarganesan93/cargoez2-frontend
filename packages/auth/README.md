# @rajkumarganesan93/auth

Authentication and authorization package for CargoEz frontend applications.

## Features

- **Keycloak Integration** — OIDC/PKCE authentication via `keycloak-js`
- **Permission System** — ABAC-aware permission checking via `usePermissions()`
- **Route Protection** — `ProtectedRoute` component with role-based access
- **Token Management** — automatic refresh with configurable intervals

## Installation

```bash
pnpm add @rajkumarganesan93/auth
```

Peer dependencies: `react >= 18.0.0`, `react-dom >= 18.0.0`

## Usage

### Authentication

```tsx
import { AuthProvider, useAuth } from '@rajkumarganesan93/auth';

// Wrap your app
<AuthProvider
  config={{ url: 'http://localhost:8080', realm: 'cargoez', clientId: 'cargoez-web' }}
  onToken={(token) => setAuthToken(token)}
>
  <App />
</AuthProvider>

// Use in components
function Profile() {
  const { userName, roles, hasRole, logout } = useAuth();
  return <div>Welcome, {userName}</div>;
}
```

### Permission-Aware UI

```tsx
import { PermissionProvider, usePermissions, PermissionGate } from '@rajkumarganesan93/auth';

// Wrap with PermissionProvider (inside AuthProvider)
<PermissionProvider fetcher={async () => {
  const res = await api.get('/auth-service/me/permissions');
  return res.data.data;
}}>
  <App />
</PermissionProvider>

// Option 1: Hook-based (recommended for multiple checks)
function UserList() {
  const { can } = usePermissions();
  const canCreate = can('create', 'user-management', 'users');
  const canDelete = can('delete', 'user-management', 'users');

  return (
    <div>
      {canCreate && <Button label="Create User" />}
      {/* table rows with conditional delete buttons */}
    </div>
  );
}

// Option 2: Declarative (for single checks)
function UserActions() {
  return (
    <PermissionGate module="user-management" screen="users" operation="create">
      <Button label="Create User" />
    </PermissionGate>
  );
}
```

### Route Protection

```tsx
import { ProtectedRoute } from '@rajkumarganesan93/auth';

<Route path="/admin" element={
  <ProtectedRoute requiredRoles={['admin']}>
    <AdminPanel />
  </ProtectedRoute>
} />
```

## API Reference

### AuthProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `Partial<KeycloakConfig>` | Keycloak server configuration |
| `children` | `ReactNode` | App content |
| `onToken` | `(token: string) => void` | Called when token is obtained or refreshed |
| `loadingComponent` | `ReactNode` | Shown during Keycloak initialization |

### useAuth() Return Value

| Property | Type | Description |
|----------|------|-------------|
| `authenticated` | `boolean` | Whether user is logged in |
| `token` | `string \| undefined` | Current access token |
| `userName` | `string \| undefined` | Preferred username from token |
| `roles` | `string[]` | Keycloak realm roles |
| `hasRole(role)` | `(string) => boolean` | Check for realm or resource role |
| `login()` | `() => Promise<void>` | Redirect to Keycloak login |
| `logout()` | `() => Promise<void>` | Logout and redirect |
| `getToken()` | `() => Promise<string>` | Get fresh token (refreshes if needed) |

### PermissionProvider Props

| Prop | Type | Description |
|------|------|-------------|
| `fetcher` | `() => Promise<PermissionData>` | Async function to fetch permissions from backend |
| `children` | `ReactNode` | App content |

### usePermissions() Return Value

| Property | Type | Description |
|----------|------|-------------|
| `can(op, module, screen)` | `(string, string, string) => boolean` | Check single operation |
| `canAny(ops, module, screen)` | `(string[], string, string) => boolean` | Check if any operation is allowed |
| `loading` | `boolean` | Whether permissions are being fetched |
| `permissions` | `PermissionData \| null` | Raw permission data |
| `refresh()` | `() => Promise<void>` | Re-fetch permissions |

### PermissionGate Props

| Prop | Type | Description |
|------|------|-------------|
| `module` | `string` | Module code (e.g., `user-management`) |
| `screen` | `string` | Screen code (e.g., `users`) |
| `operation` | `string \| string[]` | Operation(s) to check |
| `children` | `ReactNode` | Content to render when allowed |
| `fallback` | `ReactNode` | Content when denied (default: `null`) |

## Exports

```typescript
// Authentication
export { AuthProvider } from './AuthProvider';
export { useAuth, AuthContext } from './AuthContext';
export type { AuthContextValue } from './AuthContext';
export { ProtectedRoute } from './ProtectedRoute';
export { getKeycloak, resetKeycloak } from './keycloak';
export type { KeycloakConfig } from './keycloak';

// Permissions
export { PermissionProvider } from './PermissionProvider';
export { usePermissions, PermissionContext } from './PermissionContext';
export type { PermissionContextValue, PermissionData, PermissionModule, PermissionScreen } from './PermissionContext';
export { PermissionGate } from './PermissionGate';
```
