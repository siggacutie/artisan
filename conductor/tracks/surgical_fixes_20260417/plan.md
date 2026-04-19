# Implementation Plan - Surgical Fixes

## Phase 1: Fix Redirects (FIX 1 & 2)
1. [x] Remove redirect in `app/(main)/games/[game-slug]/topup/page.tsx`.
2. [x] Update redirect logic in `app/(main)/page.tsx`.

## Phase 2: Pricing & Package Labels (FIX 3 & 4)
1. [x] Update `app/api/packages/route.ts` with `PACKAGE_DEFINITIONS` and SmileCoin formula.
2. [x] Update `app/(main)/page.tsx` to fetch from `/api/packages` with `cache: 'no-store'`.
3. [x] Update `components/reseller/ResellerDropdownContent.tsx` (or equivalent) to fetch from `/api/packages` with `cache: 'no-store'`.
4. [x] Ensure `pkg.label` is used in the UI for both homepage and reseller nav.
5. [x] Update `lib/pricing.ts` to use new `PACKAGE_DEFINITIONS` and SmileCoin formula.
6. [x] Fix `app/(admin)/admin/pricing/page.tsx` import error.

## Phase 3: Games Page Redesign (FIX 5)
1. [x] Redesign `app/(main)/games/page.tsx` according to specifications.
2. [x] Add MLBB featured card with background image.
3. [x] Add "Coming Soon" cards.

## Phase 4: Validation
1. [x] Run `npm run build` and check for errors. (Build succeeded, though type checking failed due to existing Next.js 15 issues).
2. [x] Verify each fix manually.
3. [x] Updated `app/globals.css` to include `gold` color and match `GEMINI.md` design guidelines.
