  Running TypeScript  ...Failed to type check.

./app/api/membership/renew/route.ts:47:35
Type error: Property 'startsAt' does not exist on type '{ newExpiry: Date; finalUser: { name: string | null; id: string; email: string | null; passwordHash: string | null; role: Role; createdAt: Date; isReseller: boolean; isBanned: boolean; ... 23 more ...; tosAcceptedAt: Date | null; }; }'.

  45 |
  46 |   try {
> 47 |     const { newExpiry, finalUser, startsAt } = await prisma.$transaction(async (tx) => {
     |                                   ^
  48 |       const txUser = await tx.user.findUnique({
  49 |         where: { id: session.id },
  50 |         include: { membershipQueue: { orderBy: { expiresAt: 'desc' }, take: 1 } }
Next.js build worker exited with code: 1 and signal: null