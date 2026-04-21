# Specification: Fix Database Schema Mismatch

## Problem Statement
The application is encountering `PostgresError { code: "08P01", message: "insufficient data left in message" }` during `prisma.user.create()`. This error indicates that the PostgreSQL database schema does not match the Prisma schema, specifically missing columns that Prisma is attempting to insert data into.

## Root Cause
The database tables `User`, `ResellerSession`, and `InviteLink` are missing several columns that were added to the Prisma schema. Additionally, the `OtpCode` table is entirely missing from the database.

## Required Changes

### 1. Database Schema Updates (SQL)
The following SQL commands must be executed in the Supabase SQL Editor:

#### A. Update `User` Table
- Add `email` (TEXT, UNIQUE)
- Add `emailVerified` (BOOLEAN, DEFAULT false)
- Add `emailDisabled` (BOOLEAN, DEFAULT false)
- Add `twoFactorPending` (BOOLEAN, DEFAULT false)

#### B. Update `ResellerSession` Table
- Add `lastSeen` (TIMESTAMPTZ)
- Add `expiresAt` (TIMESTAMPTZ)

#### C. Update `InviteLink` Table
- Add `requireEmail` (BOOLEAN, DEFAULT true)

#### D. Create `OtpCode` Table
- Columns: `id` (TEXT, PK), `userId` (TEXT, FK), `code` (TEXT), `type` (TEXT), `expiresAt` (TIMESTAMPTZ), `used` (BOOLEAN, DEFAULT false), `createdAt` (TIMESTAMPTZ, DEFAULT now())
- Foreign Key: `userId` references `User(id)` ON DELETE CASCADE
- Index: `(userId, type)`

### 2. Client-Side Updates
- Run `npx prisma generate` to ensure the Prisma client is in sync with the schema.

## Verification Plan

### Automated Verification
- Run a SQL query to check for the existence of all required columns and tables. All checks must return `1`.

### Manual Verification
- Attempt to create a user (e.g., via registration or admin panel) and verify that the `PostgresError 08P01` no longer occurs.
- Verify that OTP codes can be generated and stored in the `OtpCode` table.
