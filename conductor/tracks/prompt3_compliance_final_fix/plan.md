# Implementation Plan: Final @Prompt3.md Compliance

## Phase 1: Exhaustive API Audit
1. [ ] Scan `app/api/` for routes missing `validateOrigin(req)`.
2. [ ] Scan `app/api/` for routes missing auth calls (`getResellerSession` or `getAdminSession`) if not public.
3. [ ] Scan `app/api/` for potential sensitive data leaks in `select` statements.
4. [ ] Audit `catch` blocks for `error.message` leaks.

## Phase 2: Targeted Fixes
1. [ ] Fix any routes missing CSRF/Auth.
2. [ ] Refine `select` statements to exclude `passwordHash`, `token`, etc.
3. [ ] Normalize error responses.

## Phase 3: Validation
1. [ ] Final code review against `@Prompt3.md`.
