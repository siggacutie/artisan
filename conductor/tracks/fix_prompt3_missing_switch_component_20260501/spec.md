# Specification: Fix Missing Switch Component

## Problem
The `app/(admin)/admin/settings/page.tsx` file attempts to import `Switch` from `@/components/ui/switch`, but this file does not exist in the project. This causes a "Module not found" error when accessing the Admin Settings page.

## Requirements
1.  Add the Shadcn UI `Switch` component to `components/ui/switch.tsx`.
2.  Ensure `Switch` is correctly styled according to the project's design system (Dark theme, gold accents).
3.  Verify that `app/(admin)/admin/settings/page.tsx` compiles and runs without errors.

## Acceptance Criteria
- `components/ui/switch.tsx` exists and is functional.
- The Admin Settings page loads without "Module not found" errors.
- The `Switch` component follows the dark-themed aesthetic with gold accents.
