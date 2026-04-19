import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const packages = await prisma.diamondPackage.findMany({
      include: { game: { select: { name: true } } },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(packages);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();

  try {
    const pkg = await prisma.diamondPackage.create({
      data: {
        gameId: data.gameId,
        diamondAmount: parseInt(data.diamondAmount),
        basePriceInr: parseFloat(data.basePriceInr),
        displayPrice: parseFloat(data.displayPrice),
        section: data.section || "standard",
        bonusDiamonds: parseInt(data.bonusDiamonds || "0"),
        bonusLabel: data.bonusLabel,
        supplierProductId: data.supplierProductId,
        sortOrder: parseInt(data.sortOrder || "0"),
        isVisible: true,
      },
    });
    return NextResponse.json(pkg);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...data } = await req.json();

  try {
    const pkg = await prisma.diamondPackage.update({
      where: { id },
      data: {
        gameId: data.gameId,
        diamondAmount: data.diamondAmount !== undefined ? parseInt(data.diamondAmount) : undefined,
        basePriceInr: data.basePriceInr !== undefined ? parseFloat(data.basePriceInr) : undefined,
        displayPrice: data.displayPrice !== undefined ? parseFloat(data.displayPrice) : undefined,
        bonusDiamonds: data.bonusDiamonds !== undefined ? parseInt(data.bonusDiamonds) : undefined,
        bonusLabel: data.bonusLabel,
        section: data.section,
        supplierProductId: data.supplierProductId,
        sortOrder: data.sortOrder !== undefined ? parseInt(data.sortOrder) : undefined,
        isVisible: data.isVisible,
      },
    });
    return NextResponse.json(pkg);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    // Soft delete
    await prisma.diamondPackage.update({
      where: { id },
      data: { isVisible: false },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
