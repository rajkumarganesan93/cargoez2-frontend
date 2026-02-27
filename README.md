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
│   ├── uifunctions/           #   Utility functions (API client, date, validation)
│   └── auth/                  #   Keycloak PKCE authentication
├── modules/                   # Micro-frontend feature modules
│   ├── contacts/              #   Contact management
│   ├── freight/               #   Freight & shipment tracking
│   └── books/                 #   Booking ledger & invoicing
├── apps/                      # Deployable applications
│   ├── cargoez/               #   Main web application (shell)
│   └── admin/                 #   Admin panel
├── package.json               # Root workspace config
├── tsconfig.base.json         # Shared TypeScript config
├── .npmrc.example             # NPM registry config template
└── .gitignore
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (uses npm workspaces)
- **Git**

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

Standalone administration application with its own Clean Architecture structure.

**Key features:**
- User management (CRUD, disable)
- System settings (API Gateway, Keycloak configuration)
- Admin dashboard with system stats

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
- **API** — Axios client with configurable base URL, response interceptors, structured error handling
- **Date/Time** — `formatDate`, `timeAgo`, `convertTimezone` (via date-fns and Luxon)
- **Text** — `slugify`, `capitalizeFirstLetter`, `truncate`
- **Validation** — `rules.required()`, `rules.email()`, `rules.minLength()`, `rules.maxLength()`, `rules.pattern()`

### `@rajkumarganesan93/auth`

Keycloak PKCE authentication package.

**Exports:** `AuthProvider`, `ProtectedRoute`, `useAuth`

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

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API gateway URL | `http://localhost:4000` |
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `cargoez` |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak PKCE client ID | `cargoez-web` |

## Backend Integration

This frontend connects to the [CargoEz Backend](https://github.com/rajkumarganesan93/cargoez2-backend) microservices:

- **API Gateway** — Port 4000 (entry point for all frontend API calls)
- **User Service** — Port 3001
- **Keycloak** — Port 8080 (realm: `cargoez`, PKCE client: `cargoez-web`)

All APIs return a consistent response format:

```json
{
  "success": true,
  "messageCode": "CONTACT_CREATED",
  "message": "Contact created successfully",
  "data": { ... },
  "timestamp": "2026-02-27T10:00:00.000Z"
}
```

The `uifunctions` API client includes interceptors that extract backend messages for display via the Toast notification system. Success and error messages always come from the backend, not hardcoded in the frontend.

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
| Keycloak JS | — | Authentication (PKCE) |

## License

Private — internal use only.
