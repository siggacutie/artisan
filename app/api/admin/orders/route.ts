import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = 20;

  try {
    const where: any = {};
    if (status) where.orderStatus = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { mlbbUsername: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true },
          },
          game: {
            select: { name: true },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      pages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

import { validateOrigin } from '@/lib/validateOrigin'

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId, action } = await req.json();

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    switch (action) {
      case "complete":
        await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: "COMPLETED", completedAt: new Date() },
        });
        break;
      case "fail":
        await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: "FAILED" },
        });
        break;
      case "refund":
        if (order.orderStatus === "REFUNDED") {
          return NextResponse.json({ error: "Order already refunded" }, { status: 400 });
        }
        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: "REFUNDED" },
          }),
          prisma.user.update({
            where: { id: order.userId },
            data: { walletBalance: { increment: order.totalPrice } },
          }),
          prisma.walletTransaction.create({
            data: {
              userId: order.userId,
              type: "CREDIT",
              amount: order.totalPrice,
              method: "ORDER_REFUND",
              status: "COMPLETED",
              referenceId: orderId,
              description: `Refund for order #${orderId}`,
            },
          }),
        ]);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order admin action error:", err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
