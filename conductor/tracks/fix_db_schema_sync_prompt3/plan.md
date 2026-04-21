# Implementation Plan: Fix Database Schema Mismatch (Prompt 3)

## Proposed Changes

### 1. Database Schema Synchronization (Supabase SQL Editor)
The following SQL scripts must be executed in the Supabase SQL Editor for project `ytuupgugsdwhmzpodpvn`.

#### Step 1: Check Current State
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'User' 
ORDER BY ordinal_position;
```

#### Step 2: Apply Schema Fixes
```sql
-- Add missing columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailDisabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorPending" BOOLEAN NOT NULL DEFAULT false;

-- Add unique constraint on email
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'User_email_key'
    ) THEN 
        ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
    END IF;
END$$;

-- Add missing columns to ResellerSession
ALTER TABLE "ResellerSession" ADD COLUMN IF NOT EXISTS "lastSeen" TIMESTAMPTZ;
ALTER TABLE "ResellerSession" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMPTZ;

-- Add missing column to InviteLink
ALTER TABLE "InviteLink" ADD COLUMN IF NOT EXISTS "requireEmail" BOOLEAN NOT NULL DEFAULT true;

-- Create OtpCode table
CREATE TABLE IF NOT EXISTS "OtpCode" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "OtpCode_userId_type_idx" ON "OtpCode"("userId", "type");
```

#### Step 3: Verify Success
```sql
SELECT 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'email') as has_email,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'emailVerified') as has_emailVerified,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'emailDisabled') as has_emailDisabled,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'twoFactorPending') as has_twoFactorPending,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ResellerSession' AND column_name = 'lastSeen') as has_lastSeen,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ResellerSession' AND column_name = 'expiresAt') as has_expiresAt,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'InviteLink' AND column_name = 'requireEmail') as has_requireEmail,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'OtpCode') as has_OtpCode;
```
*Every value must be 1.*

### 2. Post-Fix Verification
1.  Run `npx prisma generate`.
2.  Run `npm run dev`.

## Verification Plan

### Automated Tests
-   Create a small script `scripts/testDbCreateUser.ts` that attempts to create a user using Prisma.
-   Run the script using `npx ts-node scripts/testDbCreateUser.ts`.

### Manual Verification
-   Confirm success message in Supabase SQL Editor.
-   Verify all columns exist via the verification query.
