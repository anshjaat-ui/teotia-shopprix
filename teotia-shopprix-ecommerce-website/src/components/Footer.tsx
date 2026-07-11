"use client";

import React, { useState } from "react";
import { Globe, ShieldCheck, Truck, RotateCcw, Award, CheckCircle, Send } from "lucide-react";

export function Footer({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="mt-16 bg-[#232f3e] text-white">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-xs sm:text-sm font-semibold py-3 sm:py-4 transition-colors cursor-pointer text-center block shadow-inner"
      >
        Back to top
      </button>

      {/* Trust Badges Bar */}
      <div className="bg-[#192330] border-y border-slate-700/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-3">
            <Truck className="h-8 w-8 text-amber-400 mb-2 stroke-[1.5]" />
            <span className="font-bold text-sm">Shopprix Express Delivery</span>
            <span className="text-xs text-slate-400 mt-1">Fast & FREE shipping on orders above ₹499</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-2 stroke-[1.5]" />
            <span className="font-bold text-sm">100% Purchase Protection</span>
            <span className="text-xs text-slate-400 mt-1">Genuine products with secure payment options</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <RotateCcw className="h-8 w-8 text-blue-400 mb-2 stroke-[1.5]" />
            <span className="font-bold text-sm">Easy 7-Day Returns</span>
            <span className="text-xs text-slate-400 mt-1">No-questions-asked replacement guarantee</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <Award className="h-8 w-8 text-purple-400 mb-2 stroke-[1.5]" />
            <span className="font-bold text-sm">24/7 Dedicated Support</span>
            <span className="text-xs text-slate-400 mt-1">Reach our team via Live Chat or WhatsApp anytime</span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Links */}
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        
        {/* Col 1 */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-white tracking-wide">Get to Know Us</h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline hover:text-white">About Teotia Shopprix</a></li>
            <li><a href="#careers" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline hover:text-white">Careers at Teotia Group</a></li>
            <li><a href="#press" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline hover:text-white">Press Releases</a></li>
            <li><a href="#science" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline hover:text-white">Teotia Shopprix Science & AI</a></li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-white tracking-wide">Connect with Us</h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Facebook Page</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">X (formerly Twitter)</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline hover:text-white">Instagram handle</a></li>
            <li><a href="https://wa.me/919876543210" target="_blank" className="hover:underline hover:text-emerald-400 font-semibold">Chat on WhatsApp</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-white tracking-wide">Make Money with Us</h4>
          <ul className="space-y-2 text-slate-300 text-xs">
            <li><button onClick={() => onNavigate("admin")} className="hover:underline hover:text-amber-400 font-bold text-amber-300 text-left">Sell on Teotia Shopprix ⚡</button></li>
            <li><button onClick={() => onNavigate("admin")} className="hover:underline hover:text-white text-left">Protect & Build Your Brand</button></li>
            <li><button onClick={() => onNavigate("admin")} className="hover:underline hover:text-white text-left">Teotia Global Selling</button></li>
            <li><button onClick={() => onNavigate("admin")} className="hover:underline hover:text-white text-left">Become an Affiliate Partner</button></li>
          </ul>
        </div>

        {/* Col 4 - Newsletter */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-white tracking-wide">Shopprix Newsletter</h4>
          <p className="text-xs text-slate-300">
            Get exclusive VIP early access to Big Sale flash deals and discount coupons delivered straight to your inbox.
          </p>
          {subscribed ? (
            <div className="bg-emerald-900/60 border border-emerald-500/50 p-3 rounded-lg flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>You're subscribed! Check your inbox for ₹500 welcome bonus coupon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address..."
                className="bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 flex-1"
                required
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 rounded text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Divider & Logo / Currency */}
      <div className="border-t border-slate-700 py-8 px-6 bg-[#131921] flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
        <div 
          onClick={() => onNavigate("home")}
          className="cursor-pointer flex items-baseline gap-1.5"
        >
          <span className="font-extrabold text-2xl tracking-tighter text-white">
            Teotia <span className="text-[#febd69]">Shopprix</span>
          </span>
          <span className="text-xs bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
            for all
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 border border-slate-600 rounded px-3 py-1.5 hover:border-slate-400 transition-colors">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>English (EN)</span>
          </div>
          <div className="flex items-center gap-2 border border-slate-600 rounded px-3 py-1.5 hover:border-slate-400 transition-colors">
            <span>🇮🇳</span>
            <span>India - ₹ INR</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#0f172a] py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-800/80">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 text-slate-300 font-medium">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline">Conditions of Use & Sale</a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline">Privacy Policy</a>
          <a href="#ads" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:underline">Interest-Based Ads</a>
          <a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate("admin"); }} className="hover:underline text-amber-400">Admin Control Panel</a>
        </div>
        <p>© 1996–2026, Teotia Shopprix for all, Inc. or its affiliates. Engineered with precision.</p>
      </div>
    </footer>
  );
}
