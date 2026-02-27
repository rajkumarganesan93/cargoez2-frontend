```markdown
# @rajkumarganesan93/uifunctions

A lightweight TypeScript utility library that provides:
- **Axios client helpers** (`api.get`, `api.post`, `api.put`, `api.del`) with configuration support.
- **Datetime utilities** (`formatDate`, `timeAgo`, `convertTimezone`) powered by date-fns and Luxon.
- **Text utilities** (`capitalize`, `truncate`, `slugify`) for string manipulation.
- **Collections utilities** (`unique`, `chunk`, `deepClone`) for arrays and objects.
- **Validation utilities** (`isEmail`, `isEmpty`) for common checks.
- **Exceptions utilities** (`safeExecute`, `logError`, `formatError`) for error handling.

Designed for reuse across multiple applications.

---

## 📦 Installation

```bash
npm install @rajkumarganesan93/uifunctions
```

---

## ⚙️ Setup (Axios Client)

Before making requests, configure the client once at application startup:

```ts
import { configureClient } from "@rajkumarganesan93/uifunctions";

configureClient({
  baseURL: import.meta.env.VITE_API_BASE_URL, // or process.env.API_BASE_URL in Node
  timeout: 10000,
});
```

---

## 🚀 Usage

### API Helpers
```ts
import { api } from "@rajkumarganesan93/uifunctions";

type User = { id: number; name: string };

// GET
const users = await api.get<User[]>("/users");

// POST
const newUser = await api.post<User>("/users", { name: "Rajkumar" });

// PUT
const updatedUser = await api.put<User>("/users/1", { name: "Updated Name" });

// DELETE
await api.del<void>("/users/1");
```

---

### Datetime Utilities
```ts
import { formatDate, timeAgo, convertTimezone } from "@rajkumarganesan93/uifunctions";

// Format date
console.log(formatDate("2026-02-16T12:00:00Z", "dd/MM/yyyy")); 
// "16/02/2026"

// Relative time (long format, past)
console.log(timeAgo(new Date(Date.now() - 3600000))); 
// "1 hour ago"

// Relative time (long format, future)
console.log(timeAgo(new Date(Date.now() + 3 * 86400000))); 
// "in 3 days"

// Relative time (short format, past)
console.log(timeAgo(new Date(Date.now() - 5 * 60000), { short: true })); 
// "5m ago"

// Relative time (short format, future)
console.log(timeAgo(new Date(Date.now() + 2 * 7 * 86400000), { short: true })); 
// "in 2w"

// Timezone conversion
console.log(convertTimezone("2026-02-16T12:00:00Z", "UTC", "Asia/Kolkata")); 
// "2026-02-16T17:30:00+05:30"
```

---

### Text Utilities
```ts
import { capitalize, truncate, slugify } from "@rajkumarganesan93/uifunctions";

// Capitalize
console.log(capitalize("rajkumar")); // "Rajkumar"

// Truncate
console.log(truncate("This is a long sentence", 10)); // "This is a ..."

// Slugify
console.log(slugify("Hello World Example")); // "hello-world-example"
```

---

### Collections Utilities
```ts
import { unique, chunk, deepClone } from "@rajkumarganesan93/uifunctions";

// Unique
console.log(unique([1, 1, 2, 3])); // [1, 2, 3]

// Chunk
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1,2],[3,4],[5]]

// Deep Clone
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);
console.log(copy); // { a: 1, b: { c: 2 } }
```

---

### Validation Utilities
```ts
import { isEmail, isEmpty } from "@rajkumarganesan93/uifunctions";

// Email validation
console.log(isEmail("rajkumar@example.com")); // true
console.log(isEmail("not-an-email")); // false

// Empty checks
console.log(isEmpty("")); // true
console.log(isEmpty([])); // true
console.log(isEmpty({})); // true
console.log(isEmpty("Hello")); // false
```

### Exceptions Utilities

#### `safeExecute(fn)`
These helpers make error handling consistent and developer-friendly.

Wraps a function call in `try/catch` and returns either `{ result }` or `{ error }`.

```ts
import { safeExecute } from "@rajkumarganesan93/uifunctions";

const { result, error } = safeExecute(() => {
  // risky operation
  return JSON.parse('{"valid": true}');
});

if (error) {
  console.error("Operation failed:", error.message);
} else {
  console.log("Success:", result); // { valid: true }
}
```

---

#### `logError(error, context?)`
Logs an error to the console with optional context.

```ts
import { logError } from "@rajkumarganesan93/uifunctions";

try {
  throw new Error("Database connection failed");
} catch (err) {
  logError(err, "DBService");
  // Output: [Error] [DBService]: Database connection failed
}
```

---

#### `formatError(error)`
Formats an error into a user-friendly string.

```ts
import { formatError } from "@rajkumarganesan93/uifunctions";

try {
  throw new Error("Invalid user input");
} catch (err) {
  const message = formatError(err);
  console.log(message); 
  // "Error: Invalid user input"
}

console.log(formatError("plain string error")); 
// "plain string error"
```

---

### Typical Usage Together

```ts
import { safeExecute, logError, formatError } from "@rajkumarganesan93/uifunctions";

const { result, error } = safeExecute(() => {
  throw new Error("Unexpected failure");
});

if (error) {
  logError(error, "UserService");
  console.log(formatError(error)); 
  // "Error: Unexpected failure"
} else {
  console.log("Result:", result);
}
```