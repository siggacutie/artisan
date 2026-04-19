# Specification: Fix Next.js 15 Sync Dynamic APIs (params unwrap)

## Goal
Fix 7 occurrences where `params` is accessed directly in `app/(main)/games/[game-slug]/page.tsx`. In Next.js 15, `params` and `searchParams` are Promises and must be unwrapped with `React.use()` in Client Components or awaited in Server Components.

## Target Files
- `app/(main)/games/[game-slug]/page.tsx`

## Changes Required
1. Update the component signature to reflect that `params` is a `Promise`.
2. Use `React.use(params)` to unwrap the `params` object.
3. Access properties from the unwrapped object.

## Constraints
- Do not change existing logic or UI.
- Use `React.use()` as it is a Client Component (`"use client"`).
