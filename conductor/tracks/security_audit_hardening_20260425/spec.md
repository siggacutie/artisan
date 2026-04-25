# Specification: Security Audit and Hardening (Full @Prompt3.md)

## Goal
Perform a complete security audit of the entire codebase and fix all vulnerabilities as specified in `@Prompt3.md`. Correctness and security are prioritized over everything else.

## Audit Scope
Read every file in these directories:
- `app/api/**` (all route files)
- `lib/**` (all library files)
- `middleware.ts` / `proxy.ts`
- `app/(main)/**` (all page files)
- `app/(admin)/**` (all admin files)
- `app/(auth)/**` (all auth files)
- `app/invite/**`
- `prisma/schema.prisma`
- `next.config.ts`

## Key Security Categories
- **A: Authentication & Session Security:** Session validation, httpOnly cookies, single device enforcement, JWT secret usage.
- **B: Input Validation & Sanitization:** Field validation, regex checks, file upload security, UTR validation.
- **C: CSRF Protection:** `validateOrigin(req)` on all state-changing routes.
- **D: Rate Limiting:** Login, OTP, Forgot Password, Wallet, Contact endpoints.
- **E: Business Logic Exploits:** Wallet balance checks, payment idempotency, order creation atomic transactions, SuperAdmin protection, Invite link usage.
- **F: Injection Prevention:** SQL injection (tagged templates), no `eval()`, HTML escaping.
- **G: Security Headers:** `next.config.ts` headers (X-Frame-Options, CSP, etc.).
- **H: Information Disclosure:** Error handling (no stack traces), sensitive data removal from API responses, environment variable prefixes.
- **I: Webhook Security:** Listener secret validation, rate limiting.
- **J: File & Storage Security:** Avatar upload validation (magic bytes).
- **K: Middleware / Route Protection:** Admin/Reseller route redirection, membership expiry checks.

## Constraints
- Do not add new features.
- Do not change UI or design.
- Do not change color palette.
- Do not change business logic (except for security fixes).
- Use `DATABASE_URL` only in `lib/prisma.ts`.
- Tagged template literals for raw SQL.
- Never expose sensitive data (hashes, tokens, OTPs) to client.
