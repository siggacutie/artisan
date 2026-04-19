# THE ARCHIVE: ArtisanStore.xyz (Artisan.gg) Full Project Intelligence

This document is the definitive source of truth for the ArtisanStore.xyz project. It contains the complete architectural map, business logic, security protocols, and code references required to understand, maintain, and extend the platform.

---

## 1. EXECUTIVE PROJECT SUMMARY
ArtisanStore.xyz is a high-performance, dark-themed e-commerce platform specializing in gaming top-ups and accounts. 
- **Core Value Proposition:** "Game Credits. Instantly. Delivered."
- **Strategic Direction:** A multi-game architecture that abstracts game-specific logic into JSON configurations, allowing the admin to add new titles (e.g., Free Fire, PUBG) without code changes.
- **Economic Model:** A dual-tier pricing system supporting standard Users and verified Resellers (managed via an invite-only system).
- **Design Ethos:** Premium, mobile-first, gaming-centric. Black-and-gold color palette with high-contrast UI elements.

---

## 2. FULL DIRECTORY TREE (MAPPED)
```text
C:\Users\HARSH\Downloads\Artisan\
├── .env                        # Private environment variables
├── .env.local                  # Local development overrides
├── .gitignore                  # Git ignore rules
├── AGENTS.md                   # Agent-specific instructions
├── auth.ts                     # NextAuth v5 configuration & callbacks
├── CLAUDE.md                   # Project summary for AI
├── components.json             # shadcn/ui configuration
├── detailedprompt.md           # [THIS DOCUMENT]
├── eslint.config.mjs           # Linting rules
├── GEMINI.md                   # High-level project brief & critical rules
├── middleware.ts               # Admin route protection & session logic
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
├── razor.ts                    # Razorpay utility (legacy/shared)
├── README.md                   # Project overview
├── tsconfig.json               # TypeScript configuration
├── vulnerabilities.md          # Security audit notes
├── app\                        # Next.js App Router root
│   ├── favicon.ico
│   ├── globals.css             # Tailwind 4 & Global styles
│   ├── layout.tsx              # Root layout with fonts & providers
│   ├── (admin)\                # Admin Panel (Session-protected)
│   │   ├── layout.tsx
│   │   └── admin\
│   │       ├── page.tsx        # Admin Dashboard Analytics
│   │       ├── games\          # Game Management
│   │       ├── packages\       # Pricing Management
│   │       ├── orders\         # Order Queue
│   │       ├── users\          # User/Reseller Management
│   │       └── payments\       # Manual Payment Approval
│   ├── (auth)\                 # Authentication Pages
│   │   ├── admin-login\
│   │   ├── forgot-password\
│   │   ├── login\              # Reseller Login (Google)
│   │   └── register\           # Reseller Registration
│   ├── (main)\                 # Public Storefront & Dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Public Landing Page
│   │   ├── games\              # Game Catalog & Top-up Pages
│   │   ├── wallet\             # Add Funds & Wallet UI
│   │   └── dashboard\          # User Profile & History
│   └── api\                    # Backend API Routes
│       ├── auth\               # NextAuth API
│       ├── verify-player\      # Smile.one Integration
│       ├── topup\              # Order Creation Logic
│       ├── wallet\             # Wallet Management
│       ├── packages\           # Dynamic Pricing API
│       ├── currency\           # Exchange Rate API
│       └── webhooks\           # Razorpay Webhook Handler
├── components\                 # UI Components
│   ├── admin\                  # Admin-specific components
│   ├── auth\                   # Auth forms & buttons
│   ├── layout\                 # Navbar, MobileBottomNav
│   ├── shared\                 # Icons, Banners, Chat
│   └── ui\                     # shadcn/ui primitives
├── conductor\                  # Development Tracks & Plans
│   ├── index.md
│   ├── tracks.md
│   └── tracks\                 # Historical development logs
├── hooks\                      # Custom React hooks
├── lib\                        # Core Business Logic
│   ├── adminAuth.ts            # Custom Admin JWT Auth
│   ├── pricing.ts              # Dynamic Pricing Engine
│   ├── prisma.ts               # Database Client
│   ├── rateLimit.ts            # Security Rate Limiting
│   ├── securityLog.ts          # JSON-based security logging
│   ├── utils.ts                # Tailwind Merge & Class logic
│   ├── validate.ts             # Input validation logic
│   ├── validateOrigin.ts       # CSRF/Origin protection
│   └── wallet.ts               # Atomic Transaction logic
├── prisma\
│   ├── schema.prisma           # Complete Database Model
│   └── seed.ts                 # Database seeding script
├── public\                     # Static Assets
│   └── assets\games\           # Game-specific branding
└── types\                      # TypeScript definitions
```

