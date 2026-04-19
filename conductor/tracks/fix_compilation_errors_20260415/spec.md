# Specification: Fix Compilation Errors

Identify and resolve TypeScript compilation errors introduced during the complete system overhaul.

## Errors to Fix

1.  **`app/api/admin/invite/route.ts`**:
    *   `crypto.randomUUID()` not found.
    *   `expiryHours` variable is missing/undefined.
2.  **`app/api/pricing/current/route.ts`**:
    *   Incorrectly accessing `data.prices` when `data` might be an error object or returning the wrong structure.
3.  **`auth.ts`**:
    *   `dbUser.currentSessionToken` property missing on the selected user object.
    *   `bcryptjs` module or types missing.
4.  **`app/api/admin/users/route.ts`**:
    *   `bcryptjs` module or types missing.
