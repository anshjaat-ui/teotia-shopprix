"use client";

import React, { useState } from "react";
import { CheckCircle2, Package, Truck, Download, ShoppingBag, ArrowRight, MapPin, Calendar } from "lucide-react";

interface OrderSuccessViewProps {
  orderData: any;
  onNavigate: (view: string) => void;
}

export function OrderSuccessView({ orderData, onNavigate }: OrderSuccessViewProps) {
  const [downloadedInvoice, setDownloadedInvoice] = useState(false);

  const handleDownloadInvoice = () => {
    setDownloadedInvoice(true);
    setTimeout(() => {
      alert(`Invoice for Order #${orderData?.orderNumber || "TS-2026-89412"} downloaded successfully as PDF! 📑`);
    }, 400);
  };

  const orderNum = orderData?.orderNumber || `TS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const estDeliveryDay = days[(new Date().getDay() + 2) % 7];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-10 space-y-8 overflow-hidden relative">
        
        {/* Top Celebration Banner */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30 animate-bounce">
            <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
          </div>
          <div>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Order Placed Successfully! 🎉
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
              Thank You for Shopping with Teotia Shopprix
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              A confirmation email and SMS with live tracking updates have been sent to your registered contact.
            </p>
          </div>
        </div>

        {/* Order Details Bar */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Order Number</span>
            <p className="font-extrabold text-base text-amber-600 dark:text-amber-400">{orderNum}</p>
            <span className="text-slate-500 block">Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Confirmed</span></span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Estimated Delivery</span>
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-500" /> By {estDeliveryDay}, 9:00 PM
            </p>
            <span className="text-slate-500 block">Fulfilled by: <span className="font-semibold text-slate-700 dark:text-slate-300">Shopprix Express</span></span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Payment Total</span>
            <p className="font-black text-lg text-slate-900 dark:text-white">
              ₹{Number(orderData?.totalAmount || 49999).toLocaleString("en-IN")}
            </p>
            <span className="text-slate-500 block">{orderData?.paymentMethod || "UPI / Card"}</span>
          </div>
        </div>

        {/* Shipping Address & Status Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" /> Shipping Destination
            </h4>
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{orderData?.customerName || "Vikram Teotia"}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {orderData?.shippingAddress || "Flat 402, Lotus Towers, Connaught Place, New Delhi, 110001"}
            </p>
            <p className="text-xs font-semibold text-slate-500 pt-1">📞 {orderData?.customerPhone || "+91 98112 34567"}</p>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-500" /> Live Shipment Status
              </h4>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  <span>Order Confirmed & Payment Verified</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Packing in Shopprix Fulfillment Center</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>Out for Delivery with Shopprix Courier</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons Action Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span>{downloadedInvoice ? "Download Invoice Again (PDF)" : "Download Invoice & Tax Receipt (PDF)"}</span>
          </button>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate("orders")}
              className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Track Orders
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="flex-1 sm:flex-initial bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
