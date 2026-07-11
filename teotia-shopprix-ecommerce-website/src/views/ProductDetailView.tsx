"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { ProductCard } from "@/components/ProductCard";
import { 
  Star, Heart, ShoppingCart, Check, ShieldCheck, Truck, 
  RotateCcw, MapPin, Send, MessageSquarePlus, Sparkles 
} from "lucide-react";

interface ProductDetailViewProps {
  productId: number;
  onNavigate: (view: string, filter?: string) => void;
  onQuickView: (product: any) => void;
}

export function ProductDetailView({ productId, onNavigate, onQuickView }: ProductDetailViewProps) {
  const { products, addToCart, wishlist, toggleWishlist, location } = useShopprix();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [pincodeInput, setPincodeInput] = useState(location.pincode || "110001");
  const [deliveryDate, setDeliveryDate] = useState("FREE Delivery Tomorrow by 9 PM");
  
  // Reviews state
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  const product = products.find((p) => p.id === productId) || products[0];
  const isWishlisted = wishlist.includes(product?.id);

  const images = useMemo<string[]>(() => {
    if (!product) return ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
    return Array.isArray(product.images) ? product.images : [product.images || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"];
  }, [product]);

  const specs = useMemo<{ key: string; value: string }[]>(() => {
    if (!product) return [];
    return Array.isArray(product.specifications) ? product.specifications : [];
  }, [product]);

  // Fetch product reviews on mount
  useEffect(() => {
    if (!product) return;
    fetch(`/api/reviews?productId=${product.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewsList(data.reviews);
        } else {
          // Fallback initial reviews for demo
          setReviewsList([
            { id: 1, authorName: "Sushant Teotia", rating: 5, comment: "Incredible quality and super fast shipping from Shopprix. Will definitely order again!", verifiedPurchase: true, helpfulCount: 14, createdAt: new Date() },
            { id: 2, authorName: "Priya Menon", rating: 5, comment: "Authentic product exactly as described in the specifications table. Highly recommended!", verifiedPurchase: true, helpfulCount: 8, createdAt: new Date() }
          ]);
        }
      })
      .catch(() => {});
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => onNavigate("listing")} className="mt-4 bg-amber-500 text-slate-950 px-6 py-2 rounded-xl font-bold cursor-pointer">
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    onNavigate("checkout");
  };

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length >= 6) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDay = days[(new Date().getDay() + 1) % 7];
      setDeliveryDate(`FREE Delivery ${targetDay} by 8 PM to Pincode ${pincodeInput}`);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: newReviewAuthor || "Shopprix Verified Buyer",
          rating: newReviewRating,
          comment: newReviewComment,
          verifiedPurchase: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviewsList((prev) => [data.review, ...prev]);
        setShowWriteReview(false);
        setNewReviewComment("");
      }
    } catch (err) {
      console.error("Submit review error:", err);
    }
  };

  const relatedProducts = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* 1. TOP PRODUCT SHOWCASE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COL: GALLERY (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[440px] no-scrollbar shrink-0">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-900/50 p-1.5 transition-all cursor-pointer ${
                  selectedImageIdx === idx ? "border-amber-500 ring-2 ring-amber-500/30 scale-95" : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Large Image Box with hover zoom simulation */}
          <div className="flex-1 aspect-square bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center relative overflow-hidden group">
            <img
              src={images[selectedImageIdx] || images[0]}
              alt={product.title}
              className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${!product.inStock ? "opacity-50 grayscale" : ""}`}
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-sm px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                  Currently Out of Stock
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-md text-xs font-semibold text-slate-500 pointer-events-none">
              🔍 Hover to Zoom
            </div>
          </div>
        </div>

        {/* MIDDLE COL: PRODUCT INFO (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Category & Brand */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {product.category}
            </span>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors cursor-pointer"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink-500 text-pink-500" : ""}`} />
              <span>{isWishlisted ? "In Wishlist" : "Save to Wishlist"}</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
            {product.title}
          </h1>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-3 py-2 border-y border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                />
              ))}
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">{product.rating || "4.5"} out of 5</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              ({product.reviewCount || 10} verified ratings)
            </span>
          </div>

          {/* Price Box */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {Number(product.originalPrice) > Number(product.price) && (
                <span className="text-base text-slate-400 line-through font-medium">
                  ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-red-600 text-white font-extrabold text-xs px-2 py-0.5 rounded">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Inclusive of all taxes • Easy EMI starting at ₹{Math.round(Number(product.price) / 12)}/month
            </p>
          </div>

          {/* Description */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Trust badges icon row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 dark:border-slate-700 text-center text-[11px] font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <Truck className="h-5 w-5 text-amber-500" />
              <span>Shopprix Express</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <RotateCcw className="h-5 w-5 text-blue-500" />
              <span>7 Days Return</span>
            </div>
          </div>

        </div>

        {/* RIGHT COL: BUY BOX / SELLER CARD (Col span 3) */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-md sticky top-24">
            
            {/* Price repeat */}
            <div className="text-xl font-black text-slate-900 dark:text-white">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            {/* Availability */}
            <div className="text-sm font-bold">
              {product.inStock ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> In Stock ({product.stockQuantity || 35} units ready)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Currently Out of Stock</span>
              )}
            </div>

            {/* Pincode checker */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-500" /> Check Delivery Estimate
              </span>
              <form onSubmit={checkDelivery} className="flex gap-1.5">
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  placeholder="Enter Pincode"
                  className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  required
                />
                <button type="submit" className="bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded text-xs font-bold text-slate-800 dark:text-white cursor-pointer">
                  Check
                </button>
              </form>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 leading-tight">
                {deliveryDate}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>Qty: {num}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2.5 pt-2">
              {addedToast ? (
                <button
                  disabled
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Check className="h-5 w-5 stroke-[3]" /> Added to Cart!
                </button>
              ) : product.inStock ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="h-5 w-5 stroke-[2.5]" /> Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-5 w-5 fill-slate-950" /> Buy Now
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold py-3 rounded-xl text-sm cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Seller Info */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between"><span>Payment</span><span className="font-semibold text-slate-800 dark:text-slate-200">Secure Transaction (COD/UPI/Card)</span></div>
              <div className="flex justify-between"><span>Sold by</span><span className="font-semibold text-slate-800 dark:text-slate-200">Teotia Retail India Pvt. Ltd.</span></div>
              <div className="flex justify-between"><span>Fulfilled by</span><span className="font-semibold text-amber-600 dark:text-amber-400">Shopprix Express Logistics</span></div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. SPECIFICATIONS TABLE & HIGHLIGHTS */}
      {specs.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
            Technical Specifications & Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {specs.map((item: { key: string; value: string }, idx: number) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm">
                <span className="font-bold text-slate-500 dark:text-slate-400">{item.key}</span>
                <span className="font-semibold text-slate-800 dark:text-white text-right max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FREQUENTLY BOUGHT TOGETHER / RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
            Frequently Bought Together in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onNavigateDetail={(id) => onNavigate("detail", id.toString())}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. RATINGS & CUSTOMER REVIEWS SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Rating Breakdown Col (Col span 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Customer Reviews Summary
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                />
              ))}
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{product.rating || "4.5"} out of 5</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Based on {product.reviewCount || 10} verified purchase reviews
          </p>

          {/* Bar Chart Breakdown */}
          <div className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300 pt-2">
            {[
              { stars: "5 star", pct: 76 },
              { stars: "4 star", pct: 18 },
              { stars: "3 star", pct: 4 },
              { stars: "2 star", pct: 1 },
              { stars: "1 star", pct: 1 },
            ].map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-12">{row.stars}</span>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-10 text-right text-slate-500">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Review this product
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Share your feedback and thoughts with other Teotia Shopprix shoppers
            </p>
            <button
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4 text-amber-500" />
              <span>{showWriteReview ? "Close Review Form" : "Write a Customer Review"}</span>
            </button>
          </div>
        </div>

        {/* Reviews List & Write Review Form (Col span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Write review expandable form */}
          {showWriteReview && (
            <form onSubmit={submitReview} className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4 text-amber-500" /> Write your review for {product.title.split(" ")[0]}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Vikram Chauhan"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent!</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                    <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                    <option value={2}>⭐⭐ 2 Stars - Below Expectations</option>
                    <option value={1}>⭐ 1 Star - Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Review & Comments</label>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="What did you like or dislike about this product? Mention quality, delivery, and experience..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWriteReview(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-2 rounded-lg text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Verified Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-700">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center">
                      {rev.authorName?.charAt(0) || "S"}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">{rev.authorName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="h-3 w-3 stroke-[3]" /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  "{rev.comment}"
                </p>

                {/* Helpful count */}
                <div className="flex items-center justify-between pt-1">
                  <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1 cursor-pointer">
                    👍 Helpful ({rev.helpfulCount || 12} people found this helpful)
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
