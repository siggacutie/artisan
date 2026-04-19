# Track: Fix Reseller Login and Complete Admin User API

## Overview
Resellers created manually by admins cannot log in because the `isReseller` flag remains `false` in the database, while the `signIn` callback in `auth.ts` requires it to be `true`. Additionally, several administrative actions in the user management panel are not implemented in the backend API.

## Links
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
