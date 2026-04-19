# Specification: Five Surgical Fixes

## Problem Statement
The application has five specific issues/requirements identified in `prompt3.md`:
1. **Topup Page Redirect:** MLBB topup page redirects to `/games`, preventing users from accessing it.
2. **Homepage Redirect:** Homepage redirects unauthenticated users to `/games`, while it should only redirect authenticated users.
3. **Pricing Sync:** Pricing changes in admin don't reflect on the reseller page/navbar because of incorrect API fetching or hardcoded values.
4. **Package Labels:** Package names are generic "diamonds" instead of specific labels like "78 + 8 Diamonds".
5. **Games Page UI:** The games catalogue page needs a redesign to be more "gaming-store" like, specifically featuring MLBB with a background image.

## Requirements

### FIX 1: MLBB Topup Page Redirect
- File: `app/(main)/games/[game-slug]/topup/page.tsx`
- Action: Remove any `router.push('/games')`, `router.replace('/games')`, or `redirect('/games')`.
- Constraint: Unauthenticated users MUST be able to view the page.

### FIX 2: Homepage Redirect Logic
- File: `app/(main)/page.tsx`
- Action: 
  - If `status === 'authenticated'`, redirect to `/games`.
  - If `status === 'unauthenticated'`, render the reseller landing page (no redirect).
  - If `status === 'loading'`, show a full-page spinner (`#050810`).

### FIX 3: Pricing and Fetching Updates
- File: `app/api/packages/route.ts`
- Action: Use SmileCoin formula: `price = Math.ceil(smilecoins * (inrPaid / smilecoinsAmount) * (1 + markup/100))`.
- File: `app/(main)/page.tsx` and navbar component (e.g., `components/reseller/ResellerDropdownContent.tsx`).
- Action: Fetch from `/api/packages` with `cache: 'no-store'`.

### FIX 4: Package Names/Labels
- File: `app/api/packages/route.ts`
- Action: Define `PACKAGE_DEFINITIONS` with proper `label`, `smilecoins`, `supplierProductId`, etc.
- Action: Use `pkg.label` in the UI wherever packages are displayed.

### FIX 5: Games Page Redesign
- File: `app/(main)/games/page.tsx`
- Action:
  - New header with "CATALOGUE" and "All Games".
  - Stats row (1 Game Available, Instant Delivery, Secure Payments).
  - Styled search and filter bar.
  - Featured MLBB card with `/public/assets/games/mlbb/bg.jpg` as background and logo.
  - Action buttons: "Top Up" (active) and "Accounts" (coming soon).
  - 3 generic "Coming Soon" cards.

## Success Criteria
1. No build errors.
2. Homepage shows reseller page for logged-out users, redirects for logged-in users.
3. `/games/mlbb/topup` is accessible to everyone.
4. Prices update correctly when admin config changes.
5. Package labels show full descriptions (e.g., "78 + 8 Diamonds").
6. Games page matches the specified design.
