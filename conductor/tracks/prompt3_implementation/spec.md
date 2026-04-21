# Specification — Prompt3 Implementation

## Overview
Implement a series of updates and fixes as requested in `prompt3.md`:
1.  **OTP Email Overhaul:** Transition to Resend SDK and implement high-quality HTML templates for different OTP types.
2.  **Avatar Upload Fix:** Improve the profile picture upload logic with better validation, magic byte checking, and correct Supabase storage handling.
3.  **Admin Membership Control:** Add a "Revoke Membership" feature in the admin panel to immediately expire a user's membership and revoke reseller status.
4.  **Membership Renewal System:** Implement a full Razorpay-based membership renewal flow for expired users, including order creation and payment verification.

## Requirements

### Task 1: OTP Email Overhaul
-   **File:** `lib/email.ts`
-   **Implementation:**
    -   Use `resend` package.
    -   Define `getEmailHtml` function returning styled HTML for `EMAIL_VERIFY`, `LOGIN_2FA`, and `PASSWORD_RESET`.
    -   Update `sendOtpEmail` to use the SDK and templates.
    -   Include dev-mode logging when not in production.

### Task 2: Avatar Upload Fix
-   **File:** `app/api/dashboard/avatar/route.ts`
-   **Implementation:**
    -   Validate file existence and MIME type (JPG, PNG, WebP).
    -   Validate file size (max 2MB).
    -   Perform magic byte validation for JPG, PNG, and WebP.
    -   Use `session.userId` for filename: `${userId}-${Date.now()}.${ext}`.
    -   Upload to `avatars` bucket in Supabase.
    -   Update user's `avatarUrl` in database.

### Task 3: Admin Revoke Membership
-   **Files:** `app/(admin)/admin/users/page.tsx`, `app/api/admin/users/[id]/route.ts`
-   **Implementation:**
    -   **API:** Handle `revokeMembership: true` in PATCH route. Set `membershipExpiresAt` to a past date and `isReseller` to `false`.
    -   **Frontend:** Add "Revoke Membership" button to user actions. Show a confirmation modal before proceeding.

### Task 4: Membership Renewal System
-   **Files:** `app/(main)/membership/page.tsx`, `app/api/membership/create-order/route.ts`, `app/api/membership/verify/route.ts`
-   **Implementation:**
    -   **Create Order API:** Create Razorpay order for 1, 3, 6, or 12 months based on a fixed price map.
    -   **Verify API:** Verify HMAC signature, calculate new expiry (extending current or starting from now), update user status, and log `MembershipPayment`.
    -   **Frontend:** Load Razorpay script, implement `handleRenew` flow, and handle success/failure states.

## Constraints
-   Maintain existing color scheme (Gold #ffd700, Dark #050810, etc.).
-   Ensure mobile-first responsiveness.
-   Strictly follow Razorpay security practices (signature verification).
-   Use `Lucide React` icons only.
