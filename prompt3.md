Type error: Type 'typeof import("C:/Users/HARSH/Downloads/Artisan/app/api/admin/payments/[id]/route")' does not satisfy the constraint 'RouteHandlerConfig<"/api/admin/payments/[id]">'.
  Types of property 'PATCH' are incompatible.
    Type '(req: NextRequest, { params }: { params: { id: string; }; }) => Promise<NextResponse<{ error: string; }> | NextResponse<{ success: boolean; }>>' is not assignable to type '(request: NextRequest, context: { params: Promise<{ id: string; }>; }) => void | Response | Promise<void | Response>'.
      Types of parameters '__1' and 'context' are incompatible.
        Type '{ params: Promise<{ id: string; }>; }' is not assignable to type '{ params: { id: string; }; }'.
          Types of property 'params' are incompatible.
            Property 'id' is missing in type 'Promise<{ id: string; }>' but required in type '{ id: string; }'.

  547 |   type __IsExpected<Specific extends RouteHandlerConfig<"/api/admin/payments/[id]">> = Sp...
  548 |   const handler = {} as typeof import("../../../app/api/admin/payments/[id]/route.js")
> 549 |   type __Check = __IsExpected<typeof handler>
      |                               ^
  550 |   // @ts-ignore
  551 |   type __Unused = __Check
  552 | }
Next.js build worker exited with code: 1 and signal: null