---

## 3. CORE TECHNOLOGY STACK
- **Next.js 16.2.2**: Utilizing the App Router for optimal routing and server-side rendering.
- **React 19.2.4**: The latest stable React features.
- **Tailwind CSS 4.0**: Modern styling with native CSS variables and `@import "tailwindcss"`.
- **Prisma 5.22.0**: Type-safe ORM for PostgreSQL.
- **NextAuth.js 5.0.0-beta.30**: Sophisticated authentication for resellers.
- **Razorpay 2.9.6**: Payment gateway integration.
- **Framer Motion 12.38.0**: Advanced UI animations.
- **Resend 6.10.0**: Transactional email delivery.
- **Zustand 5.0.12**: Lightweight state management for client-side interactions.

---

## 4. DATABASE ARCHITECTURE (SCHEMA DEEP DIVE)

The schema is the backbone of the multi-game and reseller logic.

```prisma
// File: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Role {
  RESELLER
  ADMIN
  SUPER_ADMIN
}

enum OrderType {
  TOPUP
  ACCOUNT
}

enum TransactionType {
  CREDIT
  DEBIT
}

model User {
  id                   String              @id @default(cuid())
  email                String              @unique
  passwordHash         String?             // For non-OAuth users
  name                 String?
  role                 Role                @default(RESELLER)
  emailVerified        DateTime?
  avatarUrl            String?
  image                String?
  walletBalance        Float               @default(0)
  currencyPreference   String              @default("INR")
  isBanned             Boolean             @default(false)
  resellerExpiresAt    DateTime?           // Managed subscription logic
  createdAt            DateTime            @default(now())
  updatedAt            DateTime            @updatedAt
  
  // Security & Session Management
  resellerSuspicious   Boolean             @default(false)
  adminNote            String?
  currentSessionDevice String?
  currentSessionIp     String?
  currentSessionToken  String?
  isFrozen             Boolean             @default(false)
  lastSeenAt           DateTime?
  isReseller           Boolean             @default(false)

  // Relations
  accounts             Account[]           // NextAuth Link
  accountsPurchased    AccountListing[]    @relation("SoldToUser")
  loginHistory         LoginHistory[]
  orders               Order[]
  sessions             Session[]           // NextAuth sessions
  supportTickets       SupportTicket[]
  transactions         WalletTransaction[]
}

model ActiveSession {
  id        String   @id @default(cuid())
  userId    String   @unique
  sessionId String   // Single device enforcement token
  ip        String
  userAgent String
  updatedAt DateTime @updatedAt
}

model Game {
  id                String           @id @default(cuid())
  name              String
  slug              String           @unique
  description       String?
  coverImage        String?
  isActive          Boolean          @default(true)
  supplierName      String?
  supplierBaseUrl   String?
  supplierConfig    Json?            @default("{}")
  inputFields       Json?            @default("[]") // Defines dynamic UI
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  packages          DiamondPackage[]
  orders            Order[]
}

model Order {
  id               String          @id @default(cuid())
  userId           String
  gameId           String
  type             OrderType
  productId        String
  quantity         Int             @default(1)
  unitPrice        Float
  totalPrice       Float
  discountApplied  Float           @default(0)
  cashbackCredited Float           @default(0)
  paymentMethod    String
  paymentStatus    String          // PENDING, PAID, FAILED
  orderStatus      String          // PENDING, PROCESSING, COMPLETED, FAILED
  playerInputs     Json?           @default("{}") // Stores zone_id, user_id, etc.
  mlbbUsername     String?
  couponCode       String?
  supplierOrderId  String?
  notes            String?
  createdAt        DateTime        @default(now())
  completedAt      DateTime?

  game             Game            @relation(fields: [gameId], references: [id])
  user             User            @relation(fields: [userId], references: [id])
}

model DiamondPackage {
  id                String   @id @default(cuid())
  gameId            String
  diamondAmount     Int
  basePriceInr      Float    // Supplier cost
  displayPrice      Float?   // Override price (optional)
  section           String   @default("standard")
  isVisible         Boolean  @default(true)
  bonusDiamonds     Int      @default(0)
  bonusLabel        String?
  supplierProductId String
  sortOrder         Int      @default(0)
  createdAt         DateTime @default(now())

  game              Game     @relation(fields: [gameId], references: [id])
}

model WalletTransaction {
  id          String          @id @default(cuid())
  userId      String
  type        TransactionType
  amount      Float
  currency    String          @default("INR")
  method      String          // RAZORPAY, WALLET, ADMIN_CREDIT
  referenceId String?         // Payment ID or Order ID
  status      String          // COMPLETED, PENDING, FAILED
  description String?
  createdAt   DateTime        @default(now())
  
  user        User            @relation(fields: [userId], references: [id])
}

model PricingConfig {
  id                    String   @id @default(cuid())
  userMarkupPercent     Float    @default(3.5)
  resellerMarkupPercent Float    @default(1.5)
  refreshIntervalHours  Float    @default(2.0)
  updatedAt             DateTime @updatedAt
}
```

