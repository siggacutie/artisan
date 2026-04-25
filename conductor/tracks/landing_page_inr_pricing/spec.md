# Specification: Landing Page INR Pricing

## Objective
Force the landing page to display prices in INR (Indian Rupee) instead of the internal "coins" currency.

## Requirements
- The guest landing page (`/`) should show prices in INR.
- The conversion formula `Math.ceil(price / 1.5)` should be removed for the landing page display.
- Other parts of the application, including the Reseller Dropdown and the Top-up page, must continue to show prices in "coins".
- The landing page text "All amounts in INR" should be honored by the displayed values.

## Affected Files
- `app/(main)/page.tsx`: Modify the price rendering logic.

## Non-Affected Files (To be preserved)
- `components/reseller/ResellerDropdownContent.tsx`
- `app/(main)/games/[game-slug]/topup/page.tsx`
- `app/api/packages/route.ts` (The API already provides INR values in `resellerPrice`)
