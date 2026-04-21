# Specification: Fix Prisma Direct URL Connection Error

## Problem Statement
Write operations (CREATE, UPDATE) are failing with `PostgresError 08P01`. The cause is the `directUrl` configuration in `prisma/schema.prisma`. 
Prisma uses `directUrl` for migrations and mutations, but the configured `DIRECT_URL` points to an unreachable port (5432).

## Proposed Fix
Remove the `directUrl` line from the `datasource db` block in `prisma/schema.prisma`. This will force Prisma to use the standard `DATABASE_URL` for all operations.

## Requirements
- Modify `prisma/schema.prisma` to remove `directUrl`.
- Regenerate Prisma client.
- Restart development server.

## Success Criteria
- Prisma schema is updated.
- `npx prisma generate` runs successfully.
- Write operations (like invite signup) succeed.
