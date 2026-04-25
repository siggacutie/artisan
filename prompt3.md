37. CSP header must include all required domains and nothing extra

### H — Information Disclosure

38. No stack traces or internal error details exposed to client:
    - All catch blocks must log error server-side but return generic message to client
    - Check every catch(error) block — never return error.message directly to client unless it's a known safe validation error

39. No sensitive data in API responses:
    - User fetch must never return passwordHash, currentSessionToken, OTP codes
    - Session fetch must never return full session token
    - Check all select/include statements in Prisma queries that return data to client

40. Environment variables — verify no NEXT_PUBLIC_ prefix on secret keys:
    - NEXT_PUBLIC_ variables are exposed to browser — only UPI_ID and RAZORPAY_KEY_ID (public key only) should be public
    - ADMIN_JWT_SECRET, RAZORPAY_KEY_SECRET, RESEND_API_KEY, SUPABASE_SERVICE_KEY, LISTENER_SECRET, CRON_SECRET must NEVER have NEXT_PUBLIC_ prefix

### I — Webhook Security

41. /api/payments/confirm:
    - x-listener-secret header required and validated against LISTENER_SECRET env var
    - Rate limited to 30 req/min per IP
    - Amount from DB only, never from payload

42. /api/cron/* routes:
    - x-cron-secret header required and validated against CRON_SECRET env var

### J — File & Storage Security

43. Avatar upload (/api/dashboard/avatar):
    - Magic byte validation (not just MIME type)
    - Max file size 2MB enforced
    - File extension derived from magic bytes, not from original filename
    - Stored with userId prefix to prevent path traversal
    - Old avatar should be deleted when new one is uploaded (optional but good)

### K — Middleware / Route Protection

44. Check middleware.ts or proxy.ts:
    - /admin/* routes redirect to /admin/login if no admin_session cookie
    - /games/*, /dashboard/*, /wallet/*, /reseller, /membership redirect to /login if no reseller_session cookie
    - /invite/* is public (no redirect)
    - / is public

45. Membership expiry check:
    - After getResellerSession returns a valid session, check if membershipExpiresAt < now()
    - If expired, API routes should return 403 with { error: 'membership_expired' }
    - Exception: /api/membership/renew, /api/wallet/*, /api/reseller/auth/* should still work even with expired membership so user can top up and renew

---

## OUTPUT FORMAT

For each vulnerability found:

**[SEVERITY: CRITICAL/HIGH/MEDIUM/LOW]**
File: path/to/file.ts
Issue: description
Fix: exact code change

Then provide the complete fixed files for anything CRITICAL or HIGH severity.

For MEDIUM and LOW, provide the specific code change needed.

---

## AFTER THE AUDIT

1. List all files that were modified
2. List any SQL changes needed (for new columns/indexes)
3. State if npx prisma generate needs to be run
4. Provide a summary: X critical, X high, X medium, X low issues found and fixed

---

## STRICT RULES
1. Do not add new features
2. Do not change UI or design
3. Do not change color palette
4. Do not change business logic — only fix security issues
5. Use DATABASE_URL only in lib/prisma.ts
6. Tagged template literals only for raw SQL
7. Never expose passwordHash, session tokens, or OTP codes to client
8. List every file modified at the end