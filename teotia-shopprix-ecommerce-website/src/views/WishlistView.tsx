"use client";

import React from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { ProductCard } from "@/components/ProductCard";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

interface WishlistViewProps {
  onNavigateDetail: (id: number) => void;
  onQuickView: (product: any) => void;
  onNavigate: (view: string) => void;
}

export function WishlistView({ onNavigateDetail, onQuickView, onNavigate }: WishlistViewProps) {
  const { products, wishlist, addToCart, toggleWishlist } = useShopprix();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      if (p.inStock) addToCart(p, 1);
    });
    onNavigate("cart");
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-pink-100 dark:bg-pink-950/40 text-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Wishlist is Empty</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
            Click the heart icon on any product card while browsing to save your favorite deals and gift ideas for later.
          </p>
        </div>
        <button
          onClick={() => onNavigate("listing")}
          className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore Products</span>
          <ArrowRight className="h-4 w-4 stroke-[3]" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500">
            <Heart className="h-6 w-6 fill-pink-500" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Your Saved Wishlist ({wishlistedProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Personal gift list and saved items ready for fast checkout
            </p>
          </div>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
          <span>Add All Available to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onQuickView={onQuickView}
            onNavigateDetail={onNavigateDetail}
          />
        ))}
      </div>
    </div>
  );
}
