
/root/.pm2/logs/artisan-error.log last 20 lines:
0|artisan  |   meta: {
0|artisan  |     modelName: 'DiamondPackage',
0|artisan  |     error: 'Transaction already closed: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 5173 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.'
0|artisan  |   }
0|artisan  | }
0|artisan  | ⨯ Error [PrismaClientKnownRequestError]:
0|artisan  | Invalid `prisma.diamondPackage.updateMany()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Transaction API error: Transaction not found. Transaction ID is invalid, refers to an old closed transaction Prisma doesn't have information about anymore, or was obtained before disconnecting.
0|artisan  |     at async (.next/server/chunks/[root-of-the-server]__0eebzcp._.js:1:5112)
0|artisan  |     at async E (.next/server/chunks/[root-of-the-server]__0eebzcp._.js:1:4814)
0|artisan  |     at async l (.next/server/chunks/[root-of-the-server]__0eebzcp._.js:1:8446) {
0|artisan  |   code: 'P2028',
0|artisan  |   clientVersion: '5.22.0',
0|artisan  |   meta: {
0|artisan  |     modelName: 'DiamondPackage',
0|artisan  |     error: "Transaction not found. Transaction ID is invalid, refers to an old closed transaction Prisma doesn't have information about anymore, or was obtained before disconnecting."
0|artisan  |   }
0|artisan  | }

The transaction is timing out at 5 seconds. Some route is running a $transaction that includes diamondPackage.updateMany() and it's taking too long on the VPS connection.
Fix 1 — Increase transaction timeout in lib/prisma.ts:
tsimport { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 10000,  // wait up to 10s for a connection
      timeout: 15000,  // transaction can run for 15s
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
Fix 2 — Find the broken transaction route. Search your codebase for diamondPackage.updateMany — it's likely in a pricing refresh cron or package sync route. Give this to Gemini:
Search the entire codebase for any usage of prisma.$transaction that includes 
diamondPackage.updateMany(). When found, break it OUT of the $transaction block 
and run it as a standalone query instead. 

The pattern to find:
```ts
await prisma.$transaction([
  ...
  prisma.diamondPackage.updateMany(...),
  ...
])
```

Replace with sequential individual awaits instead of wrapping in $transaction:
```ts
await prisma.diamondPackage.updateMany(...)
// other operations separately
```

Only do this for the diamondPackage.updateMany call — not for wallet credit 
operations which MUST stay atomic.

Also in lib/prisma.ts, update the PrismaClient initialization to add 
transactionOptions:
```ts
new PrismaClient({
  transactionOptions: {
    maxWait: 10000,
    timeout: 15000,
  },
})
```

List every file modified.