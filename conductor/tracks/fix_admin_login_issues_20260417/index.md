# Track: Fix Admin Login Redirection and Secret Error

## Overview
1. Signing in at `/admin-login` incorrectly redirects to the reseller login page.
2. Signing in at `/admin` (likely via the API or another mechanism) fails with `Error: secretOrPrivateKey must have a value` in `lib/adminAuth.ts`.

## Links
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
