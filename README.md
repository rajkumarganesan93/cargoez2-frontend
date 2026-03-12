# CargoEz Frontend

Micro-frontend monorepo for the CargoEz logistics platform, built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Follows **Clean Architecture** principles across all modules.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Applications](#applications)
- [Micro-Frontend Modules](#micro-frontend-modules)
- [Shared Packages](#shared-packages)
- [Clean Architecture](#clean-architecture)
- [Theming](#theming)
- [Environment Variables](#environment-variables)
- [Backend Integration](#backend-integration)
- [Storybook](#storybook)
- [Testing](#testing)
- [Code Quality](#code-quality)

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Applications                       │
│  ┌──────────────────┐   ┌────────────────────────┐  │
│  │ Tenant Portal    │   │  SysAdmin Portal       │  │
│  │ (cargoez :5173)  │   │  (admin :5177)         │  │
│  └────────┬─────────┘   └────────────────────────┘  │
│           │                                          │
│  ┌────────┴──────────────────────────────────────┐  │
│  │          Micro-Frontend Modules                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  │ Contacts │ │ Freight  │ │  Books   │ │tenant-admin│  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
│  └───────────────────────┬───────────────────────┘  │
│                          │                           │
│  ┌───────────────────────┴───────────────────────┐  │
│  │            Shared Packages                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────┐ │  │
│  │  │ uicontrols  │  │ uifunctions  │  │ auth │ │  │
│  │  └─────────────┘  └──────────────┘  └──────┘ │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
FRONTEND/
├── packages/                  # Shared libraries (publishable)
│   ├── uicontrols/            #   UI component library (Button, TextField, Toast)
│   ├── uifunctions/           #   Utility functions (API client, date, validation, real-time)
│   └── auth/                  #   Keycloak PKCE authentication with token refresh
├── modules/                   # Micro-frontend feature modules
│   ├── contacts/              #   Contact management
│   ├── freight/               #   Freight & shipment tracking
│   ├── books/                 #   Booking ledger & invoicing
│   └── tenant-admin/          #   Tenant administration (roles, permissions)
├── apps/                      # Deployable applications
│   ├── cargoez/               #   Tenant portal shell (app.cargoez.com)
│   └── admin/                 #   SysAdmin portal (admin.cargoez.com)
├── package.json               # Root workspace config
├── tsconfig.base.json         # Shared TypeScript config
├── .npmrc.example             # NPM registry config template
└── .gitignore
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (uses npm workspaces)
- **Git**
- **Keycloak** >= 26.x (for authentication — required by the Admin Panel)
- **CargoEz Backend** running (admin-service on port 3001, freight/contacts/books services on ports 3002-3004, API Portal on port 4000)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rajkumarganesan93/cargoez2-frontend.git
cd cargoez2-frontend
```

### 2. Configure npm registry

Copy the `.npmrc.example` file and add your GitHub token:

```bash
cp .npmrc.example .npmrc
```

Edit `.npmrc` and replace `YOUR_GITHUB_TOKEN_HERE` with your GitHub personal access token (requires `read:packages` scope).

### 3. Install dependencies

```bash
npm install
```

This installs dependencies for all workspaces (packages, modules, and apps) in a single command.

### 4. Build shared packages

```bash
npm run build -w packages/auth
npm run build -w packages/uifunctions
npm run build -w packages/uicontrols
```

### 5. Set up environment variables

```bash
cp apps/cargoez/.env.example apps/cargoez/.env
cp apps/admin/.env.example apps/admin/.env
```

### 6. Start development servers

```bash
# All apps (shell + remotes + admin) in one command
npm run dev:all

# Or individually:
npm run dev:cargoez    # Shell (port 5173)
npm run dev:contacts   # Contacts remote (port 5174)
npm run dev:freight    # Freight remote (port 5175)
npm run dev:books      # Books remote (port 5176)
npm run dev:admin      # Admin panel (port 5177)
```

- **CargoEz Shell**: http://localhost:5173
- **Contacts**: http://localhost:5174
- **Freight**: http://localhost:5175
- **Books**: http://localhost:5176
- **Admin Panel**: http://localhost:5177

See [MICROFRONTEND.md](MICROFRONTEND.md) for the full Module Federation architecture documentation.

## Available Scripts

Run from the repository root:

| Command | Description |
|---|---|
| `npm run dev:all` | Start all apps (shell + 3 remotes + admin) in parallel |
| `npm run dev:cargoez` | Build and serve CargoEz shell (port 5173) |
| `npm run dev:contacts` | Build and serve Contacts remote (port 5174) |
| `npm run dev:freight` | Build and serve Freight remote (port 5175) |
| `npm run dev:books` | Build and serve Books remote (port 5176) |
| `npm run dev:admin` | Start Admin panel dev server (port 5177) |
| `npm run build:all` | Build all workspaces |
| `npm run test:all` | Run tests in all workspaces |
| `npm run lint:all` | Lint all workspaces |
| `npm run storybook` | Start Storybook for uicontrols (port 6006) |

Run for a specific workspace:

```bash
npm run build -w packages/uicontrols
npm run test -w packages/uifunctions
npm run dev -w apps/cargoez
```

## Applications

### Tenant Portal (`apps/cargoez`) — app.cargoez.com

The tenant-facing web application that serves as the **host** for all micro-frontend modules. Uses **Vite Module Federation** (`@originjs/vite-plugin-federation`) to dynamically load Contacts, Freight, Books, and Tenant Admin from their own ports at runtime. Authenticates via Keycloak client `cargoez-web`.

**Key features:**
- Sidebar navigation with module integration
- Dashboard with tenant-specific data
- Module Federation host — loads remote components on demand
- `ServiceErrorBoundary` — graceful fallback when a remote is unavailable
- ABAC-based permission gating via `@rajkumarganesan93/auth`

### SysAdmin Portal (`apps/admin`) — admin.cargoez.com

Standalone administration application for platform management. **Fully integrated with the real backend** — connects to admin-service (port 3001) with Keycloak PKCE authentication via client `cargoez-admin`.

**Key features:**
- **Keycloak PKCE authentication** — login required via `cargoez-admin` client
- **Tenant management** — CRUD operations for tenants, branches, app customers
- **Admin roles & permissions** — manage SysAdmin-level access control
- **Products & subscriptions** — product catalog and subscription management
- **Metadata management** — system-level metadata (countries, tenant types)
- **Generic CRUD** — `AdminCrudPage` component with integrated permission gating

## Micro-Frontend Modules

Each module is a self-contained micro-frontend that follows Clean Architecture. Using **Module Federation**, each module runs as an independent application on its own port, exposing page components that the shell loads at runtime.

| Module | Package Name | Port | Description |
|---|---|---|---|
| Contacts | `@rajkumarganesan93/contacts` | 5174 | Contact management (CRUD) |
| Freight | `@rajkumarganesan93/freight` | 5175 | Shipment tracking and management |
| Books | `@rajkumarganesan93/books` | 5176 | Booking ledger and invoicing |
| Tenant Admin | `@rajkumarganesan93/tenant-admin` | — | Tenant-level admin (roles, permissions, users) |

Each module:
- **Exposes** page components via `remoteEntry.js` (ContactsList, ContactDetail, ContactForm, etc.)
- **Exports** navigation config (`*NavItem`) for the shell's sidebar
- **Runs standalone** for isolated development and testing
- **Deploys independently** -- bug fixes ship without touching other modules

See [MICROFRONTEND.md](MICROFRONTEND.md) for the complete architecture documentation.

## Shared Packages

### `@rajkumarganesan93/uicontrols`

Reusable UI component library with theme support.

**Components:** `Button`, `TextField`, `Toast`, `ToastProvider`, `ThemeProvider`, `ServiceErrorBoundary`

**Features:**
- Six color variants (primary, secondary, success, warning, error, info)
- Three variants per component (contained/outlined/text for Button; outlined/filled/standard for TextField)
- Built-in form validation
- Toast notification system
- Light/dark theme support via CSS custom properties
- Storybook documentation

### `@rajkumarganesan93/uifunctions`

Shared utility functions — applications import utilities exclusively from this package.

**Modules:**
- **API** — Axios client with `setAuthToken()` for dynamic token injection, request interceptor, 401 retry with `setTokenRefresher()`, structured error handling
- **Real-Time** — `RealtimeProvider` context, `useRealtimeSync` hook for Socket.IO live data sync
- **Date/Time** — `formatDate`, `timeAgo`, `convertTimezone` (via date-fns and Luxon)
- **Text** — `slugify`, `capitalizeFirstLetter`, `truncate`
- **Validation** — `rules.required()`, `rules.email()`, `rules.minLength()`, `rules.maxLength()`, `rules.pattern()`

### `@rajkumarganesan93/auth`

Keycloak PKCE authentication package with automatic token refresh.

**Exports:** `AuthProvider`, `ProtectedRoute`, `useAuth`

**Token lifecycle:**
- Proactive refresh every 30 seconds (refreshes if token expires within 70 seconds)
- `onTokenExpired` event handler as safety net
- `getToken()` async method for on-demand token refresh
- Automatic redirect to Keycloak login on refresh failure
- Token state synced to React context (re-renders consumers on refresh)

## Clean Architecture

Every module and the admin app follow a strict layered architecture:

```
module/src/
├── domain/                    # Layer 1: Business core (no external dependencies)
│   ├── entities/              #   Pure TypeScript interfaces (e.g., Contact, Shipment)
│   └── repositories/          #   Repository contracts / ports (e.g., IContactRepository)
├── application/               # Layer 2: Use cases (depends on domain only)
│   └── use-cases/             #   Business orchestration classes (e.g., ContactUseCases)
├── infrastructure/            # Layer 3: External adapters (implements domain ports)
│   ├── endpoints/             #   Centralized API URL constants
│   └── repositories/          #   API repository implementations (e.g., ContactApiRepository)
├── presentation/              # Layer 4: UI (depends on application layer)
│   ├── hooks/                 #   React state management hooks
│   ├── layouts/               #   Layout components (apps only)
│   └── pages/                 #   Page components
├── di/                        # Dependency injection
│   └── container.ts           #   Wires repositories → use cases
├── routes.tsx                 # Lazy-loaded route definitions
├── nav.ts                     # Navigation item config
└── index.ts                   # Public module API
```

**Dependency rule:** Inner layers never import from outer layers.

```
Domain ← Application ← Infrastructure
                      ← Presentation
                      ← DI (wires everything)
```

**Key patterns:**
- **Repository Pattern** — Interface in domain, implementation in infrastructure
- **Dependency Inversion** — Use cases depend on abstract `IRepository`, not concrete API calls
- **Use Cases** — Encapsulate business operations, injectable via DI container
- **Separation of Concerns** — Entities, API, React UI, and wiring are fully isolated

## Theming

The design system uses **Tailwind CSS v4** with custom theme colors defined in `@theme` blocks. Colors are provided by the `uicontrols` package via `ThemeProvider`, which sets CSS custom properties (`--color-primary`, `--color-success`, etc.) on the wrapper element.

**Available theme colors:** `primary`, `secondary`, `success`, `warning`, `error`, `info`

Each color has variants: `*-dark`, `*-light`, `*-contrast`, `*-disabled`

Usage in components:

```tsx
<div className="bg-primary text-primary-contrast">
<div className="border-grey-300 text-text-secondary">
<div className="bg-bg-paper hover:bg-action-hover">
```

Applications must include `@source` directives in their `index.css` to scan module source directories for Tailwind class usage:

```css
@import "tailwindcss";
@source "../../../packages/uicontrols/src";
@source "../../../modules/contacts/src";
```

## Environment Variables

Both applications use `.env` files (not committed; `.env.example` is provided):

| Variable | Description | Default | Used by |
|---|---|---|---|
| `VITE_API_BASE_URL` | Backend API Portal URL | `http://localhost:4000` | Both portals |
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` | Both portals |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `cargoez` | Both portals |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak PKCE client ID | `cargoez-admin` (admin) / `cargoez-web` (tenant) | Both portals |

## Backend Integration

This frontend connects to the CargoEz Backend microservices:

| Service | Port | Swagger UI | Purpose |
|---|---|---|---|
| **API Portal** | 4000 | http://localhost:4000/api-docs | Aggregated Swagger + API routing |
| **Admin Service** | 3001 | http://localhost:3001/admin-service/api-docs | Central management — tenants, users, roles, permissions |
| **Freight Service** | 3002 | http://localhost:3002/freight-service/api-docs | Freight / shipment operations |
| **Contacts Service** | 3003 | http://localhost:3003/contacts-service/api-docs | Contact management |
| **Books Service** | 3004 | http://localhost:3004/books-service/api-docs | Books / accounting |
| **Keycloak** | 8080 | — | Authentication (realm: `cargoez`) |

### Two-Portal Architecture

| Portal | App | Keycloak Client | URL |
|---|---|---|---|
| SysAdmin Portal | `apps/admin` | `cargoez-admin` | admin.cargoez.com (dev: :5177) |
| Tenant Portal | `apps/cargoez` | `cargoez-web` | app.cargoez.com (dev: :5173) |

### API Endpoint Convention

All backend service endpoints are prefixed with the service name:

```
GET    /admin-service/tenants               # List tenants
GET    /admin-service/me/context            # Get current user context + permissions
POST   /admin-service/app-customers         # Create app customer

GET    /freight-service/shipments           # List shipments (tenant-scoped)
GET    /contacts-service/contacts           # List contacts (tenant-scoped)
GET    /books-service/invoices              # List invoices (tenant-scoped)
```

### Authentication

Both portals use Keycloak PKCE authentication via the `@rajkumarganesan93/auth` package:

1. On login, a JWT access token is obtained via PKCE Authorization Code flow
2. The `onToken` callback calls `setAuthToken(token)` to store the token in the axios module
3. A **request interceptor** dynamically injects `Authorization: Bearer <token>` before every API request
4. Token refresh is proactive (every 30s) with a 401 retry interceptor as backup
5. The `PermissionProvider` fetches user context and permissions from `/admin-service/me/context`

### Permission Gating

Frontend permission gating uses the `can(operation, module)` function from `@rajkumarganesan93/auth`:

```tsx
const { can } = usePermissions();

{can('create', 'contacts') && <Button>Create Contact</Button>}
```

This is **cosmetic enforcement** — the backend guards are the actual security boundary.

**Test users** (realm: `cargoez`):

| User | Password | Portal | Role |
|---|---|---|---|
| `admin@cargoez.com` | `admin123` | SysAdmin (:5177) | Super Admin |
| `support@cargoez.com` | `support123` | SysAdmin (:5177) | Support Admin |
| `manager@demo.cargoez.com` | `demo123` | Tenant (:5173) | Manager |
| `viewer@demo.cargoez.com` | `demo123` | Tenant (:5173) | Viewer |
| `manager@acme.cargoez.com` | `acme123` | Tenant (:5173) | Manager |
| `admin@globalfreight.cargoez.com` | `global123` | Tenant (:5173) | Admin (Enterprise) |

### API Response Format

All APIs return a consistent JSON envelope:

```json
{
  "success": true,
  "messageCode": "CREATED",
  "message": "Resource created successfully",
  "data": { ... }
}
```

Paginated list responses:

```json
{
  "success": true,
  "messageCode": "LIST_FETCHED",
  "data": {
    "data": [ ... ],
    "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
  }
}
```

The `uifunctions` API client includes interceptors that extract backend messages for display via the Toast notification system. Success and error messages always come from the backend, not hardcoded in the frontend.

### Base Entity Shape

All domain entities follow the backend `BaseEntity` shape with camelCase field names:

```typescript
interface BaseEntity {
  uid: string;              // UUID primary key
  tenantUid?: string;       // Tenant identifier
  isActive: boolean;        // Soft-delete flag
  createdAt: string;        // ISO 8601
  modifiedAt: string;       // ISO 8601
  createdBy?: string;
  modifiedBy?: string;
}
```

## Storybook

The `uicontrols` package includes Storybook for component documentation and visual testing:

```bash
npm run storybook
```

Opens at http://localhost:6006 with stories for Button, TextField, and Toast components across all variants, sizes, and states. Theme switching (light/dark) is available in the Storybook toolbar.

## Testing

```bash
# Run all tests
npm run test:all

# Run tests for a specific package
npm run test -w packages/uifunctions
npm run test -w packages/uicontrols
```

Uses **Vitest** with **React Testing Library** and **jsdom** for component testing.

## Code Quality

- **TypeScript** — Strict mode with `erasableSyntaxOnly`, `verbatimModuleSyntax`, `noUnusedLocals`
- **ESLint** — Configured per package with React Hooks and React Refresh plugins
- **Tailwind CSS** — All styling via utility classes; zero hardcoded colors
- **Clean Architecture** — Enforced layer separation across all modules

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 5.9.x | Type safety |
| Vite | 7.x | Build tool and dev server |
| vite-plugin-federation | 1.x | Module Federation for micro-frontends |
| Tailwind CSS | 4.x | Styling |
| Axios | 1.x | HTTP client |
| React Router | 7.x | Routing |
| Storybook | 10.x | Component documentation |
| Vitest | 4.x | Testing framework |
| date-fns | 4.x | Date utilities |
| Luxon | 3.x | Timezone handling |
| Socket.IO Client | 4.x | Real-time data sync |
| Keycloak JS | — | Authentication (PKCE) |

## License

Private — internal use only.
