# Specification: Fix Smile.one DNS Resolution and Supplier Config

## Problem
The Puppeteer bot is failing with `net::ERR_NAME_NOT_RESOLVED` when trying to access `https://www.smile.one/merchant/mobilelegends`. This indicates a DNS resolution issue for the `www` subdomain in the bot's environment.

## Proposed Solution
1. **Update Supplier URLs**: Change `www.smile.one` to `smile.one` (apex domain) across the codebase for better reliability.
2. **Enhance Bot API**: Update `app/api/bot/pending-orders/route.ts` to include the `supplierBaseUrl` in the response so the bot can use the URL configured in the database instead of hardcoding it.
3. **Update Seeding**: Fix `prisma/seed.ts` to use the non-www version of the URL.
4. **Update Verification**: Update `app/api/verify-player/route.ts` to use the non-www version.

## Acceptance Criteria
- [ ] All occurrences of `www.smile.one` replaced with `smile.one`.
- [ ] Bot API returns `supplierBaseUrl`.
- [ ] Verification service still works with the new URL.
