# Implementation Plan - Pricing Sync and Deduction

Synchronize the pricing system to ensure consistency and correct wallet deductions.

## User Review Required
- **Wait for User Approval:** No (Directive issued)

## Proposed Changes

### 1. Global Sync
#### [app/api/admin/pricing/smilecoin/route.ts]
- Wrap the update in a transaction.
- Iterate through `PACKAGE_DEFINITIONS` and update all matching `DiamondPackage` records whenever the SmileCoin rate or markup is changed.

### 2. API Consolidation
#### [app/api/packages/route.ts]
- Fetch `basePriceInr` and `displayPrice` directly from the database.
- Remove hardcoded `SMILECOIN_COSTS` and manual math.

### 3. Logic Unification
#### [lib/pricing.ts]
- Update `getPackagesWithPrices` to use `basePriceInr` as the final `resellerPrice`.
- Ensure no additional markups are applied to the base price for authenticated resellers.

## Verification Plan
1. Change the "Markup %" in Admin Pricing Configuration.
2. Verify that prices in the "Package Manager" have updated automatically.
3. Verify that the Top-up page shows these new prices.
4. Place an order and verify that the exact displayed amount is deducted and shown in Order History.
