# Specification - Fix Batch Navbar Import Errors

## Problem Statement
The following files have incorrect `Navbar` imports:
- `app/(main)/dashboard/layout.tsx`
- `app/(main)/games/[game-slug]/page.tsx`
- `app/(main)/games/[game-slug]/topup/page.tsx`
- `app/(main)/games/page.tsx`
- `app/(main)/contact/page.tsx`

## Proposed Solution
Convert all named imports of `Navbar` from `@/components/layout/Navbar` to default imports.

## Success Criteria
- All identified files are updated.
- No more "Export Navbar doesn't exist" errors occur.
