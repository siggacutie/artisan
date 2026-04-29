prisma:error 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].smilecoinConfig.findFirst()` invocation in
C:\Users\HARSH\Downloads\Artisan\.next\dev\server\chunks\[root-of-the-server]__0oj6_pe._.js:118:168

  115 async function GET(req) {
  116     try {
  117         const isLanding = new URL(req.url).searchParams.get('landing') === 'true';
→ 118         const config = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].smilecoinConfig.findFirst(
Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:6543`

Please make sure your database server is running at `aws-1-ap-southeast-2.pooler.supabase.com:6543`.
file:///C:/Users/HARSH/Downloads/Artisan/node_modules/@prisma/client/runtime/library.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: TypeError [ERR_INVALID_ARG_TYPE]: The "payload" argument must be of type object. Received null
[/api/packages] Error: Error [PrismaClientInitializationError]: 
Invalid `__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].smilecoinConfig.findFirst()` invocation in
C:\Users\HARSH\Downloads\Artisan\.next\dev\server\chunks\[root-of-the-server]__0oj6_pe._.js:118:168

  115 async function GET(req) {
  116     try {
  117         const isLanding = new URL(req.url).searchParams.get('landing') === 'true';
→ 118         const config = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].smilecoinConfig.findFirst(
Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:6543`

Please make sure your database server is running at `aws-1-ap-southeast-2.pooler.supabase.com:6543`.
    at <unknown> (app\api\packages\route.ts:44:49)
    at async GET (app\api\packages\route.ts:44:20)
  42 |     const isLanding = new URL(req.url).searchParams.get('landing') === 'true'
  43 |
> 44 |     const config = await prisma.smilecoinConfig.findFirst({
     |                                                 ^
  45 |       orderBy: { updatedAt: 'desc' },
  46 |     })
  47 | {
  clientVersion: '5.22.0',
  errorCode: undefined
}