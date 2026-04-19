import { getAdminSession } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const result = await prisma.user.updateMany({
      where: {
        role: 'RESELLER',
        isReseller: false
      },
      data: {
        isReseller: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Fixed ${result.count} resellers.`,
      count: result.count
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fix resellers" }, { status: 500 })
  }
}