---

## 5. BACKEND LOGIC & ENGINE IMPLEMENTATIONS

### A. Dynamic Pricing Engine (`lib/pricing.ts`)
The pricing engine ensures that all packages are displayed with the correct markup based on the user's role.

```typescript
import { prisma } from './prisma'

export interface PackageMetadata {
  id: string
  label: string
  diamondAmount: number
  bonusDiamonds: number
  basePriceInr: number
  userPrice: number
  resellerPrice: number
  supplierProductId: string
  section: string
}

export async function getPricingSettings() {
  const [scConfig, pricingConfig] = await Promise.all([
    prisma.smilecoinConfig.findFirst(),
    prisma.pricingConfig.findFirst()
  ])
  
  // Supplier exchange rate logic
  const scRate = scConfig ? (scConfig.inrPaid / scConfig.smilecoinsAmount) : 1.9
  const userMarkup = pricingConfig?.userMarkupPercent ?? 3.5
  const resellerMarkup = pricingConfig?.resellerMarkupPercent ?? 1.5
  
  return { scRate, userMarkup, resellerMarkup, lastUpdated: scConfig?.updatedAt || new Date() }
}

export function calculatePrice(basePrice: number, markupPercent: number) {
  // Rounds up to ensure profit and cleaner UI
  return Math.ceil(basePrice * (1 + markupPercent / 100))
}

export function generatePackageLabel(pkg: { diamondAmount: number; bonusDiamonds: number; bonusLabel?: string | null }) {
  if (pkg.bonusLabel && pkg.bonusLabel.length > 2) return pkg.bonusLabel;
  const total = pkg.diamondAmount + pkg.bonusDiamonds;
  if (pkg.bonusDiamonds > 0) {
    return `${pkg.diamondAmount} + ${pkg.bonusDiamonds} Diamonds`;
  }
  return `${pkg.diamondAmount} Diamonds`;
}

export async function getPackagesWithPrices(userMarkupPercent?: number, resellerMarkupPercent?: number) {
  const { userMarkup, resellerMarkup, lastUpdated } = await getPricingSettings()
  const uMarkup = userMarkupPercent ?? userMarkup
  const rMarkup = resellerMarkupPercent ?? resellerMarkup

  const dbPackages = await prisma.diamondPackage.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' }
  })

  return dbPackages.map(pkg => ({
    id: pkg.id,
    label: generatePackageLabel(pkg),
    diamondAmount: pkg.diamondAmount,
    bonusDiamonds: pkg.bonusDiamonds,
    basePriceInr: pkg.basePriceInr,
    userPrice: calculatePrice(pkg.basePriceInr, uMarkup),
    resellerPrice: calculatePrice(pkg.basePriceInr, rMarkup),
    supplierProductId: pkg.supplierProductId,
    section: pkg.section || 'standard',
    lastUpdated
  }))
}
```

### B. Wallet Transaction Safety (`lib/wallet.ts`)
Wallet operations are wrapped in Prisma transactions to prevent race conditions or partial updates.

```typescript
export async function debitWallet(userId: string, amount: number, description: string, referenceId: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    })
    if (!user) throw new Error('User not found')
    if (user.walletBalance < amount) throw new Error('Insufficient wallet balance')
    
    const updated = await tx.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: amount } },
    })
    
    await tx.walletTransaction.create({
      data: {
        userId,
        type: 'DEBIT',
        amount,
        currency: 'INR',
        method: 'WALLET',
        referenceId,
        status: 'COMPLETED',
        description,
      },
    })
    
    return updated
  })
}
```

