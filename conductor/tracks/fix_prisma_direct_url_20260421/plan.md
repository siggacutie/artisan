# Implementation Plan: Fix Prisma Direct URL Connection Error

## Proposed Changes

### 1. Update `prisma/schema.prisma`
Remove the `directUrl` line from the `datasource db` block.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Regenerate Prisma Client
Run `npx prisma generate` in the terminal.

### 3. Restart Development Server
Restart the `npm run dev` process.

## Verification Plan

### Manual Verification
1. Attempt an invite signup.
2. Verify that the user is created in the database without `PostgresError 08P01`.
