# Development Guide

This document covers development conventions, architecture decisions, and guidelines for contributing to the CargoEz frontend monorepo.

## Table of Contents

- [Development Setup](#development-setup)
- [Workspace Layout](#workspace-layout)
- [Adding a New Micro-Frontend Module](#adding-a-new-micro-frontend-module)
- [Adding a New UI Component](#adding-a-new-ui-component)
- [Adding a New Utility Function](#adding-a-new-utility-function)
- [Clean Architecture Guidelines](#clean-architecture-guidelines)
- [API Integration Pattern](#api-integration-pattern)
- [Authentication Architecture](#authentication-architecture)
- [Real-Time Data Sync](#real-time-data-sync)
- [Styling Guidelines](#styling-guidelines)
- [TypeScript Conventions](#typescript-conventions)
- [Admin App — Backend Integration](#admin-app--backend-integration)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)

## Development Setup

### First-Time Setup

```bash
git clone https://github.com/rajkumarganesan93/cargoez2-frontend.git
cd cargoez2-frontend

# Configure GitHub Packages registry
cp .npmrc.example .npmrc
# Edit .npmrc — replace YOUR_GITHUB_TOKEN_HERE with your PAT

# Install all dependencies
npm install

# Build shared packages (required before running apps)
npm run build -w packages/auth
npm run build -w packages/uifunctions
npm run build -w packages/uicontrols

# Set up environment
cp apps/cargoez/.env.example apps/cargoez/.env
cp apps/admin/.env.example apps/admin/.env

# Start dev servers
npm run dev:cargoez
npm run dev:admin
```

### Day-to-Day Development

```bash
# Start everything (shell + all remotes + admin)
npm run dev:all

# Or start individually
npm run dev:cargoez        # Shell (port 5173)
npm run dev:contacts       # Contacts remote (port 5174)
npm run dev:freight        # Freight remote (port 5175)
npm run dev:books          # Books remote (port 5176)
npm run dev:admin          # Admin panel (port 5177)

# If you changed auth, uicontrols, or uifunctions, rebuild them
npm run build -w packages/auth
npm run build -w packages/uicontrols
npm run build -w packages/uifunctions

# After rebuilding a shared package, restart affected apps
# (all federated apps use built output, not source)

# Run Storybook while developing UI components
npm run storybook          # port 6006
```

### Useful Commands

```bash
# Type-check a specific workspace
npx tsc --noEmit -p modules/contacts/tsconfig.json

# Run tests for a specific package
npm run test -w packages/uifunctions

# Build a specific app for production
npm run build -w apps/cargoez

# Check for empty/orphan directories
Get-ChildItem -Recurse -Directory | Where-Object { (Get-ChildItem $_.FullName -Force).Count -eq 0 }
```

## Workspace Layout

The monorepo uses **npm workspaces** with three tiers:

| Tier | Folder | Purpose | Can depend on |
|---|---|---|---|
| **Packages** | `packages/*` | Shared, publishable libraries | External packages only |
| **Modules** | `modules/*` | Micro-frontend feature modules | Packages |
| **Apps** | `apps/*` | Deployable applications | Packages + Modules |

**Dependency rule:** Lower tiers never import from higher tiers.

```
Apps → Modules → Packages → External
```

## Adding a New Micro-Frontend Module

To add a new feature module (e.g., `reports`) as a federated remote:

### 1. Create the module scaffold

```
modules/reports/
├── package.json
├── tsconfig.json
├── vite.config.ts           # Federation config (exposes, shared)
├── index.html               # Standalone entry
└── src/
    ├── main.tsx              # Standalone React mount
    ├── App.tsx               # Standalone routing
    ├── index.css             # Tailwind imports
    ├── nav.ts                # Navigation item config
    ├── index.ts              # Public module API
    ├── domain/
    │   ├── entities/
    │   │   └── Report.ts
    │   └── repositories/
    │       └── IReportRepository.ts
    ├── application/
    │   └── use-cases/
    │       └── ReportUseCases.ts
    ├── infrastructure/
    │   ├── endpoints/
    │   │   └── reportEndpoints.ts
    │   └── repositories/
    │       └── ReportApiRepository.ts
    ├── presentation/
    │   ├── hooks/
    │   │   └── useReports.ts
    │   └── pages/
    │       ├── ReportsList.tsx
    │       ├── ReportForm.tsx
    │       └── ReportDetail.tsx
    └── di/
        └── container.ts
```

### 2. Create `package.json`

```json
{
  "name": "@rajkumarganesan93/reports",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@rajkumarganesan93/uicontrols": "*",
    "@rajkumarganesan93/uifunctions": "*"
  },
  "scripts": {
    "dev": "vite build && vite preview --port 5178",
    "build": "vite build",
    "preview": "vite preview --port 5178"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  },
  "devDependencies": {
    "@originjs/vite-plugin-federation": "^1.4.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.1",
    "@tailwindcss/vite": "^4.2.1",
    "@vitejs/plugin-react": "^5.1.4",
    "tailwindcss": "^4.2.1",
    "vite": "^7.3.1"
  }
}
```

### 3. Create `vite.config.ts`

```ts
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "reports",
      filename: "remoteEntry.js",
      exposes: {
        "./ReportsList": "./src/presentation/pages/ReportsList",
        "./ReportDetail": "./src/presentation/pages/ReportDetail",
        "./ReportForm": "./src/presentation/pages/ReportForm",
        "./nav": "./src/nav",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        "@rajkumarganesan93/uicontrols": { singleton: true, requiredVersion: "*" },
        "@rajkumarganesan93/uifunctions": { singleton: true, requiredVersion: "*" },
      },
    }),
  ],
  server: { port: 5178, cors: true },
  preview: { port: 5178, cors: true },
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
```

### 4. Create `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src", "*.ts", "../../types/**/*.d.ts"]
}
```

### 5. Register in the shell

**`apps/cargoez/vite.config.ts`** -- add the remote URL:
```ts
remotes: {
  // ...existing remotes...
  reports: `${REMOTE_BASE}:5178/assets/remoteEntry.js`,
}
```

**`apps/cargoez/src/vite-env.d.ts`** -- add type declarations:
```ts
declare module "reports/ReportsList" {
  import type { ComponentType } from "react";
  const Component: ComponentType;
  export default Component;
}
// ...repeat for ReportDetail, ReportForm
```

**`apps/cargoez/src/App.tsx`** -- add lazy imports and routes:
```tsx
const ReportsList = lazy(() => import("reports/ReportsList"));
// Add to federatedRoutes array
{ path: "reports", element: ReportsList, service: "Reports" },
```

**`apps/cargoez/src/index.css`** -- add Tailwind source scanning:
```css
@source "../../../modules/reports/src";
```

### 6. Add root scripts and Keycloak config

Add `dev:reports` to root `package.json` scripts and update `dev:all`.

Add `http://localhost:5178/*` to the Keycloak `cargoez-web` client's redirect URIs.

### 7. Install and run

```bash
npm install
npm run dev:reports    # Build + serve on port 5178
```

## Adding a New UI Component

All shared UI components live in `packages/uicontrols/src/components/`.

### Steps

1. Create a folder: `src/components/MyComponent/`
2. Create the component: `MyComponent.tsx`
3. Create a Storybook story: `MyComponent.stories.tsx`
4. Export from `src/index.ts`
5. Rebuild: `npm run build -w packages/uicontrols`

### Guidelines

- Use Tailwind CSS classes exclusively — no inline styles
- Support theming via `--color-*` CSS custom properties
- Accept `size`, `variant`, `color`, `disabled` props where applicable
- Include `forwardRef` for form elements
- Write a Storybook story covering all variants

## Adding a New Utility Function

All shared utilities live in `packages/uifunctions/src/core/`.

### Steps

1. Add your function in the appropriate category folder (e.g., `src/core/text/`)
2. Export from the category's `index.ts`
3. Export from `src/core/index.ts`
4. Export from `src/index.ts`
5. Write tests alongside the source (e.g., `myFunction.test.ts`)
6. Rebuild: `npm run build -w packages/uifunctions`

### Guidelines

- No React dependencies in utility functions (keep them pure)
- Include unit tests for every exported function
- Use TypeScript generics where appropriate

## Clean Architecture Guidelines

### Layer Responsibilities

| Layer | Contains | Can import from | Must NOT import from |
|---|---|---|---|
| **Domain** | Entities, repository interfaces | Nothing (pure TS) | Application, Infrastructure, Presentation |
| **Application** | Use case classes | Domain | Infrastructure, Presentation |
| **Infrastructure** | API repositories, endpoints | Domain, external packages | Application, Presentation |
| **Presentation** | React hooks, pages, layouts | Application, Domain | Infrastructure (except via DI) |
| **DI** | Container/wiring | All layers | — |

### Entity Definition (Domain)

```typescript
// domain/entities/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  modifiedAt: string;
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;
```

### Repository Interface (Domain)

```typescript
// domain/repositories/IUserRepository.ts
import type { User, CreateUserInput, UpdateUserInput } from "../entities/User";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface IUserRepository {
  getAll(params?: ListParams): Promise<PaginatedResult<User>>;
  getById(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<MutationResult<User>>;
  update(id: string, input: UpdateUserInput): Promise<MutationResult<User>>;
  delete(id: string): Promise<MutationResult<void>>;
}
```

### Use Case Class (Application)

```typescript
// application/use-cases/UserUseCases.ts
import type { IUserRepository, ListParams } from "../../domain";

export class UserUseCases {
  private readonly repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async listUsers(params?: ListParams) {
    return this.repository.getAll(params);
  }
  // ... other methods
}
```

> **Important:** Do not use TypeScript constructor parameter properties (`constructor(private repo: IRepo)`). The project uses `erasableSyntaxOnly: true`, which requires explicit property declarations.

### DI Container

```typescript
// di/container.ts
import { UserApiRepository } from "../infrastructure";
import { UserUseCases } from "../application";

const userRepository = new UserApiRepository();
export const userUseCases = new UserUseCases(userRepository);
```

## API Integration Pattern

### Endpoint Constants

Centralize all API paths in `infrastructure/endpoints/`. All backend service endpoints are prefixed with the service name:

```typescript
export const USER_ENDPOINTS = {
  LIST: "/user-service/users",
  ME: "/user-service/users/me",
  DETAIL: (id: string) => `/user-service/users/${id}`,
  CREATE: "/user-service/users",
  UPDATE: (id: string) => `/user-service/users/${id}`,
  DELETE: (id: string) => `/user-service/users/${id}`,
} as const;
```

### Repository Implementation

The backend returns paginated data as `{ data: [...], pagination: {...} }`. The repository maps this to the domain's `{ items: [...], meta: {...} }` format:

```typescript
import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";

interface BackendPaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export class UserApiRepository implements IUserRepository {
  async getAll(params: ListParams = {}): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sortBy, sortOrder, search } = params;
    const queryParams: Record<string, string | number> = { page, limit };
    if (sortBy) queryParams.sortBy = sortBy;
    if (sortOrder) queryParams.sortOrder = sortOrder;
    if (search) queryParams.search = search;

    const res = await api.get<ApiResponse<BackendPaginatedResponse<User>>>(
      USER_ENDPOINTS.LIST,
      { params: queryParams },
    );
    const body = res.data.data;
    return { items: body.data, meta: body.pagination };
  }
}
```

### Message Handling

- **Success messages** — extracted from `res.data.message` in the repository, passed through use cases to hooks, displayed via `showToast("success", result.message)`
- **Error messages** — extracted from the `ApiError` thrown by the Axios interceptor, displayed via `showToast("error", (err as ApiError).message)`
- **Never hardcode messages** — all success/error messages come from the backend API

### Presentation Hook

```typescript
import { useAuth } from "@rajkumarganesan93/auth";
import { userUseCases } from "../../di/container";

export function useUserList() {
  const { showToast } = useToast();
  const { token } = useAuth();
  const hasFetchedRef = useRef(false);

  const fetchUsers = useCallback(async () => {
    // ... fetch logic calling userUseCases.listUsers(params)
  }, [showToast]);

  // Only fetch when auth token is available
  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUsers();
    }
  }, [token, fetchUsers]);
}
```

> **Important:** Data-fetching hooks must check for the auth token before making API calls. This prevents 401 errors on page refresh when the Keycloak PKCE flow is still completing.

## Authentication Architecture

### Token Flow

```
┌────────────────────────────────────────────────────────────────────┐
│  Page Load                                                         │
│                                                                    │
│  1. main.tsx module loads                                          │
│     ├── configureClient({ baseURL: USER_SERVICE_URL })             │
│     └── setAuthToken() is available but token is undefined         │
│                                                                    │
│  2. AuthProvider mounts → shows "Loading..."                       │
│     └── kc.init({ onLoad: "login-required", pkceMethod: "S256" }) │
│                                                                    │
│  3. Keycloak resolves (from session or after redirect)             │
│     ├── publishToken(kc) → onToken callback fires                 │
│     │   └── handleToken(token) → setAuthToken(token) ← stored     │
│     └── setInitialized(true) → children render                    │
│                                                                    │
│  4. AppWithRealtime renders                                        │
│     ├── useEffect: setAuthToken(token) again (React state sync)   │
│     └── useEffect: setTokenRefresher(keycloak.getToken)           │
│                                                                    │
│  5. UserManagement mounts                                          │
│     └── useUserList checks: if (token) → fetchUsers()              │
│         └── Request interceptor injects: Authorization: Bearer ... │
└────────────────────────────────────────────────────────────────────┘
```

### Three-Layer Token Guarantee

1. **`setAuthToken(token)`** — Stores the token directly in the axiosClient module (no closures). A request interceptor reads this before every API call.
2. **`setTokenRefresher(fn)`** — Registers an async function for the 401 retry interceptor. If a request gets a 401, the interceptor calls this to refresh the token and retries the request once.
3. **Auth-aware hooks** — `useUserList` reads `useAuth().token` and only fires the initial fetch when the token is available. Prevents API calls before auth completes.

### Token Refresh Timeline

```
Access Token (5 min lifespan)
├── Proactive refresh: every 30s, refreshes if < 70s remaining
├── onTokenExpired event: immediate refresh attempt (safety net)
├── 401 retry interceptor: last-resort — refresh + retry failed request
│
Refresh Token (30 min idle / 10 hr max)
└── On failure → redirect to Keycloak login
```

### API Client Functions

| Function | Purpose | Called from |
|---|---|---|
| `configureClient({ baseURL, timeout })` | Set base URL for API calls | `main.tsx` (module level) |
| `setAuthToken(token)` | Store current JWT token | `main.tsx` (`handleToken` + `useEffect`) |
| `setTokenRefresher(fn)` | Register async token refresh function | `main.tsx` (`useEffect`) |

## Real-Time Data Sync

The platform uses **Socket.IO** for real-time data synchronization. When one user modifies data, all other users viewing the same data see changes instantly without a page refresh.

### Architecture

```
RealtimeProvider (wraps the app, provides token + default URL)
  └── useRealtimeSync (per list/detail hook)
        ├── Connects to backend Socket.IO server (JWT auth on handshake)
        ├── Subscribes to room: entity:{tableName} or entity:{tableName}:{id}
        ├── Listens for "data-changed" event
        └── Calls onEvent callback → refetch() + showToast()
```

### Backend Contract

Backend services emit a single `data-changed` event through Socket.IO with a `DomainEvent` payload:

```typescript
interface DomainEvent {
  entity: string;        // e.g. "users", "contacts"
  action: 'created' | 'updated' | 'deleted';
  entityId: string;
  data?: Record<string, unknown>;
  actor: string;
  tenantId?: string;
  timestamp: string;
}
```

Room patterns:
- `entity:{tableName}` -- list pages (e.g. `entity:users`)
- `entity:{tableName}:{id}` -- detail pages (e.g. `entity:users:abc-123`)
- `tenant:{tenantId}` -- all events for a tenant

Clients subscribe/unsubscribe via: `socket.emit('subscribe', { room })` / `socket.emit('unsubscribe', { room })`

### Provider Setup

Both apps wrap their component tree with `RealtimeProvider` in `main.tsx`:

```tsx
import { RealtimeProvider } from "@rajkumarganesan93/uifunctions";

function AppWithRealtime() {
  const { token } = useAuth();
  return (
    <RealtimeProvider
      getToken={() => token}
      defaultServiceUrl={import.meta.env.VITE_USER_SERVICE_URL}
    >
      <App />
    </RealtimeProvider>
  );
}
```

Until `AuthProvider` is wired, `getToken` returns `undefined` and no socket connections are established.

### Using useRealtimeSync in a List Hook

```typescript
import { useRealtimeSync } from "@rajkumarganesan93/uifunctions";
import type { DomainEvent } from "@rajkumarganesan93/uifunctions";

export function useUserList() {
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    // ... fetch logic
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: DomainEvent) => {
      fetchUsers();
      showToast("info", `A user was ${event.action} by another user`);
    },
    [fetchUsers, showToast],
  );

  const { connected } = useRealtimeSync({
    entity: "users",
    serviceUrl: import.meta.env.VITE_USER_SERVICE_URL,
    onEvent: handleRealtimeEvent,
  });

  return { users, loading, refetch: fetchUsers, connected };
}
```

### Using useRealtimeSync for a Detail Page

```typescript
const { connected } = useRealtimeSync({
  entity: "users",
  entityId: id,                      // subscribes to entity:users:{id}
  onEvent: (event) => refetchUser(),
});
```

### Hook Options

| Option | Type | Required | Description |
|---|---|---|---|
| `entity` | `string` | Yes | Entity/table name (e.g. `"users"`) |
| `entityId` | `string` | No | Specific entity ID for detail views |
| `onEvent` | `(event: DomainEvent) => void` | Yes | Callback when a relevant event arrives |
| `serviceUrl` | `string` | No | Override the default service URL |
| `enabled` | `boolean` | No | Toggle sync on/off (default: `true`) |

### Connection Management

- `RealtimeProvider` shares socket connections per service URL across all hooks
- Auto-reconnects on disconnection (exponential backoff up to 10s)
- Cleans up all connections when the provider unmounts
- JWT token is sent via `auth: { token }` on the WebSocket handshake

## Styling Guidelines

### Rules

1. **Only use Tailwind CSS** — no inline `style={}` attributes, no CSS modules, no styled-components
2. **Only use theme colors** — never hardcode hex values like `bg-[#0d3c61]`; use `bg-primary` instead
3. **Use theme utility classes** for all colors:
   - Backgrounds: `bg-primary`, `bg-bg-paper`, `bg-grey-100`
   - Text: `text-text-primary`, `text-error`, `text-primary-contrast`
   - Borders: `border-grey-300`, `border-primary-dark`
   - Hover: `hover:bg-action-hover`, `hover:bg-primary-dark/50`

### Adding Tailwind Source Scanning

When an application consumes a new module, add a `@source` directive to the app's `index.css`:

```css
@source "../../../modules/newmodule/src";
```

Without this, Tailwind won't detect classes used inside that module's source files.

## TypeScript Conventions

### Strict Settings

The base `tsconfig.base.json` enables:

- `strict: true`
- `erasableSyntaxOnly: true` — no enums, no constructor parameter properties, no namespaces
- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noUnusedLocals: true` / `noUnusedParameters: true`

### Import Style

```typescript
// Use `import type` for type-only imports
import type { User, CreateUserInput } from "../../domain";
import type { IUserRepository, MutationResult } from "../../domain";

// Regular imports for values
import { UserApiRepository } from "../infrastructure";
```

### Class Pattern

Due to `erasableSyntaxOnly`, always use explicit property declarations:

```typescript
// Correct
export class MyUseCases {
  private readonly repository: IMyRepository;
  constructor(repository: IMyRepository) {
    this.repository = repository;
  }
}

// Wrong — will cause TypeScript error
export class MyUseCases {
  constructor(private readonly repository: IMyRepository) {}
}
```

## Admin App — Backend Integration

The admin app is fully wired to the real user-service backend with Keycloak PKCE authentication and Socket.IO real-time sync.

### How It Works

```
Browser → Keycloak login (PKCE) → JWT access token
  ├── setAuthToken(token)  →  stored in axiosClient module
  │   └── Request interceptor injects Authorization header on every API call
  ├── RealtimeProvider({ getToken, defaultServiceUrl })
  │   └── Socket.IO connection authenticated with JWT
  └── App renders with authenticated API calls + real-time sync
```

The `AuthProvider` wraps the entire app in `main.tsx`. On successful Keycloak login:

1. `onToken(token)` callback fires → `setAuthToken(token)` stores the token in the axios module
2. `AuthProvider` sets `initialized=true` → children render
3. `AppWithRealtime` syncs the token to `setAuthToken()` via `useEffect` (covers React state updates)
4. `AppWithRealtime` registers `setTokenRefresher()` for 401 retry
5. `useUserList` checks `useAuth().token` before making API calls

### Running the Full Stack

**Prerequisites:**
1. Keycloak running on port 8080 with the `cargoez` realm imported
2. User-service running on port 3001 (from the backend repo)
3. The `cargoez-web` Keycloak client must include `http://localhost:5177/*` in its redirect URIs

**Start the admin app:**

```bash
npm run dev:admin
```

Open http://localhost:5177 — you'll be redirected to Keycloak login. Use `admin`/`admin123`.

### Keycloak Client Configuration

If you get an "Invalid parameter: redirect_uri" error, the `cargoez-web` client in Keycloak is missing the app's port. Add it via:

1. Keycloak Admin Console (http://localhost:8080/admin)
2. Select `cargoez` realm → Clients → `cargoez-web`
3. Add `http://localhost:5177/*` to Valid Redirect URIs (and any other ports: 5173-5176)
4. Add `http://localhost:5177` to Web Origins (and any other ports)
5. Save

Or update `keycloak/cargoez-realm.json` in the backend repo and re-import.

### Testing Real-Time Sync

1. Open the admin app in **two browser tabs** (or one tab + Swagger UI at http://localhost:3001/user-service/api-docs)
2. Create a user from Swagger UI or the second tab
3. The first tab should show the new user instantly (no page refresh) + a Toast notification
4. The "Live" indicator next to "User Management" shows the Socket.IO connection status

### Admin App Clean Architecture

```
apps/admin/src/
├── domain/
│   ├── entities/
│   │   ├── User.ts              # { id, name, email, phone?, createdAt, modifiedAt, createdBy?, modifiedBy?, tenantId? }
│   │   └── SystemSettings.ts
│   └── repositories/
│       ├── IUserRepository.ts   # PaginatedResult<User>, ListParams (search, sort), CRUD + delete
│       └── ISettingsRepository.ts
├── application/
│   └── use-cases/
│       ├── UserUseCases.ts      # listUsers(ListParams), createUser, updateUser, deleteUser
│       └── SettingsUseCases.ts
├── infrastructure/
│   ├── endpoints/
│   │   └── adminEndpoints.ts    # USER_ENDPOINTS: /user-service/users, /user-service/users/me
│   └── repositories/
│       ├── UserApiRepository.ts # Maps backend { data.data[], data.pagination } → { items[], meta }
│       └── SettingsApiRepository.ts
├── presentation/
│   ├── hooks/
│   │   └── useAdmin.ts          # useUserList (auth-aware, paginated, searchable, realtime), useUserMutation, useSystemSettings
│   ├── layouts/
│   │   └── AdminLayout.tsx      # Sidebar nav, auth username + logout
│   └── pages/
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx   # Full CRUD, pagination, server-side search, phone field, realtime indicator
│       └── SystemSettings.tsx
├── di/
│   └── container.ts             # Wires UserApiRepository → UserUseCases
├── App.tsx
└── main.tsx                     # AuthProvider → setAuthToken → AppWithRealtime → RealtimeProvider → App
```

### Environment Variables (Admin)

```
VITE_API_BASE_URL=http://localhost:4000
VITE_USER_SERVICE_URL=http://localhost:3001
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=cargoez
VITE_KEYCLOAK_CLIENT_ID=cargoez-web
```

## Git Workflow

### Branch Naming

- `feature/module-name` — new features
- `fix/description` — bug fixes
- `refactor/description` — code restructuring

### Commit Messages

Follow conventional commits:

```
feat(contacts): add bulk import functionality
fix(uicontrols): resolve button hover state in dark theme
refactor(freight): migrate to clean architecture
chore: update dependencies
docs: update development guide
```

### Pre-Push Checklist

```bash
# 1. Type-check all workspaces
npx tsc --noEmit -p modules/contacts/tsconfig.json
npx tsc --noEmit -p modules/freight/tsconfig.json
npx tsc --noEmit -p modules/books/tsconfig.json
npx tsc --noEmit -p apps/cargoez/tsconfig.json
npx tsc --noEmit -p apps/admin/tsconfig.json

# 2. Run tests
npm run test:all

# 3. Build packages
npm run build -w packages/auth
npm run build -w packages/uifunctions
npm run build -w packages/uicontrols

# 4. Verify apps build
npm run build -w apps/cargoez
npm run build -w apps/admin

# 5. Ensure no .env or .npmrc in staged files
git diff --cached --name-only | findstr ".env .npmrc"
```

## Troubleshooting

### Colors not rendering / Components look unstyled

1. Ensure the app's `index.css` has the `@theme` block with static hex color values
2. Ensure `@source` directives point to all consumed module source directories
3. Restart the Vite dev server (it may be serving stale CSS)
4. Verify `ThemeProvider` wraps the application in `main.tsx`

### TypeScript: "erasableSyntaxOnly" errors

Replace constructor parameter properties with explicit declarations (see [TypeScript Conventions](#typescript-conventions)).

### Module not found after adding a new workspace

Run `npm install` from the root to re-link workspaces.

### Storybook not reflecting latest component changes

Rebuild the `uicontrols` package first:

```bash
npm run build -w packages/uicontrols
```

### API calls returning 401 on page refresh

The Keycloak PKCE flow may not have completed before the API call fires. Ensure:

1. Data-fetching hooks check `useAuth().token` before calling the API
2. `setAuthToken(token)` is called in both `onToken` callback and `useEffect`
3. `setTokenRefresher()` is registered for 401 retry
4. The `AuthProvider` calls `publishToken(kc)` BEFORE `setInitialized(true)`

### Keycloak login — "Invalid parameter: redirect_uri"

The `cargoez-web` client in Keycloak doesn't include the app's port in its allowed redirect URIs. Add the port (e.g., `http://localhost:5177/*` for admin, or ports 5173-5176 for federated apps) via the Keycloak admin console or update the realm JSON. See [Admin App — Backend Integration](#admin-app--backend-integration).

### Keycloak login — "Invalid user credentials"

1. Verify the `cargoez` realm exists in Keycloak (http://localhost:8080/admin)
2. Check that users were imported (realm JSON must be imported with `--import-realm`)
3. Try resetting the password in Keycloak admin console → Users → Credentials tab
4. Test credentials via ROPC: `POST http://localhost:8080/realms/cargoez/protocol/openid-connect/token` with `grant_type=password&client_id=cargoez-api&username=admin&password=admin123`

### Admin app shows "Loading..." indefinitely

The `AuthProvider` uses `onLoad: "login-required"`. If Keycloak is not running on port 8080, the app will hang. Start Keycloak first, then refresh the admin app.

### Socket.IO not connecting

1. Verify the backend service has Socket.IO enabled on the same HTTP server
2. Check that `getToken()` returns a valid JWT (requires `AuthProvider` to be wired)
3. Look for connection error warnings in the browser console
4. Ensure CORS allows WebSocket connections from your frontend origin
5. If using the API gateway URL, verify it proxies WebSocket upgrade requests

### Backend returns "password authentication failed for user postgres"

This is a backend database configuration issue. Check the backend's `.env` file and ensure `DB_PASSWORD` matches your PostgreSQL installation password. Restart the user-service after fixing.
