# Specification: Reseller Access and Pricing Sync

## Overview
This track addresses several critical issues related to reseller pricing sync, package display, webhook routing, and implementing time-limited reseller access.

## Objectives
1.  **Pricing Sync:** Ensure all reseller prices are fetched from the database (`DiamondPackage` table) instead of hardcoded definitions.
2.  **Package Labels:** Fix the issue where package names show as generic "diamonds" by implementing dynamic label generation.
3.  **Webhook Routing:** Redirect signup notifications to `DISCORD_WEBHOOK` while keeping `SIGNUP_ALERTS_WEBHOOK` for suspicious activity only.
4.  **Reseller Access Management:**
    *   Implement time-limited access (1m, 3m, 6m, 1y) for reseller accounts.
    *   Admin-controlled duration during invite link generation.
    *   Automatic access blocking upon expiry.
    *   Vulnerability and exploit check.

## Technical Details

### 1. Database Schema Changes (`prisma/schema.prisma`)
-   **DiamondPackage:** Add `section` field (String) to categorize packages (standard, double, passes).
-   **InviteLink:** Add `durationMonths` field (Int) to store the granted access duration.
-   **User:** Add `resellerExpiresAt` field (DateTime?) to track when reseller access ends.

### 2. Pricing Logic (`lib/pricing.ts`)
-   Update `getPackagesWithPrices` to fetch from `prisma.diamondPackage`.
-   Implement `generatePackageLabel(pkg)` to create labels like "78 + 8 Diamonds" if a custom label is missing.
-   Handle `section` for proper grouping in UI.

### 3. Webhook Logic (`auth.ts`)
-   Change `createUser` event to use `process.env.DISCORD_WEBHOOK`.
-   Verify `SIGNUP_ALERTS_WEBHOOK` usage in `lib/suspiciousActivity.ts` remains unchanged.

### 4. Reseller Access (`app/api/admin/invite/create/route.ts` & `auth.ts`)
-   Update invite creation to accept `durationMonths`.
-   Update `signIn` callback in `auth.ts` to check `resellerExpiresAt`.
-   Update `createUser` event in `auth.ts` to set `resellerExpiresAt` based on the invite used.

### 5. UI Updates
-   **Admin Panel:** Add duration selection to invite generation.
-   **Admin Panel:** Add section selection to package management.
-   **Reseller Navbar:** Ensure `pkg.label` is used correctly.
-   **Reseller Landing:** Ensure `pkg.label` is used correctly.

## Success Criteria
-   Admin-set prices reflect immediately across all reseller views.
-   Package names show correct labels (e.g., "78 + 8 Diamonds").
-   Signups hit `DISCORD_WEBHOOK`.
-   Reseller accounts expire after the specified duration and block access.
-   No security vulnerabilities introduced.
