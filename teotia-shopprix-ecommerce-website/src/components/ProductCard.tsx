"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { Star, Heart, Check, ShoppingCart, Eye, Truck } from "lucide-react";

interface ProductCardProps {
  product: any;
  onQuickView?: (product: any) => void;
  onNavigateDetail: (id: number) => void;
}

export function ProductCard({ product, onQuickView, onNavigateDetail }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useShopprix();
  const [addedToast, setAddedToast] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const images = Array.isArray(product.images) ? product.images : [product.images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
  const mainImage = images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => onNavigateDetail(product.id)}
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {product.badge && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm tracking-wider uppercase w-max">
              {product.badge}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-red-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow-sm w-max">
              -{product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 shadow-md text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors pointer-events-auto"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
        </button>
      </div>

      {/* Image Box */}
      <div className="w-full aspect-square bg-slate-50 dark:bg-slate-900/40 overflow-hidden relative flex items-center justify-center p-4">
        <img
          src={mainImage}
          alt={product.title}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${!product.inStock ? "opacity-50 grayscale" : ""}`}
        />

        {/* Out of stock banner */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Currently Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Hover Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-lg pointer-events-auto"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        )}
      </div>

      {/* Content Box */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {product.category || "Department"}
          </span>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {product.title}
          </h3>

          {/* Ratings & Review Count */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {product.rating || "4.5"}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              ({(product.reviewCount || 10).toLocaleString()})
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {Number(product.originalPrice) > Number(product.price) && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Prime / Shopprix Express Badge */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-black italic text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
              ✓ <span className="text-amber-500">Shopprix</span> Fast
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              FREE Delivery tomorrow
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          {addedToast ? (
            <button
              disabled
              className="w-full bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="h-4 w-4 stroke-[3]" /> Added to Cart!
            </button>
          ) : product.inStock ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4 stroke-[2.5]" /> Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold py-2 px-3 rounded-lg text-xs cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
