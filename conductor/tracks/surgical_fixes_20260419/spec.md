# Specification — Surgical Fixes 20260419

## Overview
Implement several surgical fixes as requested in `prompt3.md` to improve membership management, wallet functionality, and UI consistency.

## Requirements

### 1. Membership Page Refinement
- **Route**: `/membership`
- **Fixes**:
    - Add `paddingTop: '100px'` to the main container to prevent overlap with navbar.
    - Update membership status logic to use `membershipExpiresAt` and `membershipMonths`.
    - Fetch fresh data from `/api/dashboard/summary` as the source of truth.
    - Show warning banners for expiring memberships (<= 7 days: orange, <= 3 days: red).
    - Show expiration notice for expired memberships.

### 2. Cleanup Cron Job
- **Route**: `app/api/cron/cleanup-expired/route.ts`
- **Logic**:
    - Verify `CRON_SECRET` in Authorization header.
    - Find users whose membership expired > 3 days ago.
    - Zero out wallet balance, set `isReseller: false`, `isFrozen: true`.
    - Delete wallet transactions and sessions for these users.

### 3. Dashboard Summary API Update
- **Route**: `app/api/dashboard/summary/route.ts`
- **Update**: Include `membershipExpiresAt`, `membershipMonths`, `walletBalance`, `isReseller`, `isFrozen`, `isBanned` in the response.

### 4. Wallet Add Funds Page
- **Route**: `/wallet/add`
- **Update**:
    - Remove custom amount input.
    - Replace with a grid of 9 preset buttons (100, 200, 500, 1000, 1500, 2000, 3000, 5000, 10000).
    - Enforce selection before allowing the "Add Funds" button to be active.
    - Styling must match specified dark theme with gold accents.

### 5. Pricing Display (INR to coins)
- **Locations**: 
    - Reseller dropdown navbar component.
    - Game top-up pages (packages, balance, button).
- **Change**: Replace "₹" with "coins" suffix.
- **Exceptions**: Landing page (`/`) and reseller page (`/reseller`) must keep INR.

## Constraints
- Do NOT modify `app/(main)/page.tsx` or `app/(main)/reseller/page.tsx`.
- Do NOT add `framer-motion` (keep existing if already there, but don't add more).
- Do NOT use HTML form tags.
- Do NOT use emojis.
- Do NOT change the color palette.
- Renew buttons stay as non-functional placeholders.
