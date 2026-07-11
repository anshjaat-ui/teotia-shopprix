"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { 
  MapPin, CreditCard, ShieldCheck, Check, Lock, 
  Smartphone, Truck, Building, ArrowRight, AlertCircle 
} from "lucide-react";

interface CheckoutViewProps {
  onOrderSuccess: (orderData: any) => void;
  appliedCouponDiscount: number;
}

const SAVED_ADDRESSES = [
  {
    id: "home",
    title: "Home Address (Default)",
    name: "Vikram Teotia",
    phone: "+91 98112 34567",
    street: "Flat 402, Lotus Towers, Connaught Place",
    city: "New Delhi",
    pincode: "110001",
  },
  {
    id: "office",
    title: "Office Address",
    name: "Vikram Teotia (Corporate)",
    phone: "+91 98112 34567",
    street: "Level 14, Teotia Shopprix Corporate Tower, Cyber City",
    city: "Gurugram",
    pincode: "122002",
  }
];

export function CheckoutView({ onOrderSuccess, appliedCouponDiscount }: CheckoutViewProps) {
  const { cart, user, location, clearCart } = useShopprix();

  const [selectedAddressId, setSelectedAddressId] = useState("home");
  const [customName, setCustomName] = useState(user?.name || "Vikram Teotia");
  const [customEmail, setCustomEmail] = useState(user?.email || "vikram@teotia.com");
  const [customPhone, setCustomPhone] = useState(user?.phone || "+91 98112 34567");
  const [customStreet, setCustomStreet] = useState("Flat 402, Lotus Towers, Connaught Place");
  const [customCity, setCustomCity] = useState(location.city || "New Delhi");
  const [customPincode, setCustomPincode] = useState(location.pincode || "110001");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI" | "CARD" | "NETBANKING">("UPI");
  const [upiId, setUpiId] = useState("vikram@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8912");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("491");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal + shippingCost - appliedCouponDiscount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullAddress = selectedAddressId === "home" 
      ? "Flat 402, Lotus Towers, Connaught Place, New Delhi, 110001"
      : selectedAddressId === "office"
      ? "Level 14, Teotia Shopprix Corporate Tower, Cyber City, Gurugram, 122002"
      : `${customStreet}, ${customCity}, ${customPincode}`;

    const orderPayload = {
      customerName: customName,
      customerEmail: customEmail,
      customerPhone: customPhone,
      shippingAddress: fullAddress,
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery (COD)" : paymentMethod === "UPI" ? `UPI (${upiId})` : "Credit/Debit Card (Visa/MC)",
      totalAmount: grandTotal,
      discountAmount: appliedCouponDiscount,
      items: cart,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        onOrderSuccess(data.order);
      } else {
        const simulatedOrder = {
          ...orderPayload,
          orderNumber: `TS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          status: "Confirmed",
          createdAt: new Date(),
        };
        clearCart();
        onOrderSuccess(simulatedOrder);
      }
    } catch (err) {
      console.error("Order error:", err);
      const simulatedOrder = {
        ...orderPayload,
        orderNumber: `TS-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        status: "Confirmed",
        createdAt: new Date(),
      };
      clearCart();
      onOrderSuccess(simulatedOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 pb-4 mb-8 border-b border-slate-200 dark:border-slate-700">
        <Lock className="h-6 w-6 text-amber-500" />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Secure Checkout • Teotia Shopprix
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COL: ADDRESS & PAYMENT STEPS (Col span 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">1</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-500" /> Select Delivery Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAVED_ADDRESSES.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-amber-600 dark:text-amber-400 uppercase">{addr.title}</span>
                      {isSelected && <Check className="h-4 w-4 text-amber-600 dark:text-amber-400 stroke-[3]" />}
                    </div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{addr.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{addr.street}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{addr.city} - {addr.pincode}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-2">📞 {addr.phone}</p>
                  </div>
                );
              })}

              {/* Add New Address Option */}
              <div
                onClick={() => setSelectedAddressId("new")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center ${
                  selectedAddressId === "new"
                    ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm"
                    : "border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400"
                }`}
              >
                <span className="font-bold text-sm text-amber-600 dark:text-amber-400">+ Add / Edit Custom Address</span>
                <span className="text-xs text-slate-400 mt-1">Ship to another location</span>
              </div>
            </div>

            {/* Custom Address Input Form */}
            {selectedAddressId === "new" && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">House No., Building, Street</label>
                  <input
                    type="text"
                    value={customStreet}
                    onChange={(e) => setCustomStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City / District</label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={customPincode}
                    onChange={(e) => setCustomPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">2</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-500" /> Choose Payment Option
              </h2>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "UPI", title: "UPI / QR Code", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
                { id: "CARD", title: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
                { id: "COD", title: "Cash on Delivery", icon: Truck, desc: "Pay at doorstep" },
                { id: "NETBANKING", title: "Net Banking", icon: Building, desc: "All Indian Banks" },
              ].map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const IconComp = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <IconComp className={`h-6 w-6 mb-1.5 ${isSelected ? "text-amber-500" : "text-slate-400"}`} />
                    <span className="font-bold text-xs block">{pm.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{pm.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Details Container */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              
              {paymentMethod === "UPI" && (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Enter UPI ID / Virtual Payment Address (VPA)
                  </span>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. username@okhdfcbank"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => alert("Simulated UPI ID verified successfully! ✅")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                    >
                      Verify ID
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    A payment request will be sent to your UPI app on order confirmation.
                  </p>
                </div>
              )}

              {paymentMethod === "CARD" && (
                <div className="space-y-3 max-w-md animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Enter Credit or Debit Card Details (UI Simulation)
                  </span>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="***"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "COD" && (
                <div className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Pay Cash or UPI on Delivery</span>
                    <span>You can pay our delivery executive using Cash, UPI QR code, or Card machine upon receiving the parcel at your doorstep. No extra charges apply.</span>
                  </div>
                </div>
              )}

              {paymentMethod === "NETBANKING" && (
                <div className="space-y-2 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Select Your Bank
                  </span>
                  <select className="w-full max-w-md px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold cursor-pointer">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* RIGHT COL: FINAL ORDER REVIEW SUMMARY (Col span 4) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5 sticky top-24">
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black py-3.5 rounded-xl text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Your Order & Pay</span>
                  <ArrowRight className="h-5 w-5 stroke-[3]" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              By clicking "Place Your Order", you agree to Teotia Shopprix's Conditions of Use & 100% Purchase Guarantee.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)</h3>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  {shippingCost === 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                  ) : (
                    <span>₹{shippingCost}</span>
                  )}
                </div>
                {appliedCouponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon Savings:</span>
                    <span>- ₹{appliedCouponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="font-black text-base text-slate-900 dark:text-white">Order Total:</span>
                <span className="font-black text-2xl text-amber-600 dark:text-amber-400">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Quick mini items preview */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 max-h-48 overflow-y-auto space-y-2 pr-1">
              {cart.map((i) => (
                <div key={i.id} className="flex items-center gap-2.5 text-xs">
                  <img src={i.image} alt="" className="w-10 h-10 object-contain rounded border p-1 bg-slate-50" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-slate-800 dark:text-slate-200">{i.title}</p>
                    <span className="text-slate-500 text-[10px]">Qty: {i.quantity} × ₹{i.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 p-3 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>100% Secure SSL 256-bit Encrypted Transaction</span>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
