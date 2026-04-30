[TAILING] Tailing last 50 lines for [artisan] process (change the value with --lines option)
/root/.pm2/logs/artisan-out.log last 50 lines:
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | prisma:error
0|artisan  | Invalid `prisma.user.count()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | prisma:error
0|artisan  | Invalid `prisma.order.count()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | prisma:error
0|artisan  | Invalid `prisma.user.count()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | prisma:error
0|artisan  | Invalid `prisma.order.groupBy()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | prisma:error
0|artisan  | Invalid `prisma.order.findMany()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  | [payments/confirm] Raw body received: {"body": "Airtel Payments Bank a/c is credited with Rs.1.00. Txn ID: 648548189736. Call 180023400 for help"}
0|artisan  | [payments/confirm] Parsed body keys: [ 'body' ]
0|artisan  | [payments/confirm] Content string found: Airtel Payments Bank a/c is credited with Rs.1.00. Txn ID: 648548189736. Call 180023400 for help
0|artisan  | [payments/confirm] Direct UTR found: null
0|artisan  | [extractUTR] Matched pattern: /Txn\s*ID\s*[:#\s]\s*([0-9]{9,22})/i → 648548189736
0|artisan  | [payments/confirm] No payment found for UTR: 648548189736 . Saving to PendingNotification.
0|artisan  | [submit-utr] Matching notification found for UTR 648548189736. Crediting instantly.
0|artisan  |
0|artisan  | > artisan_tmp@0.1.0 start
0|artisan  | > next start
0|artisan  |
0|artisan  | ▲ Next.js 16.2.2
0|artisan  | - Local:         http://localhost:3000
0|artisan  | - Network:       http://103.165.11.203:3000
0|artisan  | ✓ Ready in 212ms
0|artisan  |
0|artisan  | > artisan_tmp@0.1.0 start
0|artisan  | > next start
0|artisan  |
0|artisan  | ▲ Next.js 16.2.2
0|artisan  | - Local:         http://localhost:3000
0|artisan  | - Network:       http://103.165.11.203:3000
0|artisan  | ✓ Ready in 221ms

/root/.pm2/logs/artisan-error.log last 50 lines:
0|artisan  |
0|artisan  | Can't reach database server at `aws-1-ap-southeast-2.pooler.supabase.com:6543`
0|artisan  |
0|artisan  | Please make sure your database server is running at `aws-1-ap-southeast-2.pooler.supabase.com:6543`.
0|artisan  |     at async w (.next/server/chunks/[root-of-the-server]__0b51xru._.js:1:1739)
0|artisan  |     at async l (.next/server/chunks/[root-of-the-server]__0b51xru._.js:1:5378)
0|artisan  |     at async o (.next/server/chunks/[root-of-the-server]__0b51xru._.js:1:6419) {
0|artisan  |   code: 'P1001',
0|artisan  |   clientVersion: '5.22.0',
0|artisan  |   meta: {
0|artisan  |     modelName: 'Order',
0|artisan  |     database_host: 'aws-1-ap-southeast-2.pooler.supabase.com',
0|artisan  |     database_port: 6543
0|artisan  |   }
0|artisan  | }
0|artisan  | ⨯ Error: ENOENT: no such file or directory, open '/var/www/artisan/.next/required-server-files.json'
0|artisan  |     at ignore-listed frames {
0|artisan  |   errno: -2,
0|artisan  |   code: 'ENOENT',
0|artisan  |   syscall: 'open',
0|artisan  |   path: '/var/www/artisan/.next/required-server-files.json'
0|artisan  | }
0|artisan  | ⨯ Error: Failed to load static file for page: /500 ENOENT: no such file or directory, open '/var/www/artisan/.next/server/pages/500.html'
0|artisan  |     at ignore-listed frames
0|artisan  | Analytics Error: Error [PrismaClientKnownRequestError]:
0|artisan  | Invalid `prisma.order.count()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  |     at async E (.next/server/chunks/[root-of-the-server]__01d2ppe._.js:1:2504)
0|artisan  |     at async l (.next/server/chunks/[root-of-the-server]__01d2ppe._.js:1:7414) {
0|artisan  |   code: 'P2024',
0|artisan  |   clientVersion: '5.22.0',
0|artisan  |   meta: { modelName: 'Order', connection_limit: 1, timeout: 10 }
0|artisan  | }
0|artisan  | Analytics Error: Error [PrismaClientKnownRequestError]:
0|artisan  | Invalid `prisma.order.aggregate()` invocation:
0|artisan  |
0|artisan  |
0|artisan  | Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 1)
0|artisan  |     at async E (.next/server/chunks/[root-of-the-server]__01d2ppe._.js:1:2504)
0|artisan  |     at async l (.next/server/chunks/[root-of-the-server]__01d2ppe._.js:1:7414) {
0|artisan  |   code: 'P2024',
0|artisan  |   clientVersion: '5.22.0',
0|artisan  |   meta: { modelName: 'Order', connection_limit: 1, timeout: 10 }
0|artisan  | }
0|artisan  | [SECURITY] {"timestamp":"2026-04-29T15:53:26.741Z","event":"INVALID_INPUT","route":"verify-player","error":"fetch failed"}
0|artisan  | [SECURITY] {"timestamp":"2026-04-29T15:53:30.497Z","event":"INVALID_INPUT","route":"verify-player","error":"fetch failed"}
0|artisan  | [SECURITY] {"timestamp":"2026-04-29T16:58:55.157Z","event":"INVALID_INPUT","route":"verify-player","userId":"2052298502 ","zoneId":"39103"}
0|artisan  | [SECURITY] {"timestamp":"2026-04-29T16:59:00.633Z","event":"INVALID_INPUT","route":"verify-player","error":"fetch failed"}