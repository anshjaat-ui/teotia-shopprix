import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";

export async function GET(request: NextRequest) {
  try {
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    
    // Format the response so images and specifications are parsed
    const formatted = allProducts.map((p) => {
      let parsedImages: string[] = [];
      let parsedSpecs: { key: string; value: string }[] = [];
      try {
        parsedImages = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
      } catch {
        parsedImages = [p.images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
      }
      try {
        parsedSpecs = typeof p.specifications === "string" ? JSON.parse(p.specifications) : p.specifications;
      } catch {
        parsedSpecs = [];
      }

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: parseFloat(p.price || "0"),
        originalPrice: parseFloat(p.originalPrice || "0"),
        discountPercentage: p.discountPercentage || 0,
        category: p.category,
        categorySlug: p.categorySlug,
        rating: parseFloat(p.rating || "4.5"),
        reviewCount: p.reviewCount || 0,
        inStock: p.inStock,
        stockQuantity: p.stockQuantity || 0,
        badge: p.badge || null,
        images: parsedImages,
        specifications: parsedSpecs,
        createdAt: p.createdAt,
      };
    });

    return NextResponse.json({ success: true, products: formatted });
  } catch (error: any) {
    console.error("Fetch products error:", error);
    // If DB is not seeded or table missing yet, return initial fallback
    return NextResponse.json({
      success: true,
      products: INITIAL_PRODUCTS.map((p, idx) => ({ ...p, id: idx + 1 }))
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      price,
      originalPrice,
      discountPercentage,
      category,
      categorySlug,
      rating = 4.5,
      reviewCount = 1,
      inStock = true,
      stockQuantity = 50,
      badge = "New Arrival",
      images = [],
      specifications = [],
    } = body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();

    const [inserted] = await db
      .insert(products)
      .values({
        title,
        slug: generatedSlug,
        description: description || "No description provided",
        price: price ? price.toString() : "999",
        originalPrice: originalPrice ? originalPrice.toString() : (price * 1.3).toString(),
        discountPercentage: discountPercentage || Math.round(((originalPrice - price) / originalPrice) * 100) || 10,
        category: category || "Electronics & Gadgets",
        categorySlug: categorySlug || "electronics",
        rating: rating.toString(),
        reviewCount: reviewCount || 1,
        inStock: typeof inStock === "boolean" ? inStock : true,
        stockQuantity: stockQuantity || 50,
        badge: badge || null,
        images: JSON.stringify(Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"]),
        specifications: JSON.stringify(Array.isArray(specifications) ? specifications : []),
      })
      .returning();

    return NextResponse.json({ success: true, product: inserted });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
