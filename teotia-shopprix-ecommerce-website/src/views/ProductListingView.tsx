"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { ProductCard } from "@/components/ProductCard";
import { Star, SlidersHorizontal, Check, X, Filter, RefreshCw } from "lucide-react";

interface ProductListingViewProps {
  initialCategoryFilter?: string;
  onNavigateDetail: (id: number) => void;
  onQuickView: (product: any) => void;
}

export function ProductListingView({
  initialCategoryFilter = "all",
  onNavigateDetail,
  onQuickView,
}: ProductListingViewProps) {
  const { products, categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useShopprix();

  useEffect(() => {
    if (initialCategoryFilter && initialCategoryFilter !== selectedCategory) {
      setSelectedCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(true);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
          return false;
        }

        // Price filter
        if (Number(p.price) > maxPrice) {
          return false;
        }

        // Star rating filter
        if (Number(p.rating || 4.5) < minRating) {
          return false;
        }

        // Out of stock toggle
        if (!showOutOfStock && !p.inStock) {
          return false;
        }

        // Discount filter
        if (onlyDiscounted && p.discountPercentage <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
        if (sortBy === "newest") return b.id - a.id;
        return 0; // featured
      });
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, showOutOfStock, onlyDiscounted, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(150000);
    setMinRating(0);
    setShowOutOfStock(true);
    setOnlyDiscounted(false);
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Bar Query / Breadcrumb Banner */}
      {searchQuery && (
        <div className="mb-6 bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Search results for:</span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">"{searchQuery}"</h2>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" /> Clear Search
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white"
          >
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />
            <span>Filter Products ({filteredProducts.length})</span>
          </button>
          <button onClick={resetFilters} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Reset
          </button>
        </div>

        {/* SIDEBAR FILTERS (DESKTOP + MOBILE DRAWER) */}
        <aside
          className={`fixed lg:static inset-0 z-50 bg-white dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 overflow-y-auto lg:overflow-visible transition-all lg:w-64 shrink-0 space-y-6 ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          {/* Mobile header inside drawer */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <span className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-amber-500" /> Filters
            </span>
            <button onClick={() => setShowMobileFilters(false)} className="p-1.5 hover:bg-slate-100 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            
            {/* Header / Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                Filter By
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" /> Reset all
              </button>
            </div>

            {/* 1. Categories */}
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3">
                Department / Category
              </h4>
              <div className="space-y-1.5 text-xs font-medium">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>All Departments</span>
                  <span className="text-[10px] opacity-80">({products.length})</span>
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.categorySlug === c.slug).length;
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      <span className="text-[10px] opacity-80 shrink-0">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Range Slider */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Max Price Range
                </h4>
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="150000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <button
                  onClick={() => setMaxPrice(2000)}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 rounded text-[10px] font-bold text-center cursor-pointer"
                >
                  Under ₹2K
                </button>
                <button
                  onClick={() => setMaxPrice(15000)}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 rounded text-[10px] font-bold text-center cursor-pointer"
                >
                  Under ₹15K
                </button>
                <button
                  onClick={() => setMaxPrice(60000)}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 rounded text-[10px] font-bold text-center cursor-pointer"
                >
                  Under ₹60K
                </button>
              </div>
            </div>

            {/* 3. Customer Rating */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                Avg. Customer Rating
              </h4>
              <div className="space-y-1.5 text-xs">
                {[4, 3, 2, 0].map((stars) => {
                  const isSelected = minRating === stars;
                  return (
                    <button
                      key={stars}
                      onClick={() => setMinRating(stars)}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSelected ? "bg-amber-50 dark:bg-amber-950/40 font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                          ))}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{stars === 0 ? "All Ratings" : "& up"}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Availability & Discount */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Stock & Discounts
              </h4>

              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Include Out of Stock</span>
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={(e) => setShowOutOfStock(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Discounted Deals Only</span>
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID & SORTING BAR */}
        <main className="flex-1 min-w-0">
          
          {/* Top Bar with results count & sorting dropdown */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {selectedCategory === "all" 
                  ? "All Products & Catalog" 
                  : categories.find(c => c.slug === selectedCategory)?.name || "Products"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Showing <span className="font-bold text-slate-800 dark:text-white">{filteredProducts.length}</span> of {products.length} total items
              </p>
            </div>

            {/* Sorting select */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0 w-full sm:w-auto">
              <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1 sm:flex-initial cursor-pointer font-semibold"
              >
                <option value="featured">Featured & Best Matches</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={onQuickView}
                  onNavigateDetail={onNavigateDetail}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                !
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No products match your current filters
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Try expanding your price range, choosing another department, or clearing search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
