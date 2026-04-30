# Track: Fix Package Naming in Order History (@prompt3.md)

## Status
- Status: Completed
- Date: 2026-04-30
- Author: Gemini CLI

## Overview
Address the issue where package names are incorrectly displayed as "0 Diamonds" or generic "Diamond Top-Up" in the order history.

## Scope
- `lib/pricing.ts`: Fix label generation logic for all packages.
- `app/api/packages/route.ts`: Centralize display names.
- `app/(main)/dashboard/orders/page.tsx`: Add fallbacks for legacy orders.

## Deliverables
- [x] Updated `generatePackageLabel` to correctly name the Weekly Diamond Pass and others.
- [x] Consolidated package display names in `lib/pricing.ts`.
- [x] Improved order history UI with fallback logic for old orders based on total price and partial labels.
