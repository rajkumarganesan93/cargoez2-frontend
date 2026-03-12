# Micro-Frontend Architecture (v2 -- Module Federation)

This document describes the **Module Federation** architecture where the CargoEz shell app and each feature module (Contacts, Freight, Books) run as **independent applications on separate ports**, enabling independent development, testing, and deployment.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Tenant Portal (Host)          http://localhost:5173                        │
│  - Dashboard, Layout, Navigation                                           │
│  - Loads remote modules on demand via Module Federation                    │
│  - ServiceErrorBoundary handles remote failures gracefully                 │
│  - ABAC permission gating via PermissionProvider                           │
└─────────────────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Contacts    │ │  Freight     │ │  Books       │ │ Tenant Admin │
│  :5174       │ │  :5175       │ │  :5176       │ │  (embedded)  │
│ remoteEntry  │ │ remoteEntry  │ │ remoteEntry  │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  SysAdmin Portal              http://localhost:5177                         │
│  - Standalone app (not federated, Keycloak PKCE auth via cargoez-admin)    │
│  - Tenant management, admin roles, products, subscriptions, metadata       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Port Assignments

| App | Role | Port | URL |
|---|---|---|---|
| CargoEz (shell) | Host -- loads remote modules | 5173 | http://localhost:5173 |
| Contacts | Remote micro-frontend | 5174 | http://localhost:5174 |
| Freight | Remote micro-frontend | 5175 | http://localhost:5175 |
| Books | Remote micro-frontend | 5176 | http://localhost:5176 |
| Admin Panel | Standalone app | 5177 | http://localhost:5177 |

## Technology

