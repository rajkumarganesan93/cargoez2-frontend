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
- [Styling Guidelines](#styling-guidelines)
- [TypeScript Conventions](#typescript-conventions)
- [Real-Time Data Sync](#real-time-data-sync)
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
# Start the app you're working on
npm run dev:cargoez        # port 5173
npm run dev:admin          # port 5174

# If you changed uicontrols or uifunctions, rebuild them
npm run build -w packages/uicontrols
npm run build -w packages/uifunctions

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

To add a new feature module (e.g., `reports`):

### 1. Create the module scaffold

```
modules/reports/
├── package.json
├── tsconfig.json
└── src/
    ├── domain/
    │   ├── entities/
    │   │   └── Report.ts
    │   ├── repositories/
    │   │   └── IReportRepository.ts
    │   └── index.ts
    ├── application/
    │   ├── use-cases/
    │   │   └── ReportUseCases.ts
    │   └── index.ts
    ├── infrastructure/
    │   ├── endpoints/
    │   │   └── reportEndpoints.ts
    │   ├── repositories/
    │   │   └── ReportApiRepository.ts
    │   └── index.ts
    ├── presentation/
    │   ├── hooks/
    │   │   └── useReports.ts
    │   ├── pages/
    │   │   ├── ReportsList.tsx
    │   │   ├── ReportForm.tsx
    │   │   └── ReportDetail.tsx
    │   └── index.ts
    ├── di/
    │   └── container.ts
    ├── routes.tsx
    ├── nav.ts
    └── index.ts
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
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "react-router-dom": ">=6.0.0"
  }
}
```

### 3. Create `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

### 4. Export routes and nav from `index.ts`

```typescript
export { reportsRoutes } from "./routes";
export { ReportsNavItem } from "./nav";
```

### 5. Register in the shell app

In `apps/cargoez/src/App.tsx`, import the routes:

```typescript
import { reportsRoutes } from "@rajkumarganesan93/reports";
const allRoutes = [...contactsRoutes, ...freightRoutes, ...booksRoutes, ...reportsRoutes];
```

In `apps/cargoez/src/presentation/layouts/AppLayout.tsx`, add the nav item:

```typescript
import { ReportsNavItem } from "@rajkumarganesan93/reports";
```

In `apps/cargoez/src/index.css`, add the `@source` directive:

```css
@source "../../../modules/reports/src";
```

### 6. Install dependencies

```bash
npm install
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
// domain/entities/Report.ts
export interface Report {
  id: string;
  title: string;
  createdAt: string;
}

export interface CreateReportInput {
  title: string;
}

export type UpdateReportInput = Partial<CreateReportInput>;
```

### Repository Interface (Domain)

```typescript
// domain/repositories/IReportRepository.ts
import type { Report, CreateReportInput, UpdateReportInput } from "../entities/Report";

export interface MutationResult<T> {
  data: T;
  message: string;
}

export interface IReportRepository {
  getAll(): Promise<Report[]>;
  getById(id: string): Promise<Report>;
  create(input: CreateReportInput): Promise<MutationResult<Report>>;
  update(id: string, input: UpdateReportInput): Promise<MutationResult<Report>>;
  delete(id: string): Promise<MutationResult<void>>;
}
```

### Use Case Class (Application)

```typescript
// application/use-cases/ReportUseCases.ts
import type { IReportRepository } from "../../domain";

export class ReportUseCases {
  private readonly repository: IReportRepository;

  constructor(repository: IReportRepository) {
    this.repository = repository;
  }

  async listReports() {
    return this.repository.getAll();
  }
  // ... other methods
}
```

> **Important:** Do not use TypeScript constructor parameter properties (`constructor(private repo: IRepo)`). The project uses `erasableSyntaxOnly: true`, which requires explicit property declarations.

### DI Container

```typescript
// di/container.ts
import { ReportApiRepository } from "../infrastructure";
import { ReportUseCases } from "../application";

const reportRepository = new ReportApiRepository();
export const reportUseCases = new ReportUseCases(reportRepository);
```

## API Integration Pattern

### Endpoint Constants

Centralize all API paths in `infrastructure/endpoints/`:

```typescript
export const REPORT_ENDPOINTS = {
  LIST: "/reports",
  DETAIL: (id: string) => `/reports/${id}`,
  CREATE: "/reports",
  UPDATE: (id: string) => `/reports/${id}`,
  DELETE: (id: string) => `/reports/${id}`,
} as const;
```

### Repository Implementation

```typescript
import { api, type ApiResponse } from "@rajkumarganesan93/uifunctions";

export class ReportApiRepository implements IReportRepository {
  async getAll(): Promise<Report[]> {
    const res = await api.get<ApiResponse<Report[]>>(REPORT_ENDPOINTS.LIST);
    return res.data.data;
  }

  async create(input: CreateReportInput): Promise<MutationResult<Report>> {
    const res = await api.post<ApiResponse<Report>>(REPORT_ENDPOINTS.CREATE, input);
    return { data: res.data.data, message: res.data.message };
  }
}
```

### Message Handling

- **Success messages** — extracted from `res.data.message` in the repository, passed through use cases to hooks, displayed via `showToast("success", result.message)`
- **Error messages** — extracted from the `ApiError` thrown by the Axios interceptor, displayed via `showToast("error", (err as ApiError).message)`
- **Never hardcode messages** — all success/error messages come from the backend API

### Presentation Hook

```typescript
import { contactUseCases } from "../../di/container";

export function useContactMutation() {
  const { showToast } = useToast();

  const createContact = async (data: CreateContactInput): Promise<boolean> => {
    try {
      const result = await contactUseCases.createContact(data);
      showToast("success", result.message);  // Message from backend
      return true;
    } catch (err) {
      showToast("error", (err as ApiError).message);  // Error from backend
      return false;
    }
  };
}
```

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
import type { Contact, CreateContactInput } from "../../domain";
import type { IContactRepository, MutationResult } from "../../domain";

// Regular imports for values
import { ContactApiRepository } from "../infrastructure";
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
Browser → Keycloak login (PKCE) → JWT token
  ├── configureClient({ baseURL: USER_SERVICE_URL, headers: { Authorization: Bearer <token> } })
  ├── RealtimeProvider({ getToken: () => token, defaultServiceUrl: USER_SERVICE_URL })
  └── App renders with authenticated API calls + real-time sync
```

The `AuthProvider` wraps the entire app in `main.tsx`. On successful Keycloak login, the `onToken` callback configures the API client with the user-service URL and Bearer token. A small `AppWithRealtime` wrapper component reads the token from `useAuth()` and passes it to `RealtimeProvider`.

### Running the Full Stack

**Prerequisites:**
1. Keycloak running on port 8080 with the `cargoez` realm imported
2. User-service running on port 3001 (from the backend repo)
3. The `cargoez-web` Keycloak client must include `http://localhost:5174/*` in its redirect URIs

**Start the admin app:**

```bash
npm run dev:admin
```

Open http://localhost:5174 — you'll be redirected to Keycloak login. Use `admin`/`admin123`.

### Keycloak Client Configuration

If you get an "Invalid parameter: redirect_uri" error, the `cargoez-web` client in Keycloak is missing port 5174. Add it via:

1. Keycloak Admin Console (http://localhost:8080/admin)
2. Select `cargoez` realm → Clients → `cargoez-web`
3. Add `http://localhost:5174/*` to Valid Redirect URIs
4. Add `http://localhost:5174` to Web Origins
5. Save

Or update `keycloak/cargoez-realm.json` in the backend repo and re-import.

### Testing Real-Time Sync

1. Open the admin app in **two browser tabs** (or one tab + Swagger UI at http://localhost:3001/api-docs)
2. Create a user from Swagger UI or the second tab
3. The first tab should show the new user instantly (no page refresh) + a Toast notification
4. The "Live" indicator next to "User Management" shows the Socket.IO connection status

### Admin App Clean Architecture

```
apps/admin/src/
├── domain/
│   ├── entities/
│   │   ├── User.ts              # { id, name, email, isActive, createdAt, modifiedAt }
│   │   └── SystemSettings.ts
│   └── repositories/
│       ├── IUserRepository.ts   # PaginatedResult<User>, CRUD + delete
│       └── ISettingsRepository.ts
├── application/
│   └── use-cases/
│       ├── UserUseCases.ts      # listUsers(page, limit), createUser, updateUser, deleteUser
│       └── SettingsUseCases.ts
├── infrastructure/
│   ├── endpoints/
│   │   └── adminEndpoints.ts    # USER_ENDPOINTS: /users, SETTINGS_ENDPOINTS
│   └── repositories/
│       ├── UserApiRepository.ts # Handles ApiResponse<PaginatedData<User>>
│       └── SettingsApiRepository.ts
├── presentation/
│   ├── hooks/
│   │   └── useAdmin.ts          # useUserList (paginated + realtime), useUserMutation, useSystemSettings
│   ├── layouts/
│   │   └── AdminLayout.tsx      # Sidebar nav, auth username + logout
│   └── pages/
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx   # Full CRUD, pagination, search, realtime indicator
│       └── SystemSettings.tsx
├── di/
│   └── container.ts             # Wires UserApiRepository → UserUseCases
├── App.tsx
└── main.tsx                     # AuthProvider → AppWithRealtime → RealtimeProvider → App
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
npm run build -w packages/uifunctions
npm run build -w packages/uicontrols

# 4. Verify apps build
npm run build -w apps/cargoez
npm run build -w apps/admin

# 5. Ensure no .env or .npmrc in staged files
git diff --cached --name-only | findstr ".env .npmrc"
```

## Real-Time Data Sync

The platform uses **Socket.IO** for real-time data synchronization. When one user modifies data, all other users viewing the same data see changes instantly without a page refresh.

### Architecture

```
RealtimeProvider (wraps the app, provides token + default URL)
  └── useRealtimeSync (per list/detail hook)
        ├── Connects to backend Socket.IO server
        ├── Subscribes to room: entity:{tableName} or entity:{tableName}:{id}
        ├── Listens for entity.created, entity.updated, entity.deleted
        └── Calls onEvent callback → refetch() + showToast()
```

### Backend Contract

Backend services emit `DomainEvent` objects through Socket.IO:

```typescript
interface DomainEvent {
  entity: string;        // e.g. "contacts", "freight"
  action: 'created' | 'updated' | 'deleted';
  entityId: string;
  data?: Record<string, unknown>;
  actor: string;
  tenantId?: string;
  timestamp: string;
}
```

Room patterns:
- `entity:{tableName}` -- list pages (e.g. `entity:contacts`)
- `entity:{tableName}:{id}` -- detail pages (e.g. `entity:contacts:abc-123`)

Clients subscribe/unsubscribe via: `socket.emit('subscribe', { room })` / `socket.emit('unsubscribe', { room })`

### Provider Setup

Both apps wrap their component tree with `RealtimeProvider` in `main.tsx`:

```tsx
import { RealtimeProvider } from "@rajkumarganesan93/uifunctions";

// When AuthProvider is wired in:
function AppProviders({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return (
    <RealtimeProvider
      getToken={() => token}
      defaultServiceUrl={import.meta.env.VITE_API_BASE_URL}
    >
      {children}
    </RealtimeProvider>
  );
}
```

Until `AuthProvider` is wired, `getToken` returns `undefined` and no socket connections are established.

### Using useRealtimeSync in a List Hook

```typescript
import { useRealtimeSync } from "@rajkumarganesan93/uifunctions";
import type { DomainEvent } from "@rajkumarganesan93/uifunctions";

export function useContactList() {
  const { showToast } = useToast();

  const fetchContacts = useCallback(async () => {
    // ... fetch logic
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: DomainEvent) => {
      fetchContacts();
      showToast("info", `A contact was ${event.action} by another user`);
    },
    [fetchContacts, showToast],
  );

  const { connected } = useRealtimeSync({
    entity: "contacts",
    onEvent: handleRealtimeEvent,
  });

  return { contacts, loading, refetch: fetchContacts, connected };
}
```

### Using useRealtimeSync for a Detail Page

```typescript
const { connected } = useRealtimeSync({
  entity: "contacts",
  entityId: id,                      // subscribes to entity:contacts:{id}
  onEvent: (event) => refetchContact(),
});
```

### Hook Options

| Option | Type | Required | Description |
|---|---|---|---|
| `entity` | `string` | Yes | Entity/table name (e.g. `"contacts"`) |
| `entityId` | `string` | No | Specific entity ID for detail views |
| `onEvent` | `(event: DomainEvent) => void` | Yes | Callback when a relevant event arrives |
| `serviceUrl` | `string` | No | Override the default service URL |
| `enabled` | `boolean` | No | Toggle sync on/off (default: `true`) |

### Connection Management

- `RealtimeProvider` shares socket connections per service URL across all hooks
- Auto-reconnects on disconnection (exponential backoff up to 10s)
- Cleans up all connections when the provider unmounts
- JWT token is sent via `auth: { token }` on the WebSocket handshake

### Environment Variables

The default service URL comes from `VITE_API_BASE_URL`. If backend services run on different ports, override via the `serviceUrl` option:

```typescript
useRealtimeSync({
  entity: "users",
  serviceUrl: "http://localhost:3001",
  onEvent: handleEvent,
});
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

### API calls failing

1. Check that `VITE_API_BASE_URL` is set in `.env`
2. Verify the backend services are running
3. Check the browser console for CORS errors
4. The app falls back to sample data when the API is unreachable -- this is by design for development

### Keycloak login — "Invalid parameter: redirect_uri"

The `cargoez-web` client in Keycloak doesn't include the app's port in its allowed redirect URIs. Add `http://localhost:5174/*` (for admin) via the Keycloak admin console or update the realm JSON. See [Admin App — Backend Integration](#admin-app--backend-integration).

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
3. Look for `[RealtimeSync] Connection error` warnings in the browser console
4. Ensure CORS allows WebSocket connections from your frontend origin
5. If using the API gateway URL, verify it proxies WebSocket upgrade requests
