root@hidden-logic-6065:/var/www/artisan# git checkout -- .
git pull origin master
npm run build
From https://github.com/siggacutie/artisan
 * branch            master     -> FETCH_HEAD
Already up to date.

> artisan_tmp@0.1.0 build
> next build

▲ Next.js 16.2.2 (Turbopack)
- Environments: .env

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
  Creating an optimized production build ...

> Build error occurred
Error: Turbopack build failed with 5 errors:
./app/api/dashboard/profile/route.ts:6:1
Export sanitizeHtml doesn't exist in target module
  4 | import { validateOrigin } from '@/lib/validateOrigin'
  5 | import { securityLog } from '@/lib/securityLog'
> 6 | import { validators, sanitizeHtml } from '@/lib/validate'
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  7 |
  8 | export async function POST(req: NextRequest) {
  9 |   if (!validateOrigin(req)) {

The export sanitizeHtml was not found in module [project]/lib/validate.ts [app-route] (ecmascript).
Did you mean to import sanitizeInput?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


./app/api/orders/create/route.ts:8:1
Export sanitizeHtml doesn't exist in target module
   6 | import { securityLog } from '@/lib/securityLog'
   7 | import { rateLimit } from '@/lib/rateLimit'
>  8 | import { validators, sanitizeHtml } from '@/lib/validate'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   9 | import { getPackagesWithPrices } from '@/lib/pricing'
  10 |
  11 | export async function POST(req: NextRequest) {

The export sanitizeHtml was not found in module [project]/lib/validate.ts [app-route] (ecmascript).
Did you mean to import sanitizeInput?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


./app/api/dashboard/profile/route.ts:6:1
Export validators doesn't exist in target module
  4 | import { validateOrigin } from '@/lib/validateOrigin'
  5 | import { securityLog } from '@/lib/securityLog'
> 6 | import { validators, sanitizeHtml } from '@/lib/validate'
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  7 |
  8 | export async function POST(req: NextRequest) {
  9 |   if (!validateOrigin(req)) {

The export validators was not found in module [project]/lib/validate.ts [app-route] (ecmascript).
Did you mean to import validatePassword?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


./app/api/orders/create/route.ts:8:1
Export validators doesn't exist in target module
   6 | import { securityLog } from '@/lib/securityLog'
   7 | import { rateLimit } from '@/lib/rateLimit'
>  8 | import { validators, sanitizeHtml } from '@/lib/validate'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   9 | import { getPackagesWithPrices } from '@/lib/pricing'
  10 |
  11 | export async function POST(req: NextRequest) {

The export validators was not found in module [project]/lib/validate.ts [app-route] (ecmascript).
Did you mean to import validatePassword?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


./app/api/verify-player/route.ts:5:1
Export validators doesn't exist in target module
  3 | import { securityLog } from '@/lib/securityLog'
  4 | import { rateLimit, getClientIp } from '@/lib/rateLimit'
> 5 | import { validators } from '@/lib/validate'
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  6 |
  7 | export async function POST(req: NextRequest) {
  8 |   if (!validateOrigin(req)) {

The export validators was not found in module [project]/lib/validate.ts [app-route] (ecmascript).
Did you mean to import validatePassword?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


    at <unknown> (./app/api/dashboard/profile/route.ts:6:1)
    at <unknown> (./app/api/orders/create/route.ts:8:1)
    at <unknown> (./app/api/dashboard/profile/route.ts:6:1)
    at <unknown> (./app/api/orders/create/route.ts:8:1)
    at <unknown> (./app/api/verify-player/route.ts:5:1)
root@hidden-logic-6065:/var/www/artisan#
how to fix this error when i try to get the code to my host