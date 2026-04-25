# Plan: Fix Database Schema for Auto-Renew

- [x] Update `prisma/schema.prisma` comments with SQL.
- [x] Update `lib/resellerAuth.ts` to include `autoRenew` fields in select.
- [ ] Execute SQL in Supabase.
- [ ] Run `npx prisma generate`.
- [ ] Verify `POST /api/membership/renew`.
