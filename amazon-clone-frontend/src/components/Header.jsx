import { Search, ShoppingCart, Menu, ChevronDown, X, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../api/client'

const categories = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Beauty',
  'Sports', 'Toys', 'Grocery', 'Mobiles'
]

export default function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)
  const boxRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleKeywordChange(value) {
    setKeyword(value)
    clearTimeout(debounceRef.current)
    if (!value.trim()) {
      setSuggestions([])
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

  return (
    <header className="sticky top-0 z-50 font-sans bg-luxe-bg border-b border-gold/30">
      <div className="flex items-center gap-3 px-3 py-3">
        <button className="md:hidden text-gold" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link to="/" className="flex items-center shrink-0">
          <span className="text-lg sm:text-2xl font-bold tracking-wide text-gold whitespace-nowrap drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
            Teotia Shopprix
          </span>
        </Link>

        <div ref={boxRef} className="hidden md:block flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden border border-gold/40">
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => keyword && setShowSuggestions(true)}
              placeholder="Search Teotia Shopprix"
              className="flex-1 px-4 py-2 bg-luxe-panel text-white text-sm focus:outline-none placeholder:text-gray-500"
            />
            <button type="submit" className="bg-gold px-4 flex items-center justify-center hover:bg-gold-light">
              <Search size={18} className="text-black" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-luxe-panel border border-gold/30 rounded-md shadow-goldGlow overflow-hidden z-50">
              {suggestions.map((p) => (
                <button
                  key={p._id}
                  onClick={() => goToSuggestion(p)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-left"
                >
                  <img src={p.images?.[0]} alt="" className="w-8 h-8 object-contain bg-white rounded" />
                  <span className="text-sm text-gray-200 flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-gold">₹{p.price?.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {user && (
            <Link to="/wishlist" className="hidden sm:block text-gray-200 hover:text-gold" aria-label="Wishlist">
              <Heart size={22} />
            </Link>
          )}

          {user ? (
            <div className="hidden md:flex items-center gap-1 cursor-pointer group relative text-gray-200">
              <span className="text-sm">Hi, {user.name.split(' ')[0]}</span>
              <ChevronDown size={14} />
              <div className="absolute top-full right-0 hidden group-hover:block bg-luxe-panel border border-gold/30 shadow-goldGlow rounded-md py-2 w-40 mt-2">
                <Link to="/orders" className="block px-3 py-1.5 text-sm text-gray-200 hover:text-gold">Your Orders</Link>
                <Link to="/wishlist" className="block px-3 py-1.5 text-sm text-gray-200 hover:text-gold">Wishlist</Link>
                <button onClick={logout} className="w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:text-gold">Sign out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm text-gray-200 hover:text-gold">Sign in</Link>
          )}

          <Link to="/cart" className="relative text-gray-200 hover:text-gold">
            <ShoppingCart size={26} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blush-gradient text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="md:hidden flex px-3 pb-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder="Search Teotia Shopprix"
          className="flex-1 px-4 py-2.5 bg-luxe-panel border border-gold/30 rounded-l-full text-white text-sm focus:outline-none placeholder:text-gray-500"
        />
        <button type="submit" className="bg-gold px-4 rounded-r-full flex items-center justify-center">
          <Search size={18} className="text-black" />
        </button>
      </form>

      <div className="hidden md:flex items-center gap-5 px-3 py-2 border-t border-gold/10 overflow-x-auto">
        {categories.map(c => (
          <span
            key={c}
            onClick={() => navigate(`/?category=${encodeURIComponent(c)}`)}
            className="cursor-pointer text-sm text-gray-300 hover:text-gold whitespace-nowrap shrink-0"
          >
            {c}
          </span>
        ))}
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gold/20 bg-luxe-panel px-4 py-3 space-y-3">
          {user ? (
            <>
              <p className="text-gray-200 text-sm">Hi, {user.name.split(' ')[0]}</p>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-gray-300 text-sm py-1">Your Orders</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block text-gray-300 text-sm py-1">Wishlist</Link>
              <button onClick={() => { logout(); setMobileOpen(false) }} className="block text-gray-300 text-sm py-1">Sign out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gold text-sm py-1">Sign in</Link>
          )}
          <div className="border-t border-gold/10 pt-2">
            {categories.map(c => (
              <span
                key={c}
                onClick={() => { navigate(`/?category=${encodeURIComponent(c)}`); setMobileOpen(false) }}
                className="block cursor-pointer text-sm text-gray-300 hover:text-gold py-1.5"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
