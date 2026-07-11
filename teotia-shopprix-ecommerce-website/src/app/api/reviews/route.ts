import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { INITIAL_REVIEWS } from "@/lib/seed-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productIdParam = searchParams.get("productId");

    if (productIdParam) {
      const prodId = parseInt(productIdParam);
      const prodReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, prodId))
        .orderBy(desc(reviews.createdAt));
      return NextResponse.json({ success: true, reviews: prodReviews });
    }

    const allReviews = await db.select().from(reviews).orderBy(desc(reviews.id));
    return NextResponse.json({ success: true, reviews: allReviews });
  } catch (error: any) {
    return NextResponse.json({ success: true, reviews: INITIAL_REVIEWS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, authorName, rating, comment, verifiedPurchase = true } = body;

    const [inserted] = await db
      .insert(reviews)
      .values({
        productId: parseInt(productId),
        authorName: authorName || "Shopprix Verified Buyer",
        rating: parseInt(rating) || 5,
        comment: comment || "Great product!",
        verifiedPurchase: Boolean(verifiedPurchase),
        helpfulCount: Math.floor(Math.random() * 5) + 1,
      })
      .returning();

    return NextResponse.json({ success: true, review: inserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
