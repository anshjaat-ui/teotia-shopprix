"use client";

import React, { useState, useEffect } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { ProductCard } from "@/components/ProductCard";
import { 
  ChevronLeft, ChevronRight, Sparkles, Zap, Shield, Gift, 
  Smartphone, Shirt, ShoppingBasket, Home, BookOpen, Clock, ArrowRight 
} from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Mega Festive Dhamaka",
    title: "Up to 70% OFF on Top Brand Smartphones & Gadgets",
    subtitle: "Plus 10% Instant Discount with HDFC & ICICI Credit Cards • Free Express Delivery",
    ctaText: "Explore Electronics",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    bgGradient: "from-blue-900 via-slate-900 to-[#131921]",
  },
  {
    id: 2,
    badge: "Shopprix Couture Week",
    title: "Revamp Your Wardrobe with Premium Designer Wear",
    subtitle: "Over 50,000 styles from Trench Coats, Ethnic Sarees to Athletic Sneakers at 50-60% Off",
    ctaText: "Shop Fashion Now",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    bgGradient: "from-purple-900 via-slate-900 to-[#131921]",
  },
  {
    id: 3,
    badge: "Shopprix Gourmet Pantry",
    title: "Daily Grocery Essentials & Organic Superfoods",
    subtitle: "Pure Himalayan Honey, California Almonds & Darjeeling Tea delivered within 2 hours",
    ctaText: "Stock Up Grocery",
    category: "grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    bgGradient: "from-emerald-900 via-slate-900 to-[#131921]",
  },
  {
    id: 4,
    badge: "Smart Home Makeover",
    title: "Air Fryers, Cordless Vacuums & Ergonomic Chairs",
    subtitle: "Upgrade your living space with no-cost EMI options and 2 years brand replacement warranty",
    ctaText: "Discover Home Tech",
    category: "home-kitchen",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1200&q=80",
    bgGradient: "from-amber-900 via-slate-900 to-[#131921]",
  }
];

