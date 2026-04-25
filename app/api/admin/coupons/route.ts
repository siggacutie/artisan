import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const coupons = await prisma.coupon.findMany({
      include: { applicableGame: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, discountPercent, maxUses, minOrderValue, expiryDate, applicableGameId, isActive } = await req.json();

  if (!code || !discountPercent) {
    return NextResponse.json({ error: "Code and discount are required" }, { status: 400 });
  }

  try {
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercent: parseFloat(discountPercent),
        maxUses: parseInt(maxUses || "999999"),
        minOrderValue: parseFloat(minOrderValue || "0"),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        applicableGameId: applicableGameId || null,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, code, discountPercent, maxUses, minOrderValue, expiryDate, applicableGameId, isActive } = await req.json();

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: code ? code.toUpperCase() : undefined,
        discountPercent: discountPercent !== undefined ? parseFloat(discountPercent) : undefined,
        maxUses: maxUses !== undefined ? parseInt(maxUses) : undefined,
        minOrderValue: minOrderValue !== undefined ? parseFloat(minOrderValue) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : (expiryDate === null ? null : undefined),
        applicableGameId: applicableGameId !== undefined ? (applicableGameId || null) : undefined,
        isActive,
      },
    });
    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
