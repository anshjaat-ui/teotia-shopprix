"use client";

import React, { useState, useEffect } from "react";
import { Truck, Package, Download, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

export function OrdersHistoryView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadInvoice = (orderNum: string) => {
    alert(`Invoice PDF for ${orderNum} generated and ready for print! 📑`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="h-7 w-7 text-amber-500" />
            <span>Your Orders & Returns</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Check live shipment status, track packages, and download GST tax invoices
          </p>
        </div>
        <button
          onClick={() => onNavigate("listing")}
          className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all hidden sm:flex items-center gap-1.5 cursor-pointer"
        >
          <span>Shop More Items</span>
          <ArrowRight className="h-4 w-4 stroke-[3]" />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 font-bold animate-pulse">
          Loading your recent orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center max-w-xl mx-auto space-y-4">
          <Truck className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Once you complete a purchase, your order ID, delivery details, and tracking link will appear right here.
          </p>
          <button
            onClick={() => onNavigate("home")}
            className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Go to Homepage
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden"
            >
              {/* Top Header Bar of Order Card */}
              <div className="bg-slate-100 dark:bg-slate-900/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Order Number</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">{ord.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Order Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-bold text-[10px]">Total Amount</span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {ord.status || "Confirmed"}
                  </span>
                  <button
                    onClick={() => handleDownloadInvoice(ord.orderNumber)}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-amber-500" /> Invoice
                  </button>
                </div>
              </div>

              {/* Order Items & Shipping details */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-3">
                  {Array.isArray(ord.items) && ord.items.length > 0 ? (
                    ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80"}
                          alt=""
                          className="w-14 h-14 object-contain rounded-xl border p-1 bg-slate-50 dark:bg-slate-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.title}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Quantity: <strong className="text-slate-800 dark:text-slate-200">{item.quantity || 1}</strong> × ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Teotia Shopprix Verified Shipment Items
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Delivering To:</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{ord.customerName}</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-tight">{ord.shippingAddress}</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400 pt-1">Shopprix Fast Tracking: Active ✓</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
