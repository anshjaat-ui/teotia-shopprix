"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "@/lib/seed-data";

export interface CartItem {
  id: number;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  inStock: boolean;
  category: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  isLoggedIn: boolean;
}

interface ShopprixContextType {
  products: any[];
  categories: any[];
  cart: CartItem[];
  wishlist: number[];
  user: User | null;
  location: { city: string; pincode: string };
  darkMode: boolean;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  loginUser: (userData: Partial<User>) => void;
  logoutUser: () => void;
  updateLocation: (city: string, pincode: string) => void;
  toggleDarkMode: () => void;
  refreshProducts: () => Promise<void>;
  seedDatabase: () => Promise<boolean>;
}

const ShopprixContext = createContext<ShopprixContextType | undefined>(undefined);

export function ShopprixProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<any[]>(INITIAL_PRODUCTS.map((p, idx) => ({ ...p, id: idx + 1 })));
  const [categories, setCategories] = useState<any[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([1, 4]);
  const [user, setUser] = useState<User | null>({
    name: "Vikram Teotia",
    email: "vikram@teotia.com",
    phone: "+91 98112 34567",
    role: "admin", // Admin role by default so users can easily explore Admin Panel
    isLoggedIn: true,
  });
  const [location, setLocation] = useState({ city: "New Delhi", pincode: "110001" });
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load from localStorage & fetch live API data
  useEffect(() => {
    const loadSavedState = () => {
      try {
        const savedCart = localStorage.getItem("shopprix_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem("shopprix_wishlist");
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedUser = localStorage.getItem("shopprix_user");
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedLocation = localStorage.getItem("shopprix_location");
        if (savedLocation) setLocation(JSON.parse(savedLocation));

        const savedDarkMode = localStorage.getItem("shopprix_dark_mode");
        if (savedDarkMode) {
          const isDark = JSON.parse(savedDarkMode);
          setDarkMode(isDark);
          if (isDark) document.documentElement.classList.add("dark");
        }
      } catch (e) {
        console.error("Failed to load local storage state:", e);
      }
    };

    loadSavedState();
    refreshProducts();
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shopprix_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shopprix_wishlist", JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch products and categories concurrently
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);

      if (prodRes && prodRes.success && Array.isArray(prodRes.products) && prodRes.products.length > 0) {
        setProducts(prodRes.products);
      } else {
        // Automatically seed if the database products are 0
        await seedDatabase();
      }

      if (catRes && catRes.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
        setCategories(catRes.categories);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        const prodRes = await fetch("/api/products").then((r) => r.json());
        if (prodRes.success && prodRes.products) {
          setProducts(prodRes.products);
          return true;
        }
      }
    } catch (error) {
      console.error("Seeding error:", error);
    }
    return false;
  };

  const addToCart = (product: any, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      const img = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : typeof product.images === "string"
        ? product.images
        : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: Number(product.price || 0),
            originalPrice: Number(product.originalPrice || product.price || 0),
            image: img,
            quantity,
            inStock: Boolean(product.inStock),
            category: product.category || "General",
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const loginUser = (userData: Partial<User>) => {
    const newUser: User = {
      name: userData.name || "Teotia Shopper",
      email: userData.email || "shopper@shopprix.com",
      phone: userData.phone || "+91 98000 11111",
      role: userData.role || (userData.email?.includes("admin") || userData.email?.includes("teotia") ? "admin" : "customer"),
      isLoggedIn: true,
    };
    setUser(newUser);
    try {
      localStorage.setItem("shopprix_user", JSON.stringify(newUser));
    } catch (e) {}
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem("shopprix_user");
    } catch (e) {}
  };

  const updateLocation = (city: string, pincode: string) => {
    const newLoc = { city, pincode };
    setLocation(newLoc);
    try {
      localStorage.setItem("shopprix_location", JSON.stringify(newLoc));
    } catch (e) {}
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem("shopprix_dark_mode", JSON.stringify(nextState));
      } catch (e) {}
      if (nextState) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return nextState;
    });
  };

  return (
    <ShopprixContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        user,
        location,
        darkMode,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        loginUser,
        logoutUser,
        updateLocation,
        toggleDarkMode,
        refreshProducts,
        seedDatabase,
      }}
    >
      {children}
    </ShopprixContext.Provider>
  );
}

export function useShopprix() {
  const context = useContext(ShopprixContext);
  if (!context) {
    throw new Error("useShopprix must be used within a ShopprixProvider");
  }
  return context;
}
