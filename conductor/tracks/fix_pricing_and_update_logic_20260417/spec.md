# Specification - Fix Pricing Error and Update Pricing Logic

## Problem Statement
1. **Runtime Error:** `pricing.prices.filter is not a function` on the top-up page. This is because the API returns an object instead of an array.
2. **Feature Request:** Show reseller prices when the user is not logged in.
3. **Feature Request:** "show the games page after user has logged in" - this implies that if an authenticated user lands on the top-up page, they might need to see something else or the top-up page should adapt. *Correction based on user feedback*: It might mean showing the games catalogue or adjusting the top-up page content.

## Proposed Solution
1. **Fix TypeError:** Update `api/pricing/current/route.ts` or `lib/pricing.ts` to return an array of packages with prices, or update the frontend to handle the object. Recommendation: Return an array from the API as it's more idiomatic for lists.
2. **Conditional Pricing:** In `TopUpPage`, check if `session` exists. If not, use `resellerPrice` if available, or fetch specific reseller pricing.
3. **Redirection/View Change:** If the user is logged in, ensure they are directed to the correct view (e.g., games catalogue if that was the intent, or just show standard prices).

## Success Criteria
- No runtime error on `TopUpPage`.
- Unauthenticated users see reseller prices.
- Authenticated users see standard prices (or as requested).
