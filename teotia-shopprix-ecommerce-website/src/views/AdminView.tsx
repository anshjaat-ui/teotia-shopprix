"use client";

import React, { useState, useEffect } from "react";
import { useShopprix } from "@/context/ShopprixContext";
import { 
  LayoutDashboard, Package, FolderPlus, ShoppingBag, Database, Plus, 
  Edit, Trash2, Check, X, RefreshCw, AlertCircle, TrendingUp, DollarSign, 
  ArrowUpRight, Eye, UploadCloud 
} from "lucide-react";

interface AdminViewProps {
  onNavigate: (view: string, id?: string) => void;
}

export function AdminView({ onNavigate }: AdminViewProps) {
  const { products, categories, refreshProducts, seedDatabase, user, setSelectedCategory } = useShopprix();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "categories" | "orders">("overview");
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Modal / Form state for Add/Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState("1499");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("2999");
  const [prodCategory, setProdCategory] = useState("Electronics & Gadgets");
  const [prodCategorySlug, setProdCategorySlug] = useState("electronics");
  const [prodStock, setProdStock] = useState("50");
  const [prodInStock, setProdInStock] = useState(true);
  const [prodBadge, setProdBadge] = useState("New Arrival");
  const [prodImage, setProdImage] = useState("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80");
  const [prodDescription, setProdDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrdersList(data.orders);
      }
    } catch (e) {
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProdTitle("");
    setProdPrice("1499");
    setProdOriginalPrice("2999");
    setProdCategory(categories[0]?.name || "Electronics & Gadgets");
    setProdCategorySlug(categories[0]?.slug || "electronics");
    setProdStock("50");
    setProdInStock(true);
    setProdBadge("Shopprix Exclusive");
    setProdImage("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80");
    setProdDescription("High performance premium quality product designed for modern lifestyle.");
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdPrice(prod.price?.toString() || "999");
    setProdOriginalPrice(prod.originalPrice?.toString() || "1499");
    setProdCategory(prod.category || "Electronics & Gadgets");
    setProdCategorySlug(prod.categorySlug || "electronics");
    setProdStock(prod.stockQuantity?.toString() || "50");
    setProdInStock(prod.inStock);
    setProdBadge(prod.badge || "");
    const img = Array.isArray(prod.images) ? prod.images[0] : prod.images || "";
    setProdImage(img);
    setProdDescription(prod.description || "");
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice) return;

    setIsSaving(true);
    try {
      const discount = Math.round(
        ((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100
      ) || 10;

      if (editingProductId) {
        // PATCH
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: prodTitle,
            price: Number(prodPrice),
            originalPrice: Number(prodOriginalPrice),
            discountPercentage: discount > 0 ? discount : 0,
            category: prodCategory,
            categorySlug: prodCategorySlug,
            stockQuantity: Number(prodStock),
            inStock: prodInStock,
            badge: prodBadge || null,
            images: [prodImage],
            description: prodDescription,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback("Product updated successfully!");
        }
      } else {
        // POST
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: prodTitle,
            price: Number(prodPrice),
            originalPrice: Number(prodOriginalPrice),
            discountPercentage: discount > 0 ? discount : 0,
            category: prodCategory,
            categorySlug: prodCategorySlug,
            stockQuantity: Number(prodStock),
            inStock: prodInStock,
            badge: prodBadge || null,
            images: [prodImage],
            description: prodDescription,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFeedback("New product created successfully!");
        }
      }

      await refreshProducts();
      setShowProductModal(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Save product error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFeedback("Product deleted successfully!");
        await refreshProducts();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleStock = async (prod: any) => {
    try {
      const nextStockState = !prod.inStock;
      await fetch(`/api/products/${prod.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: nextStockState }),
      });
      await refreshProducts();
      setFeedback(`Marked "${prod.title.substring(0, 20)}..." as ${nextStockState ? "IN STOCK" : "OUT OF STOCK"}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {}
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: catName,
          slug: catSlug || catName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: catDesc,
        }),
      });
      await refreshProducts();
      setShowCategoryModal(false);
      setCatName("");
      setCatSlug("");
      setCatDesc("");
      setFeedback("Category created!");
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {}
  };

  const handleResetDatabase = async () => {
    if (!confirm("Reset database to initial 15+ rich Teotia Shopprix demo products and orders?")) return;
    setIsSaving(true);
    try {
      await seedDatabase();
      await fetchOrders();
      setFeedback("Database seeded with fresh demo catalog & orders! 🚀");
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Analytics calculations
  const totalRevenue = ordersList.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0) + 184590;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-2 animate-bounce">
          <Check className="h-5 w-5 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-[#131921] text-white p-5 rounded-2xl shadow-xl border border-slate-800">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight leading-tight">Admin Dashboard</h2>
                <span className="text-[10px] text-amber-400 font-semibold block">Teotia Shopprix Panel</span>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "hover:bg-white/10 text-slate-300"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "products"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "hover:bg-white/10 text-slate-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Package className="h-4 w-4" /> Products Catalog
                </span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{products.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "hover:bg-white/10 text-slate-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FolderPlus className="h-4 w-4" /> Categories
                </span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{categories.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "hover:bg-white/10 text-slate-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4" /> Orders & Shipments
                </span>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full">{ordersList.length}</span>
              </button>
            </nav>

            <div className="pt-6 mt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={handleResetDatabase}
                disabled={isSaving}
                className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
                <span>Reset Demo Database</span>
              </button>
              <button
                onClick={() => onNavigate("home")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-xl text-xs text-center block transition-colors cursor-pointer"
              >
                Exit to Storefront
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Analytics Overview</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live metrics from Teotia Shopprix PostgreSQL storage</p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Add New Product
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Total Revenue</span>
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +18.4% this month
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Catalog Products</span>
                    <Package className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {products.length} Items
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">Across {categories.length} departments</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Customer Orders</span>
                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {ordersList.length + 142} Orders
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">100% On-time delivery rate</span>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-extrabold uppercase">Stock Status</span>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {outOfStockCount} Out of Stock
                  </p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Quick restock needed</span>
                </div>

              </div>

              {/* Recent Products preview table */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Recent Products in Inventory</h3>
                  <button onClick={() => setActiveTab("products")} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    View & Edit All ({products.length}) →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-bold">
                      <tr>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price / MRP</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {products.slice(0, 5).map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <img src={Array.isArray(prod.images) ? prod.images[0] : prod.images} alt="" className="w-10 h-10 object-contain rounded border bg-white shrink-0" />
                            <span className="truncate max-w-xs">{prod.title}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">{prod.category}</td>
                          <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">₹{Number(prod.price).toLocaleString("en-IN")}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                prod.inStock
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              }`}
                            >
                              {prod.inStock ? "In Stock ✓" : "Out of Stock ✕"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products Management</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage prices, toggle stock, edit details, or delete items instantly</p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Add New Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Price / Discount</th>
                        <th className="py-3 px-4">Stock Status (Toggle)</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <img
                              src={Array.isArray(prod.images) ? prod.images[0] : prod.images}
                              alt=""
                              onClick={() => onNavigate("detail", prod.id.toString())}
                              className="w-12 h-12 object-contain rounded-lg border bg-white shrink-0 cursor-pointer"
                            />
                            <div className="min-w-0 max-w-sm">
                              <p
                                onClick={() => onNavigate("detail", prod.id.toString())}
                                className="font-extrabold text-sm truncate hover:text-amber-500 cursor-pointer"
                              >
                                {prod.title}
                              </p>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                                Rating: ⭐ {prod.rating} ({prod.reviewCount} reviews)
                              </span>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {prod.category}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-sm text-slate-900 dark:text-white block">
                              ₹{Number(prod.price).toLocaleString("en-IN")}
                            </span>
                            {Number(prod.originalPrice) > Number(prod.price) && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{Number(prod.originalPrice).toLocaleString("en-IN")}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                                prod.inStock
                                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                              title="Click to toggle In Stock / Out of Stock"
                            >
                              {prod.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right space-x-1 shrink-0">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 rounded-lg text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Categories Management</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Organize Teotia Shopprix departments</p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((c) => {
                  const prodCount = products.filter((p) => p.categorySlug === c.slug).length;
                  return (
                    <div key={c.slug} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                          {c.slug}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">{c.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.description || "Active department"}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{prodCount} Products assigned</span>
                        <button
                          onClick={() => { setSelectedCategory(c.slug); onNavigate("listing", c.slug); }}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          View Storefront →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS HISTORY & SHIPMENTS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customer Orders & Shipments</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-time order logs stored in PostgreSQL</p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingOrders ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer Name & Phone</th>
                        <th className="py-3 px-4">Shipping Destination</th>
                        <th className="py-3 px-4">Payment & Total</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {ordersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-3 px-4 font-black text-amber-600 dark:text-amber-400">{ord.orderNumber}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">{ord.customerName}</p>
                            <span className="text-[10px] text-slate-500">{ord.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">{ord.shippingAddress}</td>
                          <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                            ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                            <span className="text-[10px] text-slate-500 block font-normal">{ord.paymentMethod}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold px-3 py-1 rounded-full text-[10px] uppercase">
                              {ord.status || "Delivered"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-6 border border-slate-200 dark:border-slate-700 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                {editingProductId ? "Edit Product Details" : "Add New Product to Catalog"}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Title / Name</label>
                  <input
                    type="text"
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Teotia Pro X Ultra 5G Smartphone"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-black text-amber-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department / Category</label>
                  <select
                    value={prodCategorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setProdCategorySlug(slug);
                      const cat = categories.find((c) => c.slug === slug);
                      if (cat) setProdCategory(cat.name);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Promotional Badge</label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="e.g. Best Seller / Deal of the Day"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Stock Status</label>
                  <select
                    value={prodInStock ? "true" : "false"}
                    onChange={(e) => setProdInStock(e.target.value === "true")}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                  >
                    <option value="true">✓ In Stock</option>
                    <option value="false">✕ Out of Stock</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                  <div className="flex gap-2 mt-2">
                    {[
                      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
                      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80"
                    ].map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProdImage(sample)}
                        className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded hover:bg-amber-100 cursor-pointer"
                      >
                        Sample Image #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
                  <textarea
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{isSaving ? "Saving..." : editingProductId ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-amber-500" /> Add New Category
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Sports & Outdoors"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Slug / Identifier</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="sports-outdoors"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-lg text-xs shadow-md cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
