"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { X, Star, ShoppingCart, Check, Heart, ExternalLink } from "lucide-react";

interface QuickViewModalProps {
  product: any | null;
  onClose: () => void;
  onNavigateDetail: (id: number) => void;
}

export function QuickViewModal({ product, onClose, onNavigateDetail }: QuickViewModalProps) {
  const { addToCart, wishlist, toggleWishlist } = useShopprix();
  const [addedToast, setAddedToast] = useState(false);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [product.images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 p-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Gallery Col */}
        <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900/40 p-6 flex flex-col justify-between items-center relative">
          <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={images[selectedImgIdx] || images[0]}
              alt={product.title}
              className={`w-full h-full object-contain ${!product.inStock ? "opacity-50 grayscale" : ""}`}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 p-1 bg-white ${
                    selectedImgIdx === idx ? "border-amber-500" : "border-slate-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Col */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {product.category}
              </span>
              {product.badge && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                ))}
              </div>
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{product.rating || "4.5"}</span>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {Number(product.originalPrice) > Number(product.price) && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            {addedToast ? (
              <button
                disabled
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5 stroke-[3]" /> Added to Cart!
              </button>
            ) : product.inStock ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 stroke-[2.5]" /> Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 font-bold py-3 rounded-xl text-sm cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
                <span>{isWishlisted ? "Saved in Wishlist" : "Wishlist"}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateDetail(product.id);
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Full Details</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
