Read GEMINI.md fully before starting anything.
Scaffold the project foundation. Steps in exact order:

STEP 1 - CREATE NEXT.JS APP
npx create-next-app@latest . --typescript --tailwind --eslint
--app --no-src-dir --import-alias "@/*"

STEP 2 - INSTALL DEPENDENCIES
npm install prisma @prisma/client next-auth@beta bcryptjs
jsonwebtoken resend razorpay axios zod react-hook-form
@hookform/resolvers zustand sonner lucide-react framer-motion
class-variance-authority clsx tailwind-merge tailwindcss-animate
npm install -D @types/bcryptjs @types/jsonwebtoken

STEP 3 - INIT SHADCN
npx shadcn@latest init --defaults
npx shadcn@latest add button card input label badge dialog
sheet tabs select accordion toast dropdown-menu avatar
skeleton separator progress

STEP 4 - INIT PRISMA
npx prisma init

STEP 5 - FOLDER STRUCTURE
Create these folders with a .gitkeep inside each:
app/(auth)/login
app/(auth)/register
app/(auth)/forgot-password
app/(main)/page.tsx
app/(main)/games/[game-slug]
app/(main)/games/[game-slug]/topup
app/(main)/games/[game-slug]/accounts
app/(main)/games/[game-slug]/accounts/[id]
app/(main)/dashboard
app/(main)/dashboard/orders
app/(main)/dashboard/wallet
app/(main)/dashboard/profile
app/(main)/dashboard/accounts
app/(main)/wallet/add
app/(main)/admin
app/(main)/admin/games
app/(main)/admin/games/[game-slug]
app/(main)/admin/packages
app/(main)/admin/accounts
app/(main)/admin/orders
app/(main)/admin/users
app/(main)/admin/payments
app/(main)/admin/coupons
app/(main)/terms
app/(main)/privacy
app/(main)/contact
app/api/auth/[...nextauth]
app/api/webhooks/razorpay
app/api/games
app/api/topup
app/api/accounts
app/api/wallet
app/api/orders
app/api/admin
app/api/currency
app/api/supplier
components/layout
components/auth
components/games
components/topup
components/accounts
components/wallet
components/dashboard
components/admin
components/shared
lib
hooks
types

STEP 6 - ENV FILE
Create .env.local:
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="noreply@artisan.gg"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""
SMILEONE_USER_ID=""
SMILEONE_API_KEY=""
SMILEONE_BASE_URL="https://www.smile.one/merchant/mobilelegends"
ENCRYPTION_KEY=""
CURRENCY_API_KEY=""

STEP 7 - PRISMA SCHEMA
Write prisma/schema.prisma using the full database schema
from GEMINI.md exactly. All models must include the Games
model with slug, supplierConfig and inputFields as json.
Orders must use playerInputs as json not fixed UID fields.
DiamondPackages and AccountListings must have gameId.

STEP 8 - TAILWIND CONFIG
darkMode: "class"
extend.colors: gold #ffd700, navy #0a0f1e, card #131929,
accent #00c3ff
plugins: tailwindcss-animate

STEP 9 - GLOBALS CSS
Background #0a0f1e, text white, thin gold scrollbar.

STEP 10 - PRISMA CLIENT
Create lib/prisma.ts as Next.js safe singleton.

STEP 11 - TYPES FILE
Create types/index.ts with interfaces for:
User, Game, Order, WalletTransaction, DiamondPackage,
AccountListing, Coupon, ApiResponse, PaymentMethod,
CurrencyInfo, PlayerInput

STEP 12 - VERIFY
npx prisma generate
npm run dev
No UI. Foundation only. Report what was created and what
needs a real key before it will work.
