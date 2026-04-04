# Implementation Plan: Project Scaffolding (Phase 1 Foundation)

Scaffold the project foundation for Artisan.gg as per the requirements in `prompt1.md`.

## Objective
Establish the technical foundation, including the Next.js framework, core dependencies, UI components, database schema, and folder structure.

## Key Files & Context
- `GEMINI.md`: Project overview and database schema.
- `prompt1.md`: Detailed scaffolding instructions.
- `conductor/`: Project management and design guidelines.

## Implementation Steps

### 1. Initialize Next.js App
- Execute: `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm`
- *Note:* This will occur in the root directory. If prompted to overwrite, proceed.

### 2. Install Dependencies
- **Core:** `prisma`, `@prisma/client`, `next-auth@beta`, `bcryptjs`, `jsonwebtoken`, `resend`, `razorpay`, `axios`, `zod`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `sonner`, `lucide-react`, `framer-motion`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **Dev:** `@types/bcryptjs`, `@types/jsonwebtoken`

### 3. Initialize shadcn/ui
- Execute: `npx shadcn@latest init --defaults`
- Add components: `button`, `card`, `input`, `label`, `badge`, `dialog`, `sheet`, `tabs`, `select`, `accordion`, `toast`, `dropdown-menu`, `avatar`, `skeleton`, `separator`, `progress`.

### 4. Initialize Prisma
- Execute: `npx prisma init`

### 5. Create Folder Structure
- Create directories and `.gitkeep` files for the following paths:
  - `app/(auth)/login`
  - `app/(auth)/register`
  - `app/(auth)/forgot-password`
  - `app/(main)/page.tsx` (ensure file exists)
  - `app/(main)/games/[game-slug]/topup`
  - `app/(main)/games/[game-slug]/accounts/[id]`
  - `app/(main)/dashboard/orders`
  - `app/(main)/dashboard/wallet`
  - `app/(main)/dashboard/profile`
  - `app/(main)/dashboard/accounts`
  - `app/(main)/wallet/add`
  - `app/(main)/admin/games/[game-slug]`
  - `app/(main)/admin/packages`
  - `app/(main)/admin/accounts`
  - `app/(main)/admin/orders`
  - `app/(main)/admin/users`
  - `app/(main)/admin/payments`
  - `app/(main)/admin/coupons`
  - `app/(main)/terms`
  - `app/(main)/privacy`
  - `app/(main)/contact`
  - `app/api/auth/[...nextauth]`
  - `app/api/webhooks/razorpay`
  - `app/api/games`
  - `app/api/topup`
  - `app/api/accounts`
  - `app/api/wallet`
  - `app/api/orders`
  - `app/api/admin`
  - `app/api/currency`
  - `app/api/supplier`
  - `components/layout`, `components/auth`, `components/games`, `components/topup`, `components/accounts`, `components/wallet`, `components/dashboard`, `components/admin`, `components/shared`
  - `lib`, `hooks`, `types`

### 6. Configuration Files
- **.env.local:** Create with placeholders from `prompt1.md`.
- **Prisma Schema (`prisma/schema.prisma`):** Implement the schema from `GEMINI.md` with the modifications specified in `prompt1.md` (Json fields for `supplierConfig`, `inputFields`, `playerInputs`).
- **Tailwind Config (`tailwind.config.ts`):** Set dark mode, extend colors (gold, navy, card, accent), and add `tailwindcss-animate` plugin.
- **Globals CSS (`app/globals.css`):** Set base colors and gold scrollbar.
- **Prisma Client (`lib/prisma.ts`):** Implement as a singleton.
- **Types (`types/index.ts`):** Define core interfaces.

### 7. Verification
- `npx prisma generate`
- `npm run dev` (briefly to check for errors)

## Verification & Testing
- Ensure all directories and files are created according to the plan.
- Confirm `prisma generate` completes successfully.
- Verify Tailwind colors and theme are applied.
