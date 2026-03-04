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
│  │   CargoEz App    │   │     Admin Panel         │  │
│  │   (port 5173)    │   │     (port 5174)         │  │
│  └────────┬─────────┘   └────────┬───────────────┘  │
│           │                      │                   │
│  ┌────────┴──────────────────────┴───────────────┐  │
│  │          Micro-Frontend Modules                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │  │
│  │  │ Contacts │  │ Freight  │  │  Books   │    │  │
│  │  └──────────┘  └──────────┘  └──────────┘    │  │
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
│   └── books/                 #   Booking ledger & invoicing
├── apps/                      # Deployable applications
│   ├── cargoez/               #   Main web application (shell)
│   └── admin/                 #   Admin panel (connected to real backend)
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
- **CargoEz Backend** running (user-service on port 3001, API Portal on port 4000)

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
# Main application
npm run dev:cargoez

# Admin panel (in a separate terminal)
npm run dev:admin
```

- **CargoEz App**: http://localhost:5173
- **Admin Panel**: http://localhost:5174

## Available Scripts

Run from the repository root:

| Command | Description |
|---|---|
| `npm run dev:cargoez` | Start CargoEz app dev server (port 5173) |
| `npm run dev:admin` | Start Admin panel dev server (port 5174) |
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

### CargoEz App (`apps/cargoez`)

The main web application that serves as the **shell** for all micro-frontend modules. It dynamically loads and composes the Contacts, Freight, and Books modules via lazy-loaded routes.

**Key features:**
- Sidebar navigation with module integration
- Dashboard with stats and quick actions
- UI Demo page showcasing all shared components
- Route-based micro-frontend composition

### Admin Panel (`apps/admin`)

Standalone administration application with its own Clean Architecture structure. **Fully integrated with the real backend** — connects to the user-service (port 3001) with Keycloak PKCE authentication and Socket.IO real-time data sync.

**Key features:**
- **Keycloak PKCE authentication** — login required, JWT tokens on all API calls
- **Automatic token refresh** — proactive refresh before expiry, 401 retry interceptor, `onTokenExpired` safety net
- **User management** — full CRUD with paginated list, inline create/edit forms, server-side search, phone field, soft-delete with confirmation
- **Real-time sync** — live/offline indicator, auto-refresh when another user modifies data via Socket.IO
- **System settings** — API Gateway and Keycloak configuration display
- **Admin dashboard** — system stats overview

## Micro-Frontend Modules

Each module is a self-contained feature package that follows Clean Architecture. Modules export their route definitions and navigation configuration, which the shell app consumes.

| Module | Package Name | Description |
|---|---|---|
| Contacts | `@rajkumarganesan93/contacts` | Contact management (CRUD) |
| Freight | `@rajkumarganesan93/freight` | Shipment tracking and management |
| Books | `@rajkumarganesan93/books` | Booking ledger and invoicing |

Each module exports:
- `*Routes` — Lazy-loaded route definitions for the shell app
- `*NavItem` — Navigation item configuration (label, path, icon)

## Shared Packages

### `@rajkumarganesan93/uicontrols`

Reusable UI component library with theme support.

**Components:** `Button`, `TextField`, `Toast`, `ToastProvider`, `ThemeProvider`

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
| `VITE_API_BASE_URL` | Backend API Portal URL | `http://localhost:4000` | Both apps |
| `VITE_USER_SERVICE_URL` | User service direct URL | `http://localhost:3001` | Admin only |
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` | Admin only |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `cargoez` | Admin only |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak PKCE client ID | `cargoez-web` | Admin only |

## Backend Integration

This frontend connects to the [CargoEz Backend](https://github.com/rajkumarganesan93/cargoez2-backend) microservices:

| Service | Port | Swagger UI | Purpose |
|---|---|---|---|
| **API Portal** | 4000 | http://localhost:4000/api-docs | Aggregated Swagger + API routing |
| **User Service** | 3001 | http://localhost:3001/user-service/api-docs | User CRUD — Admin Panel connects directly |
| **Keycloak** | 8080 | — | Authentication (realm: `cargoez`, PKCE client: `cargoez-web`) |

### API Endpoint Convention

All backend service endpoints are prefixed with the service name. For the user-service:

```
Base URL: http://localhost:3001  (or http://localhost:4000 via API Portal)

GET    /user-service/users                  # List users (paginated, searchable)
GET    /user-service/users/:id              # Get user by ID
GET    /user-service/users/me               # Get current user context
POST   /user-service/users                  # Create user (admin role)
PUT    /user-service/users/:id              # Update user (admin role)
DELETE /user-service/users/:id              # Soft-delete user (admin role)
GET    /user-service/health                 # Health check (public)
```

### Authentication

The **Admin Panel** uses Keycloak PKCE authentication via the `@rajkumarganesan93/auth` package:

1. On login, a JWT access token is obtained via PKCE Authorization Code flow
2. The `onToken` callback calls `setAuthToken(token)` to store the token in the axios module
3. A **request interceptor** dynamically injects `Authorization: Bearer <token>` before every API request
4. Token refresh is proactive (every 30s) with a 401 retry interceptor as backup
5. The token is also passed to `RealtimeProvider` for authenticated Socket.IO connections

**Keycloak client setup (required):** The `cargoez-web` client in Keycloak must have these redirect URIs configured:
- `http://localhost:5173/*` (CargoEz app)
- `http://localhost:5174/*` (Admin Panel)

**Test users** (realm: `cargoez`):

| Username | Password | Roles | Access |
|---|---|---|---|
| `admin` | `admin123` | admin, user | Full CRUD |
| `manager` | `manager123` | manager, user | Read + Update |
| `testuser` | `test123` | user | Read only |

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

### User Entity

```typescript
interface User {
  id: string;              // UUID
  name: string;
  email: string;
  phone?: string;
  createdAt: string;       // ISO 8601
  modifiedAt: string;      // ISO 8601
  createdBy?: string;
  modifiedBy?: string;
  tenantId?: string;
}
```

### Real-Time Data Sync

The Admin Panel uses Socket.IO to receive real-time updates when data is modified by another user. The user-service emits `data-changed` events. The frontend auto-refreshes affected lists and shows Toast notifications. See [DEVELOPMENT.md](DEVELOPMENT.md) for integration details.

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
