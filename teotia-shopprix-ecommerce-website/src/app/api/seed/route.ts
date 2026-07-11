import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products, reviews, orders } from "@/db/schema";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from "@/lib/seed-data";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Check if tables exist / create them via raw query if needed during bootstrap or push
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        icon TEXT NOT NULL DEFAULT 'ShoppingBag',
        description TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        original_price NUMERIC(10, 2) NOT NULL,
        discount_percentage INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        rating NUMERIC(3, 1) NOT NULL DEFAULT '4.5',
        review_count INTEGER NOT NULL DEFAULT 0,
        in_stock BOOLEAN NOT NULL DEFAULT TRUE,
        stock_quantity INTEGER NOT NULL DEFAULT 50,
        badge TEXT,
        images TEXT NOT NULL,
        specifications TEXT NOT NULL DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        discount_amount NUMERIC(10, 2) NOT NULL DEFAULT '0',
        items TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
        helpful_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clear existing data for a clean reset when admin clicks reset/seed
    await db.delete(reviews);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(categories);

    // Insert categories
    for (const cat of INITIAL_CATEGORIES) {
      await db.insert(categories).values(cat);
    }

    // Insert products
    for (const prod of INITIAL_PRODUCTS) {
      await db.insert(products).values({
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        price: prod.price.toString(),
        originalPrice: prod.originalPrice.toString(),
        discountPercentage: prod.discountPercentage,
        category: prod.category,
        categorySlug: prod.categorySlug,
        rating: prod.rating.toString(),
        reviewCount: prod.reviewCount,
        inStock: prod.inStock,
        stockQuantity: prod.stockQuantity,
        badge: prod.badge || null,
        images: JSON.stringify(prod.images),
        specifications: JSON.stringify(prod.specifications),
      });
    }

    // Insert reviews
    for (const rev of INITIAL_REVIEWS) {
      await db.insert(reviews).values(rev);
    }

    // Insert demo initial orders for Admin Dashboard life
    const demoOrders = [
      {
        orderNumber: "TS-2026-89412",
        customerName: "Sushant Rajput",
        customerEmail: "sushant@example.com",
        customerPhone: "+91 98765 43210",
        shippingAddress: "Flat 402, Lotus Towers, Connaught Place, New Delhi, 110001",
        paymentMethod: "UPI (Google Pay)",
        totalAmount: "49999",
        discountAmount: "25000",
        items: JSON.stringify([
          { id: 1, title: "Teotia Pro X1 Ultra 5G Smartphone", price: 49999, quantity: 1, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80" }
        ]),
        status: "Delivered",
      },
      {
        orderNumber: "TS-2026-89413",
        customerName: "Priya Menon",
        customerEmail: "priya.m@gmail.com",
        customerPhone: "+91 91234 56789",
        shippingAddress: "Villa 12, Palm Meadows, Whitefield, Bangalore, 560066",
        paymentMethod: "Credit Card (HDFC)",
        totalAmount: "28489",
        discountAmount: "3000",
        items: JSON.stringify([
          { id: 2, title: "Sony WH-1000XM5 Headphones", price: 24990, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
          { id: 5, title: "Shopprix Couture Premium Trench Coat", price: 3499, quantity: 1, image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80" }
        ]),
        status: "Shipped",
      },
      {
        orderNumber: "TS-2026-89414",
        customerName: "Rakesh Teotia",
        customerEmail: "rakesh.t@teotiagroup.in",
        customerPhone: "+91 99887 76655",
        shippingAddress: "B-21, Sector 62, Noida, Uttar Pradesh, 201309",
        paymentMethod: "Cash on Delivery (COD)",
        totalAmount: "1847",
        discountAmount: "500",
        items: JSON.stringify([
          { id: 8, title: "Teotia Naturals Almonds 1 Kg", price: 849, quantity: 1, image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80" },
          { id: 14, title: "Atomic Habits Hardcover", price: 499, quantity: 2, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" }
        ]),
        status: "Processing",
      }
    ];

    for (const ord of demoOrders) {
      await db.insert(orders).values(ord);
    }

    return NextResponse.json({ success: true, message: "Teotia Shopprix Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
