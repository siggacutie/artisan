# Implementation Plan: User Profile, Wallet Coins, and Security Updates

## Step 1: Fix Dashboard Navigation & Routing
- [ ] Rename `app/(main)/dashboard/page.tsx` to `app/(main)/dashboard/layout.tsx` or similar if appropriate, or move tab logic to separate files.
- [ ] Create `app/(main)/dashboard/orders/page.tsx` with `OrdersTab` logic.
- [ ] Create `app/(main)/dashboard/wallet/page.tsx` with `WalletTab` logic.
- [ ] Create `app/(main)/dashboard/profile/page.tsx` with `ProfileTab` logic.
- [ ] Create `app/(main)/dashboard/accounts/page.tsx` with `AccountsTab` logic.
- [ ] Update `app/(main)/dashboard/page.tsx` to redirect to `/dashboard/wallet` or act as a main landing for the dashboard.

## Step 2: Implement "Coin" Currency
- [ ] Update Navbar to show Coins and INR equivalent.
- [ ] Update `WalletTab` (now in `/dashboard/wallet/page.tsx`) to show balance in Coins.
- [ ] Update Top-Up page (`app/(main)/games/[game-slug]/topup/page.tsx`) to show coin prices.
- [ ] Remove wallet discount logic (5%) in Top-Up page.

## Step 3: PFP Visibility & Editability
- [ ] Update `app/api/dashboard/profile/route.ts` to accept `image` field.
- [ ] Add an image URL input (and a preview) to `ProfileTab`.
- [ ] Ensure the new PFP is updated across the site (Navbar and ProfileTab).

## Step 4: Branding & Logo Updates
- [ ] In `app/(main)/page.tsx`, change MLBB `image` from `/assets/games/mlbb/bg.png` to `/assets/games/mlbb/logo.png`.
- [ ] Verify other usages of `bg.png` that should be `logo.png`.

## Step 5: Security & Vulnerability Assessment
- [ ] Review all API routes in `app/api` for `auth()` and proper validation.
- [ ] Implement basic rate limiting or simple checks if needed.
- [ ] Verify that user data cannot be modified by other users (IDOR check).
- [ ] Confirm no sensitive data (passwords, etc.) is returned in APIs.
