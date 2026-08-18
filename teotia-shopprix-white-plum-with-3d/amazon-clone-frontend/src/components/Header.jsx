import { Search, ShoppingCart, Menu, ChevronDown, X, Heart, UserCircle, MapPin, Truck, WalletCards, Headphones } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../api/client'

export default function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [categories, setCategories] = useState([])
  const debounceRef = useRef(null)
  const boxRef = useRef(null)

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeywordChange(value) {
    setKeyword(value)
    clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get(`/products/suggestions?keyword=${encodeURIComponent(value)}`)
        setSuggestions(data)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 250)
  }

  function handleSearch(e) {
    e.preventDefault()
    setShowSuggestions(false)
    navigate(`/?keyword=${encodeURIComponent(keyword)}`)
    setMobileOpen(false)
  }

  function goToSuggestion(p) {
    setShowSuggestions(false)
    setKeyword('')
    navigate(`/product/${p._id}`)
  }

  const rootCategories = categories.filter((c) => !c.parent)
  const navCategories = rootCategories.slice(0, 4)

  function goCategory(name) {
    navigate(`/?category=${encodeURIComponent(name)}`)
    setMobileOpen(false)
  }

  return (
    <header className="relative z-40 font-sans bg-white text-slate-900 border-b border-[#f0dfe5]">
      {/* Slim utility strip */}
      <div className="hidden md:flex items-center justify-between bg-[#fff5f7] border-b border-[#f5e4e8] px-6 lg:px-10 py-1.5 text-[12px] font-semibold text-slate-700">
        <div className="flex items-center gap-7">
          <span className="inline-flex items-center gap-1.5"><Truck size={14} className="text-blush-from" /> Free Delivery on Orders Above ₹999</span>
          <span className="inline-flex items-center gap-1.5"><WalletCards size={14} className="text-blush-from" /> Cash on Delivery Available</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/orders" className="hover:text-gold">Track Order</Link>
          <Link to="/contact" className="inline-flex items-center gap-1 hover:text-gold"><Headphones size={13} /> Help & Support</Link>
          <span className="inline-flex items-center gap-1"><MapPin size={13} /> Store Location</span>
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center gap-3 lg:gap-7 px-3 sm:px-5 lg:px-10 py-3.5">
        <button className="md:hidden text-gold shrink-0" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={27} /> : <Menu size={27} />}
        </button>

        <Link to="/" className="flex items-center shrink-0 gap-2 group" aria-label="Teotia Shopprix home">
          <img
            src="/teotia-shopprix-mark.png"
            alt="Teotia Shopprix logo"
            className="h-12 sm:h-14 lg:h-[68px] w-[78px] sm:w-[88px] lg:w-[96px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span className="hidden sm:block leading-none">
            <span className="block text-lg lg:text-2xl font-black tracking-[0.12em] text-[#481F72]">TEOTIA</span>
            <span className="block text-sm lg:text-base font-extrabold tracking-[0.18em] text-[#e52b59] mt-1">SHOPPRIX</span>
            <span className="hidden lg:block text-[7px] tracking-[0.18em] text-slate-500 mt-0.5">SHOP MORE, SAVE MORE, SMILE MORE</span>
          </span>
        </Link>

        <div ref={boxRef} className="hidden md:block flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="flex h-11 rounded-md overflow-hidden border border-[#e5dfe4] bg-white">
            <select
              aria-label="Category"
              className="hidden lg:block w-36 px-3 border-r border-[#e5dfe4] text-sm bg-[#fafafa] text-slate-700 outline-none"
              onChange={(e) => e.target.value && goCategory(e.target.value)}
              defaultValue=""
            >
              <option value="">All Categories</option>
              {rootCategories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => keyword && setShowSuggestions(true)}
              placeholder="Search for products..."
              className="flex-1 min-w-0 px-4 bg-white text-slate-900 text-sm focus:outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="w-14 bg-[#e52b59] flex items-center justify-center hover:bg-[#d51f4c]" aria-label="Search">
              <Search size={20} className="text-white" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#eadfe5] rounded-md shadow-xl overflow-hidden z-50">
              {suggestions.map((p) => (
                <button key={p._id} onClick={() => goToSuggestion(p)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#fff5f7] text-left">
                  <img src={p.images?.[0]} alt="" className="w-9 h-9 object-contain bg-white rounded" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-gold">₹{p.price?.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4 lg:gap-6 shrink-0">
          <Link to="/schemes" className="hidden xl:block text-sm font-semibold text-slate-700 hover:text-gold">Offers</Link>

          {user ? (
            <Link to="/profile" className="hidden md:flex items-center gap-2 text-slate-800 hover:text-gold" aria-label="My Profile">
              <UserCircle size={28} strokeWidth={1.7} />
              <span className="leading-tight"><span className="block text-[11px]">Account</span><span className="block text-sm font-semibold">{user.name.split(' ')[0]}</span></span>
              <ChevronDown size={13} />
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-2 text-slate-800 hover:text-gold">
              <UserCircle size={28} strokeWidth={1.7} />
              <span className="leading-tight"><span className="block text-[11px]">Account</span><span className="block text-sm font-semibold">Sign In</span></span>
            </Link>
          )}

          <Link to="/wishlist" className="hidden sm:flex items-center gap-2 text-slate-800 hover:text-gold" aria-label="Wishlist">
            <span className="relative"><Heart size={26} strokeWidth={1.7} />{user && <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#e52b59] text-white text-[9px] font-bold flex items-center justify-center">0</span>}</span>
            <span className="hidden lg:block text-sm font-semibold">Wishlist</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-2 text-slate-800 hover:text-gold" aria-label="Cart">
            <span className="relative"><ShoppingCart size={28} strokeWidth={1.7} /><span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#e52b59] text-white text-[9px] font-bold flex items-center justify-center">{itemCount}</span></span>
            <span className="hidden lg:block text-sm font-semibold">Cart <span className="block text-xs font-bold">₹0.00</span></span>
          </Link>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-stretch border-t border-[#f3e8ec]">
        <button onClick={() => setMobileOpen(true)} className="ml-5 lg:ml-10 bg-[#e52b59] text-white px-6 lg:px-8 h-12 flex items-center gap-2 font-bold text-sm" aria-label="All categories">
          <Menu size={18} /> ALL CATEGORIES
        </button>
        <nav className="flex items-center gap-7 lg:gap-10 px-8 lg:px-10 h-12 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="text-sm font-bold text-[#e52b59] border-b-2 border-[#e52b59] h-full flex items-center">HOME</Link>
          <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-800 hover:text-[#e52b59]">SHOP</button>
          {navCategories.map((c) => (
            <button key={c._id} onClick={() => goCategory(c.name)} className="text-sm font-bold text-slate-800 hover:text-[#e52b59]">{c.name.toUpperCase()}</button>
          ))}
          <Link to="/schemes" className="text-sm font-bold text-slate-800 hover:text-[#e52b59]">OFFERS</Link>
        </nav>
      </div>

      {/* Mobile search */}
      <form onSubmit={handleSearch} className="md:hidden flex px-3 pb-3">
        <input type="text" value={keyword} onChange={(e) => handleKeywordChange(e.target.value)} placeholder="Search for products..." className="flex-1 px-4 py-2.5 bg-white border border-[#eadfe5] rounded-l-full text-slate-900 text-sm focus:outline-none" />
        <button type="submit" className="bg-[#e52b59] px-4 rounded-r-full flex items-center justify-center"><Search size={18} className="text-white" /></button>
      </form>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#f1e1e6] bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between"><p className="font-black text-slate-900">Shop by Category</p><button onClick={() => setMobileOpen(false)} aria-label="Close"><X size={20} /></button></div>
          <div className="grid grid-cols-4 gap-3">
            {rootCategories.map((c) => (
              <button key={c._id} type="button" onClick={() => goCategory(c.name)} className="min-h-20 flex flex-col items-center justify-center gap-1 rounded-xl bg-[#fff8fa] border border-[#f0dfe5] px-1 py-2">
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">{c.emoji || '🛍️'}</span>
                <span className="text-[10px] text-slate-700 text-center leading-tight">{c.name}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#f1e1e6] pt-3 space-y-1">
            {user ? <><Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 font-semibold">My Profile</Link><button onClick={() => { logout(); setMobileOpen(false) }} className="block py-2">Sign out</button></> : <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 font-semibold">Sign In</Link>}
            <Link to="/orders" onClick={() => setMobileOpen(false)} className="block py-2">Track Order</Link>
            <Link to="/schemes" onClick={() => setMobileOpen(false)} className="block py-2">Offers & Schemes</Link>
          </div>
        </div>
      )}
    </header>
  )
}
