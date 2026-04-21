# Specification: Fix Database Schema Mismatch (Prompt 3)

## Problem Statement
The application is encountering a `PostgresError { code: "08P01", message: "insufficient data left in message" }` during `prisma.user.create()`. This error indicates that the Prisma Client is attempting to insert data into columns that do not exist in the actual PostgreSQL database table, even though they are defined in the `schema.prisma` file.

## Requirements
- Synchronize the physical PostgreSQL database schema with the `prisma/schema.prisma` file.
- Add missing columns to the `User` table: `email`, `emailVerified`, `emailDisabled`, `twoFactorPending`.
- Add a unique constraint to the `email` column in the `User` table.
- Add missing columns to the `ResellerSession` table: `lastSeen`, `expiresAt`.
- Add the missing column to the `InviteLink` table: `requireEmail`.
- Create the `OtpCode` table if it does not exist.

## Success Criteria
- The `prisma.user.create()` operation (and other database operations) should succeed without the "insufficient data" error.
- All columns defined in `schema.prisma` should exist in the database with the correct types and constraints.
