 GET /admin/settings 500 in 64ms (next.js: 23ms, proxy.ts: 10ms, application-code: 31ms)
[browser] Uncaught Error: ./app/(admin)/admin/settings/page.tsx:9:1
Module not found: Can't resolve '@/components/ui/switch'
   7 | import { Input } from '@/components/ui/input'
   8 | import { Button } from '@/components/ui/button'
>  9 | import { Switch } from '@/components/ui/switch'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  10 | import { Label } from '@/components/ui/label'
  11 |
  12 | export default function AdminSettingsPage() {

Import map: aliased to relative './components/ui/switch' inside of [project]/


Import traces:
  Client Component Browser:
    ./app/(admin)/admin/settings/page.tsx [Client Component Browser]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

  Client Component SSR:
    ./app/(admin)/admin/settings/page.tsx [Client Component SSR]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


    at <unknown> (Error: ./app/(admin)/admin/settings/page.tsx:9:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (Error: (./app/(admin)/admin/settings/page.tsx:9:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
[browser] ./app/(admin)/admin/settings/page.tsx:9:1
Module not found: Can't resolve '@/components/ui/switch'
   7 | import { Input } from '@/components/ui/input'
   8 | import { Button } from '@/components/ui/button'
>  9 | import { Switch } from '@/components/ui/switch'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  10 | import { Label } from '@/components/ui/label'
  11 |
  12 | export default function AdminSettingsPage() {

Import map: aliased to relative './components/ui/switch' inside of [project]/

Import traces:
  Client Component Browser:
    ./app/(admin)/admin/settings/page.tsx [Client Component Browser]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

  Client Component SSR:
    ./app/(admin)/admin/settings/page.tsx [Client Component SSR]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found 
[browser] ./app/(admin)/admin/settings/page.tsx:9:1
Module not found: Can't resolve '@/components/ui/switch'
   7 | import { Input } from '@/components/ui/input'
   8 | import { Button } from '@/components/ui/button'
>  9 | import { Switch } from '@/components/ui/switch'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  10 | import { Label } from '@/components/ui/label'
  11 |
  12 | export default function AdminSettingsPage() {

Import map: aliased to relative './components/ui/switch' inside of [project]/

Import traces:
  Client Component Browser:
    ./app/(admin)/admin/settings/page.tsx [Client Component Browser]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

  Client Component SSR:
    ./app/(admin)/admin/settings/page.tsx [Client Component SSR]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found 
[browser] ./app/(admin)/admin/settings/page.tsx:9:1
Module not found: Can't resolve '@/components/ui/switch'
   7 | import { Input } from '@/components/ui/input'
   8 | import { Button } from '@/components/ui/button'
>  9 | import { Switch } from '@/components/ui/switch'
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  10 | import { Label } from '@/components/ui/label'
  11 |
  12 | export default function AdminSettingsPage() {

Import map: aliased to relative './components/ui/switch' inside of [project]/

Import traces:
  Client Component Browser:
    ./app/(admin)/admin/settings/page.tsx [Client Component Browser]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

  Client Component SSR:
    ./app/(admin)/admin/settings/page.tsx [Client Component SSR]
    ./app/(admin)/admin/settings/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found 