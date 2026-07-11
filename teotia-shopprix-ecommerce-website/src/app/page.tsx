"use client";

import React, { useState } from "react";
import { ShopprixProvider, useShopprix } from "@/context/ShopprixContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MegaMenu } from "@/components/MegaMenu";
import { LocationModal } from "@/components/LocationModal";
import { QuickViewModal } from "@/components/QuickViewModal";

// Views
import { HomeView } from "@/views/HomeView";
import { ProductListingView } from "@/views/ProductListingView";
import { ProductDetailView } from "@/views/ProductDetailView";
import { CartView } from "@/views/CartView";
import { CheckoutView } from "@/views/CheckoutView";
import { LoginView } from "@/views/LoginView";
import { OrderSuccessView } from "@/views/OrderSuccessView";
import { AdminView } from "@/views/AdminView";
import { WishlistView } from "@/views/WishlistView";
import { OrdersHistoryView } from "@/views/OrdersHistoryView";

function MainAppContent() {
  const { setSelectedCategory } = useShopprix();
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);

  // Coupon state
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);

  // Order data state
  const [lastOrderData, setLastOrderData] = useState<any | null>(null);

  const handleNavigate = (view: string, filterOrId?: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "detail" && filterOrId) {
      setSelectedProductId(Number(filterOrId));
    } else if (view === "listing") {
      const targetCat = filterOrId || "all";
      setCategoryFilter(targetCat);
      setSelectedCategory(targetCat);
    }
    setCurrentView(view);
  };

  const handleApplyCoupon = (code: string, discount: number) => {
    setAppliedCouponCode(code);
    setAppliedCouponDiscount(discount);
  };

  const handleOrderSuccess = (orderData: any) => {
    setLastOrderData(orderData);
    handleNavigate("order-success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* Header */}
      <Header
        onNavigate={handleNavigate}
        currentView={currentView}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === "home" && (
          <HomeView
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        )}

        {currentView === "listing" && (
          <ProductListingView
            initialCategoryFilter={categoryFilter}
            onNavigateDetail={(id) => handleNavigate("detail", id.toString())}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        )}

        {currentView === "detail" && (
          <ProductDetailView
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        )}

        {currentView === "cart" && (
          <CartView
            onNavigate={handleNavigate}
            onApplyCoupon={handleApplyCoupon}
            appliedCouponCode={appliedCouponCode}
            appliedCouponDiscount={appliedCouponDiscount}
          />
        )}

        {currentView === "checkout" && (
          <CheckoutView
            onOrderSuccess={handleOrderSuccess}
            appliedCouponDiscount={appliedCouponDiscount}
          />
        )}

        {currentView === "login" && (
          <LoginView onNavigate={handleNavigate} />
        )}

        {currentView === "order-success" && (
          <OrderSuccessView
            orderData={lastOrderData}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "admin" && (
          <AdminView onNavigate={handleNavigate} />
        )}

        {currentView === "wishlist" && (
          <WishlistView
            onNavigateDetail={(id) => handleNavigate("detail", id.toString())}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "orders" && (
          <OrdersHistoryView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Modals & Floating Tools */}
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onNavigate={handleNavigate}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigateDetail={(id) => {
          setQuickViewProduct(null);
          handleNavigate("detail", id.toString());
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function HomePage() {
  return (
    <ShopprixProvider>
      <MainAppContent />
    </ShopprixProvider>
  );
}
