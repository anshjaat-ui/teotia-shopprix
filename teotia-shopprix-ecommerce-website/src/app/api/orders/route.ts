import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.id));
    const formatted = allOrders.map((o) => {
      let parsedItems: any[] = [];
      try {
        parsedItems = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
      } catch {
        parsedItems = [];
      }
      return {
        ...o,
        totalAmount: parseFloat(o.totalAmount || "0"),
        discountAmount: parseFloat(o.discountAmount || "0"),
        items: parsedItems,
      };
    });
    return NextResponse.json({ success: true, orders: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: true, orders: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      totalAmount,
      discountAmount = 0,
      items,
    } = body;

    const orderNumber = `TS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const [inserted] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: customerName || "Amazon Customer",
        customerEmail: customerEmail || "customer@example.com",
        customerPhone: customerPhone || "+91 9876543210",
        shippingAddress: shippingAddress || "New Delhi, India",
        paymentMethod: paymentMethod || "COD",
        totalAmount: totalAmount.toString(),
        discountAmount: discountAmount.toString(),
        items: JSON.stringify(items || []),
        status: "Confirmed",
      })
      .returning();

    return NextResponse.json({ success: true, order: inserted });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
