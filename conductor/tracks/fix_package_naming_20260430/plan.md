# Implementation Plan - Fix Package Naming

Fix incorrect package names in the order history.

## User Review Required
- **Wait for User Approval:** No (Directive issued)

## Proposed Changes

### 1. Pricing Logic
#### [lib/pricing.ts]
- Update `generatePackageLabel` to use `PACKAGE_DEFINITIONS` for lookup.
- Handle edge cases where `diamondAmount` is 0.

### 2. API Consolidation
#### [app/api/packages/route.ts]
- Use `generatePackageLabel` from `lib/pricing.ts` instead of redundant local definitions.

### 3. UI Resilience
#### [app/(main)/dashboard/orders/page.tsx]
- Implement fallback logic to infer names for old orders with generic labels (e.g., "0 Diamonds").
- Map partial bonus labels (e.g., "+ 8 Diamonds") to full names.

## Verification Plan
- Create a new order for "Weekly Diamond Pass" and verify it appears correctly in history.
- Check old orders in the dashboard to ensure they are now mapped to descriptive names.
