# Plan: Fix Next.js 15 Sync Dynamic APIs (params unwrap)

## Overview
Update `app/(main)/games/[game-slug]/page.tsx` to handle `params` as a Promise, as required by Next.js 15.

## Tasks

### 1. Update `app/(main)/games/[game-slug]/page.tsx`
- Strategy: Use `React.use()` to unwrap `params`.
- Steps:
  - Modify the `GameLandingPage` component signature to `Promise<{ "game-slug": string }>`.
  - Add `const { "game-slug": gameSlug } = React.use(params);` (or similar).
  - Update all usages of `params["game-slug"]` to use the unwrapped `gameSlug`.

### 2. Verification
- Run `npm run lint` to ensure no related errors remain.
- Run `npm run build` (optional but recommended for Next.js 15 checks).
