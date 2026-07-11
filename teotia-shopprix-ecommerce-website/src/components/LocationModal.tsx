"use client";

import React, { useState } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { MapPin, X, Check } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { city: "New Delhi", pincode: "110001" },
  { city: "Mumbai", pincode: "400001" },
  { city: "Bangalore", pincode: "560001" },
  { city: "Hyderabad", pincode: "500001" },
  { city: "Chennai", pincode: "600001" },
  { city: "Kolkata", pincode: "700001" },
  { city: "Pune", pincode: "411001" },
  { city: "Noida", pincode: "201301" },
];

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { location, updateLocation } = useShopprix();
  const [cityInput, setCityInput] = useState(location.city);
  const [pincodeInput, setPincodeInput] = useState(location.pincode);

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput && pincodeInput) {
      updateLocation(cityInput, pincodeInput);
      onClose();
    }
  };

  const selectPreset = (c: { city: string; pincode: string }) => {
    setCityInput(c.city);
    setPincodeInput(c.pincode);
    updateLocation(c.city, c.pincode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-700/60 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold">
            <MapPin className="h-5 w-5 text-amber-500" />
            <span>Choose your location</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-500 dark:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Delivery options and delivery speeds may vary for different locations. Check availability for your area.
          </p>

          <form onSubmit={handleApply} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  placeholder="e.g. 110001"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Town Name
              </label>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-md transition-all cursor-pointer mt-2"
            >
              Apply Location
            </button>
          </form>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Popular Metropolitan Areas
            </span>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CITIES.map((c) => {
                const isSelected = location.pincode === c.pincode;
                return (
                  <button
                    key={c.pincode}
                    type="button"
                    onClick={() => selectPreset(c)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{c.city}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
