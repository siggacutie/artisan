# Specification: Fix TypeScript Error in Games Page

## Problem
The `app/(main)/games/page.tsx` file contains a TypeScript error at line 95.
An inline style object uses the property `pr`, which is not a valid CSS property in React's `style` type.

## Error Message
`Type error: Object literal may only specify known properties, and 'pr' does not exist in type 'Properties<string | number, string & {}>'.`

## Proposed Fix
Replace the invalid `pr` property with `paddingRight` in the style object.

## Affected Files
- `app/(main)/games/page.tsx`
