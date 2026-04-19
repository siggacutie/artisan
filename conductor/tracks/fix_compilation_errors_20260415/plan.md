# Implementation Plan: Fix Compilation Errors

## Tasks

- [ ] Fix `bcryptjs` type issues by installing `@types/bcryptjs`.
- [ ] Fix `crypto.randomUUID()` and `expiryHours` in `app/api/admin/invite/route.ts`.
- [ ] Fix `data.prices` access in `app/api/pricing/current/route.ts`.
- [ ] Fix `currentSessionToken` selection in `auth.ts`.
- [ ] Verify all fixes by running `npx tsc --noEmit`.
