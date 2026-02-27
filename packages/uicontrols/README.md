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
