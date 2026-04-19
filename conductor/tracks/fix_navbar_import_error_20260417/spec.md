# Specification - Fix Navbar Import Runtime Error

## Problem Statement
The application fails to render the main layout with the following error:
`Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. Check the render method of MainLayout.`

This is caused by `import { Navbar } from "@/components/layout/Navbar";` in `app/(main)/layout.tsx` failing to find a named export `Navbar` in `components/layout/Navbar.tsx`, which only has a default export.

## Proposed Solution
Update `app/(main)/layout.tsx` to use a default import for `Navbar`.

## Success Criteria
- The "Element type is invalid" error is resolved.
- The homepage and other routes using `MainLayout` render correctly.
