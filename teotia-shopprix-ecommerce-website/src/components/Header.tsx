"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { 
  Search, MapPin, ShoppingCart, Menu, UserCircle, Heart, 
  ChevronDown, Sparkles, LayoutDashboard, Truck, Shield, ShieldCheck, Sun, Moon
} from "lucide-react";

interface HeaderProps {
  onNavigate: (view: string, filter?: string) => void;
  currentView: string;
  onOpenLocationModal: () => void;
  onOpenMegaMenu: () => void;
}

export function Header({ onNavigate, currentView, onOpenLocationModal, onOpenMegaMenu }: HeaderProps) {
  const { 
    cart, wishlist, user, location, searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory, categories, products, darkMode, toggleDarkMode 
  } = useShopprix();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter search suggestions based on what the user typed
  const searchSuggestions = searchQuery.trim().length > 0
    ? products
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate("listing", selectedCategory);
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      {/* Top Header Bar (#131921 Amazon Dark Navy) */}
      <div className="bg-[#131921] text-white px-3 sm:px-6 py-2 flex items-center justify-between gap-2 md:gap-4 border-b border-slate-800">
        
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Logo */}
          <div 
            onClick={() => onNavigate("home")}
            className="cursor-pointer flex flex-col group py-1 border border-transparent hover:border-white px-1.5 rounded transition-all"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-white">
                Teotia <span className="text-[#febd69]">Shopprix</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                for all
              </span>
            </div>
            {/* Smile Arrow simulation */}
            <div className="h-0.5 bg-gradient-to-r from-[#febd69] via-[#ff9900] to-transparent w-full mt-0.5 rounded-full" />
          </div>

          {/* Location Pincode Selector */}
          <button
            onClick={onOpenLocationModal}
            className="hidden md:flex items-center gap-1.5 border border-transparent hover:border-white p-1.5 rounded transition-all cursor-pointer text-left"
          >
            <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-2" />
            <div>
              <span className="text-[11px] text-slate-300 font-medium block leading-none">
                Delivering to {location.city}
              </span>
              <span className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-1">
                {location.pincode} • Update location <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </span>
            </div>
          </button>
        </div>

        {/* Center: Amazon Search Bar with category dropdown & auto-suggestions */}
        <div className="flex-1 max-w-3xl relative mx-1 sm:mx-2">
          <form onSubmit={handleSearchSubmit} className="flex h-10 sm:h-11 rounded-md overflow-hidden ring-2 ring-transparent focus-within:ring-[#febd69] bg-white text-slate-900 shadow-inner">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="hidden lg:block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 border-r border-slate-300 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Departments</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name.split(" ")[0]}</option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search Teotia Shopprix for iPhones, Trench coats, Organic Almonds..."
              className="flex-1 px-3 sm:px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-white w-full"
            />

            {/* Search Button (#febd69 Orange) */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] px-4 sm:px-5 flex items-center justify-center text-slate-900 transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Live Search Auto-Suggestions Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-700 animate-fadeIn">
              {searchSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.title);
                    setIsSearchFocused(false);
                    onNavigate("detail", item.id.toString());
                  }}
                  className="p-2.5 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img src={Array.isArray(item.images) ? item.images[0] : item.images} alt="" className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-amber-600 dark:text-amber-400">₹{item.price.toLocaleString("en-IN")}</span>
                      <span>• {item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isSearchFocused && (
            <div className="fixed inset-0 z-30" onClick={() => setIsSearchFocused(false)} />
          )}
        </div>

        {/* Right: User Menu, Admin Panel, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Standalone HTML link button */}
          <a
            href="/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
            title="View Standalone HTML Version"
          >
            <span>HTML UI 📄</span>
          </a>

          {/* Admin Badge/Link quick button */}
          <button
            onClick={() => onNavigate("admin")}
            className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
            title="Admin Panel"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Admin ⚡</span>
          </button>

          {/* Account & Lists dropdown trigger */}
          <div 
            className="relative border border-transparent hover:border-white p-1 sm:p-1.5 rounded transition-all cursor-pointer"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
            onClick={() => onNavigate(user ? "admin" : "login")}
          >
            <span className="text-[11px] text-slate-300 block leading-none">
              Hello, {user ? user.name.split(" ")[0] : "sign in"}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-0.5 leading-tight">
              Account & Lists <ChevronDown className="h-3 w-3 text-slate-400" />
            </span>

            {/* Hover Account Dropdown */}
            {showAccountMenu && (
              <div className="absolute top-full right-0 mt-1 w-60 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 text-slate-800 dark:text-slate-200 z-50 animate-fadeIn">
                <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
                  {user ? (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user.email}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate("admin"); }}
                        className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded text-xs transition-colors"
                      >
                        Visit Admin Dashboard
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onNavigate("login"); }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 rounded text-sm transition-colors shadow-sm"
                      >
                        Sign in
                      </button>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        New customer? <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Start here.</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="pt-3 space-y-1.5 text-xs font-semibold">
                  <div onClick={(e) => { e.stopPropagation(); onNavigate("wishlist"); }} className="hover:text-amber-500 cursor-pointer flex items-center gap-2 py-1">
                    <Heart className="h-3.5 w-3.5 text-pink-500" /> Your Wishlist ({wishlist.length})
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); onNavigate("orders"); }} className="hover:text-amber-500 cursor-pointer flex items-center gap-2 py-1">
                    <Truck className="h-3.5 w-3.5 text-emerald-500" /> Your Orders
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); onNavigate("admin"); }} className="hover:text-amber-500 cursor-pointer flex items-center gap-2 py-1">
                    <LayoutDashboard className="h-3.5 w-3.5 text-amber-500" /> Manage Products (Admin)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <button
            onClick={() => onNavigate("orders")}
            className="hidden sm:block border border-transparent hover:border-white p-1.5 rounded transition-all cursor-pointer text-left"
          >
            <span className="text-[11px] text-slate-300 block leading-none">Returns</span>
            <span className="text-xs sm:text-sm font-bold text-white leading-tight">& Orders</span>
          </button>

          {/* Cart Badge */}
          <button
            onClick={() => onNavigate("cart")}
            className="flex items-end gap-1 border border-transparent hover:border-white p-1 sm:p-1.5 rounded transition-all cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-white stroke-[2]" />
              <span className="absolute -top-1.5 left-3.5 sm:left-4 bg-[#f08804] text-slate-950 font-extrabold text-xs px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-sm">
                {cartItemsCount}
              </span>
            </div>
            <span className="font-bold text-xs sm:text-sm text-white hidden md:inline pb-1">Cart</span>
          </button>

        </div>
      </div>

      {/* Secondary Navigation Bar (#232f3e Dark Slate) */}
      <div className="bg-[#232f3e] dark:bg-[#0f172a] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar gap-4">
        
        {/* Left: Mega Menu button + Quick Links */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          <button
            onClick={onOpenMegaMenu}
            className="flex items-center gap-1.5 border border-transparent hover:border-white px-2 py-1 rounded font-bold transition-all cursor-pointer bg-white/10 sm:bg-transparent"
          >
            <Menu className="h-4 w-4" />
            <span>All</span>
          </button>

          <button onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); }} className="hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Shopprix mini TV
          </button>
          <button onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); }} className="hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 font-bold text-amber-300 cursor-pointer">
            Today's Deals
          </button>
          <button onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }} className="hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Mobiles & Gadgets
          </button>
          <button onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }} className="hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Fashion & Lifestyle
          </button>
          <button onClick={() => { setSelectedCategory("grocery"); onNavigate("listing", "grocery"); }} className="hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Grocery & Gourmet
          </button>
          <button onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }} className="hidden md:block hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Home & Kitchen
          </button>
          <button onClick={() => { setSelectedCategory("books"); onNavigate("listing", "books"); }} className="hidden lg:block hover:text-amber-400 border border-transparent hover:border-white px-2 py-1 rounded transition-all shrink-0 cursor-pointer">
            Books
          </button>
        </div>

        {/* Right: Festive Banner / Dark mode / Admin link */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
          <span 
            onClick={() => onNavigate("listing")}
            className="hidden xl:flex items-center gap-1.5 text-amber-300 font-bold hover:underline cursor-pointer bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Big Sale Dhamaka - Free Express Delivery Over ₹499!</span>
          </span>
        </div>

      </div>
    </header>
  );
}
