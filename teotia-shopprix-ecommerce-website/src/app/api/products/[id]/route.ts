import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const [prod] = await db.select().from(products).where(eq(products.id, prodId));
    if (!prod) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    let parsedImages: string[] = [];
    let parsedSpecs: { key: string; value: string }[] = [];
    try {
      parsedImages = typeof prod.images === "string" ? JSON.parse(prod.images) : prod.images;
    } catch {
      parsedImages = [prod.images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
    }
    try {
      parsedSpecs = typeof prod.specifications === "string" ? JSON.parse(prod.specifications) : prod.specifications;
    } catch {
      parsedSpecs = [];
    }

    return NextResponse.json({
      success: true,
      product: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        price: parseFloat(prod.price || "0"),
        originalPrice: parseFloat(prod.originalPrice || "0"),
        discountPercentage: prod.discountPercentage || 0,
        category: prod.category,
        categorySlug: prod.categorySlug,
        rating: parseFloat(prod.rating || "4.5"),
        reviewCount: prod.reviewCount || 0,
        inStock: prod.inStock,
        stockQuantity: prod.stockQuantity || 0,
        badge: prod.badge || null,
        images: parsedImages,
        specifications: parsedSpecs,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: any = { updatedAt: new Date() };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.price !== undefined) updateData.price = body.price.toString();
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice.toString();
    if (body.discountPercentage !== undefined) updateData.discountPercentage = body.discountPercentage;
    if (body.inStock !== undefined) updateData.inStock = body.inStock;
    if (body.stockQuantity !== undefined) updateData.stockQuantity = body.stockQuantity;
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.categorySlug !== undefined) updateData.categorySlug = body.categorySlug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
    if (body.specifications !== undefined) updateData.specifications = JSON.stringify(body.specifications);

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, prodId))
      .returning();

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, prodId));
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
