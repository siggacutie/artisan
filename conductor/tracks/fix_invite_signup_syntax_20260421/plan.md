# Implementation Plan: Fix Invite Signup Syntax Error

## Proposed Changes

### 1. Update `app/api/invite/signup/route.ts`
Replace the malformed `prisma.user.create()` call with a clean version and remove redundant variables.

**Modified Code:**
```ts
    // Task 2E: Create user
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        passwordHash: await bcrypt.hash(password, 12),
        role: 'RESELLER',
        isReseller: true,
        membershipExpiresAt,
        membershipMonths: invite.membershipMonths ?? 1,
        email: email ? email.trim().toLowerCase() : null,
        emailVerified: false,
        emailDisabled: false,
        twoFactorPending: false,
      },
    })
```

### 2. Post-Fix Verification
- Run `npx prisma generate`.
- Restart the development server (`npm run dev`).

## Verification Plan

### Manual Verification
1. Open an invite link in the browser.
2. Fill in the signup form and submit.
3. Confirm that the account is created and the user is redirected or shown a success message.
4. Check the `User` table in the database to verify the record.
