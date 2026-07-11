"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShieldCheck, Tag, Check } from "lucide-react";

interface CartViewProps {
  onNavigate: (view: string, id?: string) => void;
  onApplyCoupon: (code: string, discount: number) => void;
  appliedCouponDiscount: number;
  appliedCouponCode: string;
}

export function CartView({ onNavigate, onApplyCoupon, appliedCouponDiscount, appliedCouponCode }: CartViewProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useShopprix();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal + shippingCost - appliedCouponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === "TEOTIA500") {
      if (subtotal < 1000) {
        setCouponFeedback({ type: "error", msg: "Minimum order value ₹1,000 required for TEOTIA500 coupon." });
        return;
      }
      onApplyCoupon("TEOTIA500", 500);
      setCouponFeedback({ type: "success", msg: "₹500 Flat Discount applied to your cart!" });
      setCouponInput("");
    } else if (code === "PRIME20") {
      const discount = Math.round(subtotal * 0.2);
      onApplyCoupon("PRIME20", discount);
      setCouponFeedback({ type: "success", msg: `20% Discount (₹${discount}) applied successfully!` });
      setCouponInput("");
    } else if (code === "WELCOME10") {
      onApplyCoupon("WELCOME10", 100);
      setCouponFeedback({ type: "success", msg: "₹100 Welcome Discount applied!" });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", msg: "Invalid or expired coupon code. Try 'TEOTIA500' or 'PRIME20'." });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-md">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="h-10 w-10 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Teotia Shopprix Cart is Empty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Looks like you haven't added anything to your cart yet. Discover deals and top brand electronics today!
            </p>
          </div>
          <button
            onClick={() => onNavigate("home")}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Start Shopping Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center justify-between">
        <span>Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear Cart
        </button>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COL: CART ITEMS LIST (Col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              {amountNeededForFreeShipping > 0 ? (
                <span className="text-slate-800 dark:text-slate-200">
                  Add <span className="text-amber-600 dark:text-amber-400">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</span> more to your cart to qualify for <span className="text-emerald-600 dark:text-emerald-400 font-black">FREE Shopprix Express Delivery</span>!
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4 stroke-[3]" /> Your order qualifies for FREE Express Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Card List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/80 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Image & Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={() => onNavigate("detail", item.id.toString())}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl border border-slate-200 dark:border-slate-700 p-2 shrink-0 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {item.category}
                    </span>
                    <h3
                      onClick={() => onNavigate("detail", item.id.toString())}
                      className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {item.title}
                    </h3>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      In Stock • Eligible for FREE Shipping
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Unit Price: <span className="font-semibold text-slate-800 dark:text-slate-200">₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total Item Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-700">
                  
                  {/* +/- controller */}
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                    <span className="px-3 text-xs font-black text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[3]" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white block">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 justify-end ml-auto mt-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COL: PRICE SUMMARY & PROCEED TO BUY (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Code Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-500" /> Apply Coupon / Gift Voucher
            </h3>

            {appliedCouponDiscount > 0 ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 block">Coupon applied: {appliedCouponCode}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Saved ₹{appliedCouponDiscount.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => onApplyCoupon("", 0)}
                  className="text-red-600 font-bold hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try TEOTIA500 or PRIME20"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponFeedback && (
              <p className={`text-xs font-semibold ${couponFeedback.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {couponFeedback.msg}
              </p>
            )}

            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">TEOTIA500 (₹500 off ₹1k+)</span>
              <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">PRIME20 (20% off)</span>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
              Order Price Summary
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping & Express Handling:</span>
                {shippingCost === 0 ? (
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white">₹{shippingCost}</span>
                )}
              </div>

              {appliedCouponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Coupon Discount ({appliedCouponCode}):</span>
                  <span>- ₹{appliedCouponDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">Grand Total:</span>
              <span className="font-black text-2xl text-slate-900 dark:text-white">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => onNavigate("checkout")}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black py-3.5 rounded-xl text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Proceed to Buy ({totalItems} items)</span>
              <ArrowRight className="h-5 w-5 stroke-[3]" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Safe and encrypted payment verification</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