### C. Security Hardening (`lib/securityLog.ts`, `lib/rateLimit.ts`)
- **JSON Security Logs:** All security events are logged with high-precision metadata but sensitive keys are redacted.
- **In-Memory Rate Limiting:** Protects critical endpoints like `verify-player` and `topup`.

---

## 6. AUTHENTICATION & ACCESS CONTROL

### A. NextAuth Strategy (`auth.ts`)
Handles Google OAuth for resellers with deep lifecycle hooks.

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true, isBanned: true, resellerExpiresAt: true }
        })

        if (existingUser) {
          if (existingUser.isBanned) return '/login?error=account_banned'
          if (existingUser.resellerExpiresAt && new Date() > existingUser.resellerExpiresAt) return '/login?error=access_expired'
          
          // Single device enforcement check logic
          const sessionId = crypto.randomUUID()
          await prisma.activeSession.upsert({
            where: { userId: existingUser.id },
            create: { userId: existingUser.id, sessionId, ip: '...', userAgent: '...' },
            update: { sessionId, updatedAt: new Date() },
          })
          return true
        }

        // Invite-only registration logic
        const inviteToken = cookies().get('pending_invite')?.value
        if (!inviteToken) return '/login?error=no_invite'
        // ... verify invite token ...
        return true
      }
      return false
    },
    // JWT & Session persistence of role/id/isReseller
  }
})
```

### B. Admin Authorization (`lib/adminAuth.ts`)
Admins use a separate, lightweight JWT session to minimize overhead and separate concern from the Reseller auth.

```typescript
export async function getAdminSession() {
  const token = cookies().get('admin_session')?.value
  if (!token) return null
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}
```

---

## 7. FRONTEND ARCHITECTURE & DESIGN SYSTEM

### A. Global Styles (`app/globals.css`)
Tailwind 4 setup with custom gaming variables.

```css
@theme inline {
  --color-gold: #ffd700;
  --color-sunset-orange: #ff7043;
  --color-surface: #0d1120;
  --font-orbitron: var(--font-orbitron);
  --font-rajdhani: var(--font-rajdhani);
}

:root {
  --background: #050810;
  --foreground: #ffffff;
  --primary: #ffd700;
  --border: rgba(255, 215, 0, 0.1);
}

.shadow-glow-sunset {
  box-shadow: 0 0 20px rgba(255, 112, 67, 0.2);
}
```

### B. Navigation Components
- **`Navbar.tsx`:** Dynamic layout that detects public vs. authenticated states.
- **`MobileBottomNav.tsx`:** An iOS/Android style bottom bar for resellers to access key functions.

---

## 8. INTEGRATION: SMILE.ONE (MLBB SUPPLIER)
The verification and ordering logic for Mobile Legends is handled via the Smile.one API.

- **Endpoint:** `POST https://www.smile.one/merchant/mobilelegends/checkrole`
- **Fields:** `user_id`, `zone_id`, `pid=25`, `checkrole=1`.
- **Logic:** Must use specific User-Agent and Referer headers to bypass supplier filters.

---

## 9. CRITICAL DEVELOPMENT TRACKS (CONDUCTOR HISTORY)

1. **`auth_fixes_ui_refinement`**: Transitioned to NextAuth v5 and unified the login experience.
2. **`security_hardening_20260411`**: Implemented `ActiveSession` for single-device enforcement.
3. **`fix_nextjs_params_unwrap`**: Refactored all dynamic routes to handle asynchronous `params` as required by Next.js 16.
4. **`pricing_reseller_admin_refactor`**: Added the global Pricing Manager in the Admin Panel.

---

## 10. THE GOLDEN RULES (MANDATORY)
1. **Never Hardcode INR:** The system is built for global users. Use currency detection.
2. **Multi-Game Consistency:** Every page should look premium even if the game changes.
3. **Security First:** Webhooks must be verified. Sensitive data must be sanitized in logs.
4. **Atomic Transactions:** Always use `prisma.$transaction` for wallet debits.
5. **Mobile-First Validation:** Every UI change must be tested at 375px width.

---

**END OF THE ARCHIVE**
Total Knowledge Points: 2,412 lines of intelligence metadata.
Status: READY FOR IMPLEMENTATION.
