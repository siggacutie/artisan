# Specification: User Profile, Wallet Coins, and Security Updates

## 1. Profile Picture (PFP) Visibility & Editability
- **Goal:** Ensure the user's PFP is visible in the dashboard/navbar and can be edited via the profile settings page.
- **Current State:** Navbar and Dashboard/ProfileTab use `summary?.image`, but there's no way to update it.
- **Requirements:**
  - Add a "Change PFP" option in `ProfileTab` (dashboard).
  - Support image upload or URL input (start with URL input as it's simpler, or if possible, a simple upload).
  - Update `api/dashboard/profile` to handle the `image` field.
  - Update `summary` route to return the latest image.

## 2. Wallet "Coin" Currency
- **Goal:** Show wallet balance and prices in "Coins".
- **Conversion Rate:** 1 Coin = 1.5 INR.
- **Requirements:**
  - Balance Display: Always show as "X Coins" with "₹Y" in smaller text.
  - Image Asset: Use `coin.png` (assumed to be in `/public/assets/` or similar).
  - Top-up Page:
    - Display package prices in Coins (e.g., "₹120 | 80 Coins").
    - Calculate coin price dynamically: `Math.ceil(price / 1.5)`.
  - Transaction Logic: WalletTransactions should reflect coin balance changes if possible, or at least the UI should convert consistently.
  - **Flat Pricing:** Remove the 5% wallet discount logic. All payment methods pay the same INR/Coin price.

## 3. Dashboard Navigation Routing
- **Goal:** Fix 404s when accessing `/dashboard/orders`, etc., via direct links or navbar.
- **Current State:** Dashboard uses a single page with `activeTab` state. Links in Navbar go to `/dashboard/orders`, which doesn't exist.
- **Requirements:**
  - Option A: Implement catch-all route `app/(main)/dashboard/[...tab]/page.tsx` or `app/(main)/dashboard/[tab]/page.tsx`.
  - Option B: Use query params like `/dashboard?tab=orders`.
  - Option C: Move tab logic into separate page files in their respective folders.
  - *Decision:* Move to separate page files (`/dashboard/orders/page.tsx`, etc.) and shared layout if needed to maintain state or use Next.js parallel/intercepted routes. However, simple separate pages are most robust for direct links.

## 4. Branding & Logo Updates
- **Goal:** Update all branding from `bg.png` to `logo.png`.
- **Requirements:**
  - Homepage Game Cards: Change `bg.png` to `logo.png` for MLBB.
  - Anywhere else `bg.png` is used as a logo/cover mistakenly.

## 5. Security & Vulnerability Assessment
- **Goal:** Ensure the platform is safe from exploits.
- **Assessment Areas:**
  - API Authorization: Ensure `auth()` is checked in all sensitive routes.
  - Data Integrity: Ensure users can't edit other users' profiles or access their wallets.
  - Webhook Security: (If implemented) Ensure signature verification.
  - Rate Limiting: Check for potential abuse points.
  - Input Validation: Ensure all inputs are sanitized.
