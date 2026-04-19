# Specification — Coin Conversion System 20260419 v2

## Overview
Implement a coin conversion system where 1.5 INR = 1 Coin. This involves updating all display logic for authenticated users while keeping the landing page and reseller page in INR.

## Requirements

### 1. Global Conversion Logic
- **INR to Coins**: `Math.ceil(inrPrice / 1.5)` (for packages/prices)
- **Wallet Balance to Coins**: `Math.floor(walletBalance / 1.5)` (for user balance)
- **Storage**: Remains in INR in the database.

### 2. File Specific Updates

#### app/(main)/wallet/add/page.tsx
- Remove "Wallet payments save 5%" banner.
- Preset buttons: Show "₹[amount]" and "= [Math.floor(amount / 1.5)] coins".
- Add Funds button: "Pay ₹[selectedAmount] → Get [Math.floor(selectedAmount / 1.5)] coins".

#### components/reseller/ResellerDropdownContent.tsx
- Convert `pkg.resellerPrice` (INR) to coins: `Math.ceil(pkg.resellerPrice / 1.5)`.
- Display: "[coinsPrice] coins" (No ₹ symbol).

#### app/(main)/games/[game-slug]/topup/page.tsx
- Package card price: `Math.ceil(pkg.resellerPrice / 1.5) + " coins"`.
- Buy button: "Buy Now — [Math.ceil(selectedPackage.resellerPrice / 1.5)] coins".
- Balance chip: `Math.floor(walletBalance / 1.5) + " coins"`.
- Comparison logic: Keep in INR (compare `walletBalance` with `pkg.resellerPrice`).
- Error message: "Insufficient coin balance. Add coins to your wallet."

#### components/layout/Navbar.tsx
- Wallet balance chip: `Math.floor(walletBalance / 1.5) + " coins"`.

#### app/(main)/dashboard/wallet/page.tsx
- Convert all balance and transaction displays to coins.

#### app/(main)/dashboard/page.tsx
- Convert wallet balance display to coins.

### 3. Constraints
- Do NOT modify `app/(main)/page.tsx` or `app/(main)/reseller/page.tsx`.
- Do NOT change database storage format.
- Do NOT use emojis.
- Do NOT add framer-motion.

## Verification
- Confirm 5% banner removal in `/wallet/add`.
- Confirm coin displays in navbar, topup page, and dashboard.
- Confirm landing page remains in INR.
