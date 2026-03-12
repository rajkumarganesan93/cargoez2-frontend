# @rajkumarganesan93/uicontrols

A premium React + TypeScript UI component library with built‑in accessibility, validation, and theme‑aware styling.  
Current release includes **Button** and **TextField** components.

---

## 📦 Installation

```bash
npm install @rajkumarganesan93/uicontrols
# or
yarn add @rajkumarganesan93/uicontrols

🚀 Usage
TextField Example

import React, { useRef } from "react";
import { TextField } from "@rajkumarganesan93/uicontrols";

export default function LoginForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form>
      <TextField
        id="username"
        label="Username"
        placeholder="Enter username"
        autoFocus
        onChange={(e) => console.log("Value:", e.target.value)}
        ref={inputRef} // ✅ works via forwardRef
      />
    </form>
  );
}

Button Example

import React from "react";
import { Button } from "@rajkumarganesan93/uicontrols";

export default function SubmitButton() {
  return (
    <Button variant="primary" onClick={() => alert("Submitted!")}>
      Submit
    </Button>
  );
}

## ServiceErrorBoundary

Error boundary component for gracefully handling micro-frontend loading failures.

```tsx
import { ServiceErrorBoundary } from "@rajkumarganesan93/uicontrols";

<ServiceErrorBoundary serviceName="Contacts" key={location.pathname}>
  <ContactsList />
</ServiceErrorBoundary>
```

When a remote module fails to load, it displays:
- A friendly "{Service} Service Unavailable" message
- A **Retry** button to re-attempt loading
- A collapsible **Technical details** section with the actual error
- Automatically resets when the user navigates to a different route (via `key` prop)

## Components

| Component | Description |
|---|---|
| `Button` | Multi-variant button with 6 color schemes and 3 styles |
| `TextField` | Input field with validation, 3 variants, and `forwardRef` |
| `Toast` / `ToastProvider` | Toast notification system |
| `ThemeProvider` | Light/dark theme support via CSS custom properties |
| `ServiceErrorBoundary` | Micro-frontend error boundary with retry |
