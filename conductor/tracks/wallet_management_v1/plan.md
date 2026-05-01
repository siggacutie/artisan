# Track: Wallet Management & Custom Deposits

## Spec
- **Admin Feature**: Admins can manually set the wallet balance for any user via the `/admin/users` page.
- **User Feature**: Users can enter a custom amount to deposit into their wallet on the `/wallet/add` page, in addition to the existing presets.

## Implementation Plan

### 1. Admin Wallet Management
- **File**: `app/(admin)/admin/users/page.tsx`
- **Change**: Implement the `WalletModal` and add a "Manage Wallet" option to the user dropdown menu.
- **Logic**: Use the existing `handlePatch` function to update the `walletBalance`.

### 2. Custom User Deposits
- **File**: `app/(main)/wallet/add/page.tsx`
- **Change**: Add an "Other" option or an input field for custom amounts.
- **Logic**: 
  - Ensure the custom amount is a positive integer.
  - Update `selectedAmount` state when the user enters a custom value.
  - Validate the amount on the client side before calling the API.

### 3. Verification
- Verify that admins can update user wallet balances and changes persist.
- Verify that users can successfully create payment links for custom amounts.
- Verify that the API `/api/wallet/create-upi-link` handles custom amounts correctly (it likely already does since it takes `amount` from the body).

## User Acceptance Criteria
- Admin can click "Manage Wallet" on a user and set their balance.
- User can enter a custom amount (e.g., 150) and proceed to the payment step.
- The minimum and maximum deposit limits (if any) should be respected.
