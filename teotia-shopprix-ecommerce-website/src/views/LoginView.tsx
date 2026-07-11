"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { Lock, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";

export function LoginView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { loginUser } = useShopprix();

  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState("vikram@teotia.com");
  const [nameInput, setNameInput] = useState("Vikram Teotia");
  const [phoneInput, setPhoneInput] = useState("+91 98112 34567");
  const [passwordInput, setPasswordInput] = useState("secret123");
  const [roleInput, setRoleInput] = useState<"customer" | "admin">("admin");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent && isRegistering) {
      setOtpSent(true);
      return;
    }
    
    loginUser({
      name: nameInput || "Teotia Customer",
      email: emailInput || "shopper@shopprix.com",
      phone: phoneInput || "+91 98000 11111",
      role: roleInput,
      isLoggedIn: true,
    });

    onNavigate(roleInput === "admin" ? "admin" : "home");
  };

  const loginAsAdminPreset = () => {
    loginUser({
      name: "Vikram Teotia (Admin)",
      email: "admin@teotiashopprix.com",
      phone: "+91 98112 34567",
      role: "admin",
      isLoggedIn: true,
    });
    onNavigate("admin");
  };

  const loginAsCustomerPreset = () => {
    loginUser({
      name: "Ananya Sharma (Shopper)",
      email: "ananya.sharma@gmail.com",
      phone: "+91 91234 56789",
      role: "customer",
      isLoggedIn: true,
    });
    onNavigate("home");
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-4">
      
      {/* Top Logo */}
      <div 
        onClick={() => onNavigate("home")}
        className="cursor-pointer mb-6 flex flex-col items-center"
      >
        <span className="font-extrabold text-3xl tracking-tighter text-slate-900 dark:text-white">
          Teotia <span className="text-amber-500">Shopprix</span>
        </span>
        <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase mt-0.5 tracking-wider">
          for all
        </span>
      </div>

      {/* Main Login / Register Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRegistering ? (otpSent ? "Verify Mobile OTP" : "Create Account") : "Sign in to Teotia Shopprix"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRegistering 
              ? "Enjoy fast checkouts, Prime delivery & exclusive discounts" 
              : "Enter your email or mobile number to continue shopping"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && !otpSent && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First and last name"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          )}

          {!otpSent && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. vikram@teotia.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  required
                />
              </div>

              {isRegistering && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98112 34567"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRoleInput("customer")}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      roleInput === "customer"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Shopper / Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleInput("admin")}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      roleInput === "admin"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Admin / Store Manager ⚡
                  </button>
                </div>
              </div>
            </>
          )}

          {otpSent && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 p-3 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                A 6-digit verification code has been sent to your mobile phone via SMS.
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="e.g. 894123"
                  maxLength={6}
                  className="w-full px-3 py-2 text-center tracking-widest font-extrabold text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                  autoFocus
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{isRegistering ? (otpSent ? "Complete Registration & Login" : "Send Verification OTP") : "Continue"}</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 text-center space-y-3">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setOtpSent(false); }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer block w-full"
          >
            {isRegistering ? "Already have an account? Sign in here" : "New to Teotia Shopprix? Create your account"}
          </button>
        </div>

        {/* Quick Demo Instant Presets */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Instant One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={loginAsAdminPreset}
              className="bg-slate-900 hover:bg-slate-950 dark:bg-slate-700 dark:hover:bg-slate-600 text-amber-400 font-extrabold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1"
            >
              ⚡ Login as Admin
            </button>
            <button
              onClick={loginAsCustomerPreset}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              🛍️ Login as Shopper
            </button>
          </div>
        </div>

      </div>

      {/* Conditions */}
      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mt-6">
        By continuing, you agree to Teotia Shopprix's Conditions of Use and Privacy Notice.
      </p>
    </div>
  );
}
