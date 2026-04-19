# Specification - Re-fix Admin Login Secret (Env Formatting)

## Problem Statement
The `.env.local` file contains:
`signup_alerts_webhook="..."ADMIN_JWT_SECRET=super-secret-admin-token-2026`
This prevents `process.env.ADMIN_JWT_SECRET` from being correctly loaded.

## Proposed Solution
Correct the formatting in `.env.local` to ensure each variable is on its own line.

## Success Criteria
- `ADMIN_JWT_SECRET` is correctly defined in `.env.local`.
- Admin login works without `secretOrPrivateKey` error.
