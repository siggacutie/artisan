import { getAdminSession } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const history = await prisma.loginHistory.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(history)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch login history" }, { status: 500 })
  }
}
