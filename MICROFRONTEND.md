# Micro-Frontend Architecture (v2 — Separate Ports)

This document describes the **Module Federation** setup where Contacts, Freight, and Books run as **standalone remote apps** on separate ports.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CargoEz Shell (Host)          http://localhost:5173                        │
│  - Dashboard, UI Demo, Layout                                               │
│  - Loads remote components on demand via Module Federation                   │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Contacts       │  │  Freight        │  │  Books          │
│  :5174          │  │  :5175          │  │  :5176          │
│  remoteEntry.js │  │  remoteEntry.js │  │  remoteEntry.js │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Admin Panel                  http://localhost:5177                         │
│  - Standalone app (not federated)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Ports

| App | Port | URL |
|-----|------|-----|
| CargoEz (shell) | 5173 | http://localhost:5173 |
| Contacts (remote) | 5174 | http://localhost:5174 |
| Freight (remote) | 5175 | http://localhost:5175 |
| Books (remote) | 5176 | http://localhost:5176 |
| Admin Panel | 5177 | http://localhost:5177 |

## Running the Apps

### Option 1: Run all at once

```bash
npm run dev:all
```

Starts all 5 apps (shell + 3 remotes + admin) in parallel. **Requires ports 5173–5177 to be free.**

### Option 2: Run individually

```bash
# Terminal 1 — Start remotes first (required for shell to load them)
npm run dev:contacts   # port 5174
npm run dev:freight    # port 5175
npm run dev:books      # port 5176

# Terminal 2 — Start shell
npm run dev:cargoez    # port 5173

# Terminal 3 (optional) — Admin
npm run dev:admin      # port 5177
```

### Option 3: Run remotes + shell only (no admin)

```bash
# Terminal 1
npm run dev:contacts &
npm run dev:freight &
npm run dev:books &

# Terminal 2
npm run dev:cargoez
```

## How It Works

1. **Remotes** (contacts, freight, books) expose their page components via `@originjs/vite-plugin-federation`:
   - `ContactsList`, `ContactDetail`, `ContactForm`
   - `FreightList`, `FreightDetail`, `FreightForm`
   - `BooksList`, `BookDetail`, `BookForm`

2. **Host** (cargoez) configures remotes in `vite.config.ts`:
   ```ts
   remotes: {
     contacts: 'http://localhost:5174/remoteEntry.js',
     freight: 'http://localhost:5175/remoteEntry.js',
     books: 'http://localhost:5176/remoteEntry.js',
   }
   ```

3. **Shell** dynamically imports remote components:
   ```tsx
   const ContactsList = lazy(() => import('contacts/ContactsList'));
   ```

4. When you navigate to `/contacts`, the shell fetches `remoteEntry.js` from the contacts app and loads the component. The remote runs on its own port and serves its own bundle.

## Standalone Mode

Each remote can also run **standalone** for development or testing:

- http://localhost:5174 — Contacts module with its own routes
- http://localhost:5175 — Freight module with its own routes
- http://localhost:5176 — Books module with its own routes

## Production Build

Each app builds independently:

```bash
npm run build -w modules/contacts
npm run build -w modules/freight
npm run build -w modules/books
npm run build -w apps/cargoez
npm run build -w apps/admin
```

For production, deploy each remote to its own URL (e.g. `https://contacts.example.com`, `https://freight.example.com`) and set `VITE_REMOTE_BASE` when building the shell:

```bash
VITE_REMOTE_BASE=https://your-app.com npm run build -w apps/cargoez
```

The remote URLs in the host config use `VITE_REMOTE_BASE` (default: `http://localhost`).

## Troubleshooting

- **"Failed to fetch dynamically imported module"** — Ensure the remote app is running on the expected port. The shell loads remotes at runtime.
- **Port conflicts** — Kill any existing node processes. Run `npm run dev:all` only when ports 5173–5177 are free.
- **CORS errors** — Remotes have `cors: true` in their Vite config. If issues persist, check the remote dev server is running.
