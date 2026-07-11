import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { INITIAL_CATEGORIES } from "@/lib/seed-data";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json({ success: true, categories: allCategories });
  } catch (error: any) {
    return NextResponse.json({ success: true, categories: INITIAL_CATEGORIES });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon = "ShoppingBag", description = "" } = body;
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const [inserted] = await db
      .insert(categories)
      .values({
        name,
        slug: generatedSlug,
        icon,
        description,
      })
      .returning();

    return NextResponse.json({ success: true, category: inserted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
