"use client";

import React from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { 
  X, UserCircle, ChevronRight, Smartphone, Shirt, ShoppingBasket, 
  Home, BookOpen, Sparkles, Shield, Truck, Gift, HelpCircle, 
  LayoutDashboard, LogOut, Moon, Sun, ShoppingBag
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, filter?: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Smartphone,
  Shirt,
  ShoppingBasket,
  Home,
  BookOpen,
  Sparkles,
  ShoppingBag
};

export function MegaMenu({ isOpen, onClose, onNavigate }: MegaMenuProps) {
  const { categories, user, darkMode, toggleDarkMode, logoutUser, setSelectedCategory } = useShopprix();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-slideRight overflow-y-auto">
        {/* Header - Hello User */}
        <div 
          className="bg-[#232f3e] dark:bg-[#131921] text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-md cursor-pointer"
          onClick={() => {
            onNavigate(user ? "admin" : "login");
            onClose();
          }}
        >
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-amber-400" />
            <div>
              <span className="text-xs font-semibold text-slate-300 block">Welcome to Teotia Shopprix</span>
              <span className="text-base font-bold tracking-tight">
                Hello, {user ? user.name.split(" ")[0] : "Sign in"}
              </span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 py-3 divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-sm">
          
          {/* Trending & Quick Links */}
          <div className="py-2 px-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-2 tracking-wide">
              Trending Now
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium transition-colors cursor-pointer"
                >
                  <span>🔥 Best Sellers</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium transition-colors cursor-pointer"
                >
                  <span>⚡ Today's Deals & Offers</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium transition-colors cursor-pointer"
                >
                  <span>🚀 New Arrivals in Catalog</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Shop By Category */}
          <div className="py-3 px-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-2 tracking-wide">
              Shop By Category
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium text-amber-600 dark:text-amber-400 cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-bold">
                    <ShoppingBag className="h-4 w-4" /> All Products ({categories.length} Departments)
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
              {categories.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.icon] || ShoppingBag;
                return (
                  <li key={cat.id || cat.slug}>
                    <button
                      onClick={() => { setSelectedCategory(cat.slug); onNavigate("listing", cat.slug); onClose(); }}
                      className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 font-medium">
                        <IconComponent className="h-4 w-4 text-amber-500" />
                        {cat.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Programs & Features */}
          <div className="py-3 px-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-2 tracking-wide">
              Programs & Features
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { onNavigate("cart"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Truck className="h-4 w-4 text-emerald-500" /> Shopprix Express Free Shipping
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate("wishlist"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Gift className="h-4 w-4 text-pink-500" /> Your Wishlist & Gift Ideas
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate("admin"); onClose(); }}
                  className="w-full text-left py-2 px-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center justify-between font-bold text-amber-600 dark:text-amber-400"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-amber-500" /> Admin Control Panel ⚡
                  </span>
                  <span className="text-xs bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">Demo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Settings */}
          <div className="py-3 px-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white pb-2 tracking-wide">
              Help & Settings
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { toggleDarkMode(); }}
                  className="w-full text-left py-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                    {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </span>
                  <span className="text-xs text-slate-400">{darkMode ? "Dark" : "Light"}</span>
                </button>
              </li>
              {user ? (
                <li>
                  <button
                    onClick={() => { logoutUser(); onClose(); }}
                    className="w-full text-left py-2 px-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2.5 font-medium text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out of {user.name}
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => { onNavigate("login"); onClose(); }}
                    className="w-full text-left py-2 px-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-2.5 font-bold text-amber-600"
                  >
                    <UserCircle className="h-4 w-4" /> Sign In / Register
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          Teotia Shopprix for all v2.4 • Amazon UI Edition
        </div>
      </div>
    </div>
  );
}
