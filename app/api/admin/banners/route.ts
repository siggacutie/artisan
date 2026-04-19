import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const banners = await prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(banners);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, subtitle, ctaText, ctaLink, gradientStart, gradientEnd, isActive, sortOrder } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        ctaText,
        ctaLink,
        gradientStart,
        gradientEnd,
        isActive: isActive ?? true,
        sortOrder: parseInt(sortOrder || "0"),
      },
    });
    return NextResponse.json(banner);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, title, subtitle, ctaText, ctaLink, gradientStart, gradientEnd, isActive, sortOrder } = await req.json();

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title,
        subtitle,
        ctaText,
        ctaLink,
        gradientStart,
        gradientEnd,
        isActive,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
      },
    });
    return NextResponse.json(banner);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
