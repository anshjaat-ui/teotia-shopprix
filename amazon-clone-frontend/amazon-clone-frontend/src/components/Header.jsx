import { Search, ShoppingCart, Menu, ChevronDown, X, Heart } from 'lucide-react'
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
  const [hovered, setHovered] = useState(null)

  const debounceRef = useRef(null)
  const boxRef = useRef(null)

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => setCategories([]))
  }, [])

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

      {/* TOP BAR */}
      <div className="flex items-center gap-3 px-3 py-3">
        <button className="md:hidden text-gold" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link to="/" className="flex items-center shrink-0">
          <span className="text-lg sm:text-2xl font-bold text-gold">
            Teotia Shopprix
          </span>
        </Link>

        {/* SEARCH */}
        <div ref={boxRef} className="hidden md:block flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden border border-gold/40">
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => keyword && setShowSuggestions(true)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 bg-luxe-panel text-white text-sm outline-none"
            />
            <button type="submit" className="bg-gold px-4">
              <Search size={18} className="text-black" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-luxe-panel border border-gold/30 rounded shadow-lg z-50">
              {suggestions.map((p) => (
                <button
                  key={p._id}
                  onClick={() => goToSuggestion(p)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5"
                >
                  <img src={p.images?.[0]} className="w-8 h-8 object-contain bg-white rounded" />
                  <span className="text-sm text-gray-200 flex-1">{p.name}</span>
                  <span className="text-xs text-gold">₹{p.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-4">
          <Link to="/schemes" className="text-xs text-gold border px-3 py-1 rounded-full">
            🎁 Schemes
          </Link>

          {user && (
            <Link to="/wishlist" className="hidden sm:flex w-9 h-9 bg-black items-center justify-center rounded-full">
              <Heart size={18} />
            </Link>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart size={26} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 🔥 CATEGORY ICON ROW WITH SUBCATEGORY */}
      <div className="hidden md:flex gap-6 px-3 py-3 border-t border-gold/10 overflow-x-auto">
        {categories.map((c, index) => (
          <div
            key={c._id}
            className="relative flex flex-col items-center cursor-pointer group"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate(`/category/${c.name}`)}
          >
            {/* ICON */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              {c.emoji}
            </div>

            {/* NAME */}
            <span className="text-xs text-gray-300 mt-1">{c.name}</span>

            {/* 🔥 SUBCATEGORY DROPDOWN */}
            {hovered === index && c.subCategories?.length > 0 && (
              <div className="absolute top-16 bg-black border border-gray-700 rounded shadow-lg p-2 z-50 min-w-[150px]">
                {c.subCategories.map((sub, i) => (
                  <div
                    key={i}
                    className="text-sm px-3 py-1 hover:bg-gray-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/category/${c.name}?sub=${sub}`)
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-luxe-panel p-3">
          {categories.map(c => (
            <div
              key={c._id}
              className="py-2 border-b border-gray-700"
              onClick={() => {
                navigate(`/category/${c.name}`)
                setMobileOpen(false)
              }}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}

    </header>
  )
}
