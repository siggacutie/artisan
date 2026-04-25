# Specification: Fix Database Schema for Auto-Renew

Prisma is reporting a `P2022` error because the `autoRenew` column is missing from the `User` table in the database.

## Requirements
- Execute SQL to add `autoRenew` and `autoRenewMonths` to the `User` table.
- Run `npx prisma generate`.
- Verify membership renewal works.
