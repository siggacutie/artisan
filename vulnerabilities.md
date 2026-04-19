# Vulnerabilities Audit - ArtisanStore.xyz

The following vulnerabilities were identified during the implementation of prompt3.md:

## 1. Price Manipulation in Order Creation (CRITICAL)
- **File:** `app/api/orders/create/route.ts`
- **Description:** The API currently accepts the `price` of the package directly from the client. A malicious user could send a modified POST request with a lower price (e.g., ₹1 instead of ₹120), and the server would create a Razorpay order for that amount.
- **Impact:** Financial loss.
- **Status:** FIXED (Server-side price validation implemented).

## 2. Lack of Rate Limiting on Public/Auth API Routes (HIGH)
- **Files:** `app/api/verify-player/route.ts`, `app/api/contact/route.ts`, `app/api/orders/create/route.ts`
- **Description:** There is no rate limiting implemented on these routes. 
    - `verify-player` could be used to harvest usernames.
    - `contact` could be used for spamming.
    - `orders/create` could be used to spam Razorpay order creation.
- **Impact:** Service abuse, potential IP blocking from suppliers, and increased costs.
- **Status:** FIXED (Custom in-memory rate limiting implemented in `lib/rateLimit.ts` and applied to routes).

## 3. Insufficient File Type Validation in Avatar Upload (MEDIUM)
- **File:** `app/api/dashboard/avatar/route.ts`
- **Description:** The server-side upload handler only checks the file size but trusts the `file.type` and `formData` for the extension. A user could upload a malicious file disguised as an image if the Supabase bucket is misconfigured (though it's usually restricted to `avatars/`).
- **Impact:** Potential for hosting malicious content or bypass of expected image formats.
- **Status:** FIXED (Magic byte verification implemented for JPEG, PNG, and WebP).

## 4. Incomplete Terms Agreement Enforcement (LOW)
- **Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- **Description:** The terms agreement checkbox is only enforced on the client side. The NextAuth `signIn` call proceeds without verifying if the user actually consented.
- **Impact:** Compliance risk.
- **Status:** PARTIALLY FIXED (Terms are agreed upon by using Google OAuth which is the primary login method; however, registration routes are still client-enforced).

---
**Audit performed on:** 2026-04-11
**Auditor:** Gemini CLI
