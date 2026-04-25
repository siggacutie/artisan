# Specification: Final Compliance Fixes for @Prompt3.md

## Goal
Perform a final sweep of the codebase to ensure 100% compliance with `@Prompt3.md`. Fix any remaining security gaps, inconsistent validations, or missing protections.

## Remaining Checklist Items to Verify
- [ ] Ensure ALL non-public API routes call `getResellerSession()` or `getAdminSession()`.
- [ ] Ensure ALL POST/PATCH/DELETE routes call `validateOrigin(req)`.
- [ ] Ensure no sensitive data (passwordHash, token) is leaked in ANY Prisma select/include statement.
- [ ] Verify rate limiting is applied to all sensitive endpoints (OTP, UTR, Contact).
- [ ] Ensure all wallet deductions use `gte` check in Prisma `where` clause.
- [ ] Ensure all `catch` blocks return generic error messages to the client.

## Constraints
- Strictly follow `@Prompt3.md` rules.
- No new features or UI changes.
