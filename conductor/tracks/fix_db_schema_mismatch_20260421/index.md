# Track: Fix Database Schema Mismatch

## Overview
This track addresses the `PostgresError 08P01` caused by a mismatch between the Prisma schema and the actual PostgreSQL database.

## Documents
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)

## Status
- **Current Phase:** Phase 1: Database Schema Synchronization
- **Status:** In Progress
- **Priority:** Critical

## Key SQL Commands (for Supabase)
```sql
-- Add missing columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailDisabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorPending" BOOLEAN NOT NULL DEFAULT false;

-- Add unique constraint on email
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_email_key') THEN
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

## Verification Query
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
