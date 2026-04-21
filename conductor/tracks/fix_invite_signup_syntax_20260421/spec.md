# Specification: Fix Invite Signup Syntax Error

## Problem Statement
The `app/api/invite/signup/route.ts` file contained a syntax error in the `prisma.user.create()` call. A stray brace `{` at the end of line 76 caused the `data` object to be malformed, leading to `PostgresError 08P01` (insufficient data left in message) during user registration.

## Requirements
- Identify and remove the stray brace in `app/api/invite/signup/route.ts`.
- Ensure the `prisma.user.create()` call uses a clean, flat data object.
- Include all necessary fields: `username`, `passwordHash`, `role`, `isReseller`, `membershipExpiresAt`, `membershipMonths`, `email`, `emailVerified`, `emailDisabled`, `twoFactorPending`.
- Verify the file for any other syntax issues.

## Success Criteria
- The syntax error is removed.
- User creation via invite link succeeds.
- No `PostgresError 08P01` occurs during signup.
