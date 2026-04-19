# Track: Fix Navbar Import Runtime Error

## Overview
A runtime error occurs when loading the main page because the `Navbar` component is exported as a default export but imported as a named export in `app/(main)/layout.tsx`.

## Links
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