- **Plugin**: [`@originjs/vite-plugin-federation`](https://github.com/nicosResworworkeduit/vite-plugin-federation) (Vite Module Federation)
- **Build requirement**: All federated apps (host + remotes) must be **built** before serving. The plugin generates `remoteEntry.js` only during `vite build`, not in Vite dev mode.
- **Serving**: Each app runs `vite build && vite preview --port <PORT>` for local development.

## Running the Apps

### Option 1: Run all at once

```bash
npm run dev:all
```

Starts all 5 apps (shell + 3 remotes + admin) in parallel using `concurrently`. Requires ports 5173-5177 to be free. Remotes build first (~5-10 seconds), then all apps start serving.

### Option 2: Run individually

```bash
# Terminal 1 -- Start remotes first (required before the shell can load them)
npm run dev:contacts   # builds + serves on port 5174
npm run dev:freight    # builds + serves on port 5175
npm run dev:books      # builds + serves on port 5176

# Terminal 2 -- Start shell (after remotes are ready)
npm run dev:cargoez    # builds + serves on port 5173

# Terminal 3 (optional) -- Admin
npm run dev:admin      # dev server on port 5177
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev:all` | Start all 5 apps in parallel |
| `npm run dev:cargoez` | Build and serve the shell on port 5173 |
| `npm run dev:contacts` | Build and serve Contacts remote on port 5174 |
| `npm run dev:freight` | Build and serve Freight remote on port 5175 |
| `npm run dev:books` | Build and serve Books remote on port 5176 |
| `npm run dev:admin` | Start Admin dev server on port 5177 |

## How Module Federation Works

### 1. Remotes Expose Components

Each remote module configures `vite-plugin-federation` to expose its page components and navigation config via a `remoteEntry.js` manifest:

```ts
// modules/contacts/vite.config.ts
federation({
  name: "contacts",
  filename: "remoteEntry.js",
  exposes: {
    "./ContactsList": "./src/presentation/pages/ContactsList",
    "./ContactDetail": "./src/presentation/pages/ContactDetail",
    "./ContactForm": "./src/presentation/pages/ContactForm",
    "./nav": "./src/nav",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
    "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
    "@rajkumarganesan93/uicontrols": { singleton: true, requiredVersion: "*" },
    "@rajkumarganesan93/uifunctions": { singleton: true, requiredVersion: "*" },
  },
})
```

### 2. Host Declares Remotes

The shell app configures the URLs where each remote's `remoteEntry.js` is served:

```ts
// apps/cargoez/vite.config.ts
federation({
  name: "cargoez",
  remotes: {
    contacts: "http://localhost:5174/assets/remoteEntry.js",
    freight: "http://localhost:5175/assets/remoteEntry.js",
    books: "http://localhost:5176/assets/remoteEntry.js",
  },
  shared: { /* same shared config as remotes */ },
})
```

The base URL is configurable via `VITE_REMOTE_BASE` environment variable (defaults to `http://localhost`).

### 3. Shell Dynamically Imports Remote Components

```tsx
// apps/cargoez/src/App.tsx
const ContactsList = lazy(() => import("contacts/ContactsList"));
const FreightList  = lazy(() => import("freight/FreightList"));
const BooksList    = lazy(() => import("books/BooksList"));
```

These are **not** normal imports. The federation plugin intercepts them at runtime, fetches `remoteEntry.js` from the corresponding remote, and loads the requested component chunk.

### 4. Runtime Flow

```
User visits http://localhost:5173/contacts
  → React Router matches /contacts route
  → lazy(() => import("contacts/ContactsList")) triggers
  → Federation plugin fetches http://localhost:5174/assets/remoteEntry.js
  → remoteEntry.js tells the shell where to find the ContactsList chunk
  → Shell downloads the ContactsList chunk from :5174
  → Component renders inside the Shell's layout (sidebar + header remain)
```

## Shared Dependencies

Both host and remotes declare the same shared dependencies with `singleton: true`:

| Dependency | Why Shared |
|---|---|
| `react` | Only one React instance can exist per page (hooks break otherwise) |
| `react-dom` | Must match the React instance |
| `react-router-dom` | Must share router context between shell and remotes |
| `@rajkumarganesan93/uicontrols` | Consistent UI components and theme across all modules |
| `@rajkumarganesan93/uifunctions` | Shared API client, utilities, and real-time sync |

The shell's copy of these libraries is shared with all remotes at runtime. Remotes do not bundle their own copies, reducing total bundle size.

## Error Handling -- ServiceErrorBoundary

The shell wraps every federated route with a `ServiceErrorBoundary` component (from `@rajkumarganesan93/uicontrols`). If a remote is down or fails to load:

- A friendly error page is displayed: **"{Service} Service Unavailable"**
- A **Retry** button allows the user to re-attempt loading
- A collapsible **Technical details** section shows the actual error
- The error state resets automatically when the user navigates to a different route (using `key={location.pathname}`)

Other modules continue working normally. The shell, sidebar, and navigation remain fully functional.

```tsx
// apps/cargoez/src/App.tsx
<FederatedRoute serviceName="Contacts">
  <ContactsList />
</FederatedRoute>
```

## Standalone Mode

Each remote can run independently for isolated development and testing:

- http://localhost:5174 -- Contacts module with its own routes and layout
- http://localhost:5175 -- Freight module with its own routes and layout
- http://localhost:5176 -- Books module with its own routes and layout

Each module has its own `index.html`, `main.tsx`, and `App.tsx` for standalone operation.

## Independent Deployment

Each micro-frontend builds and deploys independently:

| Concern | Independent? |
|---|---|
| Fix bugs | Yes -- only touch the affected module |
| Build | Yes -- `npm run build -w modules/contacts` |
| Deploy | Yes -- deploy only that module's `dist/` folder |
| Test in isolation | Yes -- each module runs standalone |
| Release cycle | Yes -- ship whenever ready |

When a remote is redeployed, the shell picks up the new `remoteEntry.js` automatically on the user's next navigation. No shell rebuild or redeployment is required.

**Important**: Shared dependency upgrades (React, router, UI libraries) must be coordinated across all modules since `singleton: true` ensures only one copy loads.

## Production Build

Each app builds independently:

```bash
npm run build -w modules/contacts
npm run build -w modules/freight
npm run build -w modules/books
npm run build -w apps/cargoez
npm run build -w apps/admin
```

For production, deploy each remote to its own URL and set `VITE_REMOTE_BASE` when building the shell:

```bash
VITE_REMOTE_BASE=https://cdn.example.com npm run build -w apps/cargoez
```

## CORS Configuration

Each remote's `vite.config.ts` has `cors: true` on both `server` and `preview` sections to allow the shell (running on a different port) to fetch `remoteEntry.js` and component chunks.

## Keycloak Configuration

The `cargoez-web` client in Keycloak must include redirect URIs and web origins for all ports:

**Valid Redirect URIs:**
```
http://localhost:5173/*
http://localhost:5174/*
http://localhost:5175/*
http://localhost:5176/*
http://localhost:5177/*
```

**Web Origins:**
```
http://localhost:5173
http://localhost:5174
http://localhost:5175
http://localhost:5176
http://localhost:5177
```

## Key File Locations

| File | Purpose |
|---|---|
| `apps/cargoez/vite.config.ts` | Host federation config (remote URLs, shared deps) |
| `apps/cargoez/src/App.tsx` | Shell routing with lazy imports and error boundaries |
| `apps/cargoez/src/vite-env.d.ts` | TypeScript declarations for federated module imports |
| `modules/*/vite.config.ts` | Remote federation config (exposes, shared deps) |
| `modules/*/src/App.tsx` | Standalone entry point for isolated development |
| `modules/*/index.html` | Standalone HTML entry |
| `modules/*/src/main.tsx` | Standalone React mount |
| `types/vite-plugin-federation.d.ts` | Corrected type definitions (adds `singleton` to `SharedConfig`) |
| `packages/uicontrols/src/components/ServiceErrorBoundary/` | Error boundary for remote failures |

## Troubleshooting

### "Failed to fetch dynamically imported module"
The remote app is not running on the expected port. Start the remote first, then refresh the shell.

### Blank white page on the shell
The shell must be **built** (not in dev mode) for Module Federation to work. Ensure the shell's dev script is `tsc -b && vite build && vite preview --port 5173`.

### Port conflicts
Kill existing node processes before running `dev:all`. All five ports (5173-5177) must be free.

### CORS errors
Ensure each remote's `vite.config.ts` has `cors: true` in both `server` and `preview` sections.

### Error boundary shows "Something Went Wrong" for all routes
Each `ServiceErrorBoundary` must have a unique `key` based on the current URL path. The shell uses `key={location.pathname}` to reset the error state on navigation.

### "Invalid parameter: redirect_uri" on Keycloak login
The `cargoez-web` client in Keycloak is missing the port in its allowed redirect URIs. See [Keycloak Configuration](#keycloak-configuration) above.

### TypeScript error: "singleton does not exist in type SharedConfig"
The `types/vite-plugin-federation.d.ts` file provides corrected type definitions. Ensure each project's `tsconfig.json` includes `"../../types/**/*.d.ts"` in its `include` array, and `tsconfig.base.json` has the `paths` mapping for `@originjs/vite-plugin-federation`.
