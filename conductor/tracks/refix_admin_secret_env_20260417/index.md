# Track: Re-fix Admin Login Secret (Env Formatting)

## Overview
The `ADMIN_JWT_SECRET` was appended to `.env.local` without a newline, causing it to be combined with the previous variable and resulting in it remaining undefined.

## Links
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