export function HomeView({ 
  onNavigate, 
  onQuickView 
}: { 
  onNavigate: (view: string, filter?: string) => void;
  onQuickView: (product: any) => void;
}) {
  const { products, categories, isLoading, setSelectedCategory } = useShopprix();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const dealsOfTheDay = products.filter((p) => p.discountPercentage >= 30).slice(0, 4);
  const bestSellers = products.filter((p) => p.badge === "Best Seller" || p.rating >= 4.8).slice(0, 4);
  const trendingNow = products.slice(0, 8);

  return (
    <div className="space-y-10 pb-12">
      
      {/* 1. HERO CAROUSEL */}
      <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] overflow-hidden rounded-b-2xl shadow-2xl">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-between ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background gradient & Image */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-95`} />
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute right-0 inset-y-0 w-2/3 md:w-1/2 h-full object-cover mix-blend-overlay opacity-30 md:opacity-50"
              />

              {/* Content Overlay */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col justify-center h-full text-white space-y-4 md:space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    <Sparkles className="h-3.5 w-3.5 fill-slate-950" /> {slide.badge}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight text-white drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-base md:text-lg text-slate-200 max-w-xl font-medium drop-shadow">
                  {slide.subtitle}
                </p>
                <div>
                  <button
                    onClick={() => { setSelectedCategory(slide.category); onNavigate("listing", slide.category); }}
                    className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black text-sm md:text-base px-6 md:px-8 py-3 md:py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? "w-8 bg-amber-400" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. AMAZON 4-GRID CATEGORY BOX CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 md:-mt-24 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Upgrade your Home */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-3">
                Upgrade your Home | Appliances & Decor
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Air Fryers</span>
                </div>
                <div onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Vacuums</span>
                </div>
                <div onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1580481077494-e3299acabf75?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Office Chairs</span>
                </div>
                <div onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Cookware</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedCategory("home-kitchen"); onNavigate("listing", "home-kitchen"); }}
              className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all Home products <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Card 2: Revamp your Wardrobe */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-3">
                Revamp your Wardrobe | Fashion & Style
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Trench Coats</span>
                </div>
                <div onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Sneakers</span>
                </div>
                <div onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Silk Sarees</span>
                </div>
                <div onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Suits & Jackets</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }}
              className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all Fashion wear <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Card 3: Latest Gadgets & Mobiles */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-3">
                Latest Gadgets | Mobiles & Laptops
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Pro Phones</span>
                </div>
                <div onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Headphones</span>
                </div>
                <div onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Laptops</span>
                </div>
                <div onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Smart Watches</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }}
              className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all Electronics <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Card 4: Grocery & Gourmet Specials */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-3">
                Daily Pantry | Gourmet & Superfoods
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div onClick={() => { setSelectedCategory("grocery"); onNavigate("listing", "grocery"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Almonds</span>
                </div>
                <div onClick={() => { setSelectedCategory("grocery"); onNavigate("listing", "grocery"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Wild Honey</span>
                </div>
                <div onClick={() => { setSelectedCategory("grocery"); onNavigate("listing", "grocery"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Darjeeling Tea</span>
                </div>
                <div onClick={() => { setSelectedCategory("beauty"); onNavigate("listing", "beauty"); }} className="cursor-pointer group">
                  <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">Vitamin C Glow</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedCategory("grocery"); onNavigate("listing", "grocery"); }}
              className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all Grocery items <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>
      </div>

      {/* 3. DEALS OF THE DAY SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Zap className="h-6 w-6 fill-amber-500 animate-pulse" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Lightning Deals of the Day
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> Ends in <span className="font-bold text-red-600 dark:text-red-400">14h : 28m : 45s</span> • Limited Stock Available!
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); }}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all deals <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {dealsOfTheDay.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onNavigateDetail={(id) => onNavigate("detail", id.toString())}
              />
            ))}
          </div>
        </div>
      </div>

       {/* 4. PROMOTIONAL BRAND BANNERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div 
            onClick={() => { setSelectedCategory("electronics"); onNavigate("listing", "electronics"); }}
            className="group bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden cursor-pointer flex items-center justify-between min-h-[180px]"
          >
            <div className="relative z-10 max-w-sm space-y-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                Shopprix Mini TV Exclusive
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Watch 4K Blockbuster Movies & Web Series FREE
              </h3>
              <p className="text-xs text-slate-300">Available with your Teotia Shopprix shopping account</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline pt-1">
                Start Watching Now <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1593789382576-54f489574d26?auto=format&fit=crop&w=600&q=80" 
              alt="Mini TV" 
              className="absolute right-0 top-0 bottom-0 w-1/2 object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div 
            onClick={() => { setSelectedCategory("fashion"); onNavigate("listing", "fashion"); }}
            className="group bg-gradient-to-br from-amber-950 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden cursor-pointer flex items-center justify-between min-h-[180px]"
          >
            <div className="relative z-10 max-w-sm space-y-2">
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider">
                Prime Student & Corporate Offer
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Extra 15% Instant Savings on Laptops & Apparel
              </h3>
              <p className="text-xs text-slate-300">Verify your student/work email to unlock lifetime rewards</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:underline pt-1">
                Unlock VIP Rewards <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" 
              alt="VIP Rewards" 
              className="absolute right-0 top-0 bottom-0 w-1/2 object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </div>

      {/* 5. BEST SELLERS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Best Sellers in Teotia Shopprix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Our most popular products based on verified customer purchases and ratings
              </p>
            </div>
            <button
              onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); }}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              See all bestsellers <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onNavigateDetail={(id) => onNavigate("detail", id.toString())}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 6. TRENDING NOW SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200/80 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Explore All Trending Products
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Handpicked selection from over 15+ rich categories
              </p>
            </div>
            <button
              onClick={() => { setSelectedCategory("all"); onNavigate("listing", "all"); }}
              className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Browse complete catalog <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingNow.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
                onNavigateDetail={(id) => onNavigate("detail", id.toString())}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
