# Specification: Fix prompt3.md TypeScript Errors

## Problem
The build failed with TypeScript errors as reported in `prompt3.md`:
1. `app/api/payments/confirm/route.ts`: `DiscordEmbed` type missing `description` property.
2. `scripts/createTestOrder.ts`: `DiamondPackage` type missing `resellerPrice` property.

## Proposed Solution
1. Update `DiscordEmbed` interface in `lib/discord.ts` to include `description?: string`.
2. Update `scripts/createTestOrder.ts` to use `basePriceInr` instead of `resellerPrice`.

## Acceptance Criteria
- [x] `lib/discord.ts` updated.
- [x] `scripts/createTestOrder.ts` updated.
- [x] `npx tsc --noEmit` passes successfully.
