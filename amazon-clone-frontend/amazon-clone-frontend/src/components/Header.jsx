Yeh error isliye aa raha hai kyunki aapne **`Header.jsx`** file ke andar galti se mera conversational text (Hindi explanation) copy-paste kar diya hai, jiska pehla word `Aapke` hai. Us file mein sirf JavaScript/React ka code hona chahiye, koi text ya explanation nahi.

Is error ko theek karne ke liye apne `src/components/Header.jsx` file ki **sabse pehli line** par jaakar wo Hindi text hata dein, aur sirf code rakhein.

Aapke liye clean aur error-free **`Header.jsx`** ka exact code niche diya gaya hai. Ise poora copy karke apni file mein paste kar dein:

```jsx
import { Search, ShoppingCart, Menu, ChevronDown, X, Heart, Sparkles } from 'lucide-react'
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
  const [activeCategory, setActiveCategory] = useState(null)
  const debounceRef = useRef(null)
  const boxRef = useRef(null)

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res)
    }).catch(() => {
      setCategories([
        { 
          _id: '1', name: 'Stationery', emoji: '📚', 
          gradient: 'from-blue-600 to-indigo-500',
          subcategories: ['Books', 'Notebooks', 'Pens & Pencils', 'Geometry Box'] 
        },
        { 
          _id: '2', name: 'Pharmacy', emoji: '💊', 
          gradient: 'from-emerald-600 to-teal-400',
          subcategories: ['Medicines', 'Wellness Kits', 'First Aid', 'Vitamins'] 
        },
        { 
          _id: '3', name: 'Doctors Care', emoji: '👨‍⚕️', 
          gradient: 'from-orange-500 to-amber-400',
          subcategories: ['Consultation', 'Skin Care', 'Hair Growth', 'Weight Management'] 
        },
        { 
          _id: '4', name: 'Lab Tests', emoji: '🧪', 
          gradient: 'from-purple-600 to-pink-500',
          subcategories: ['Full Body Checkup', 'Blood Test', 'Diabetes Panel', 'Thyroid'] 
        }
      ])
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowSuggestions(false)
        setActiveCategory(null)
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
    <header className="sticky top-0 z-50 font-sans bg-luxe-bg border-b border-gold/30 shadow-md">
      <div className="flex items-center gap-3 px-4 py-3">
        <button className="md:hidden text-gold" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link to="/" className="flex items-center shrink-0">
          <span className="text-lg sm:text-2xl font-extrabold tracking-wide text-gold whitespace-nowrap drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
            Teotia Shopprix
          </span>
        </Link>

        <div ref={boxRef} className="hidden md:block flex-1 max-w-2xl relative mx-4">
          <form onSubmit={handleSearch} className="flex rounded-full overflow-hidden border border-gold/40 shadow-inner">
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onFocus={() => keyword && setShowSuggestions(true)}
              placeholder="Search Teotia Shopprix..."
              className="flex-1 px-5 py-2.5 bg-luxe-panel text-white text-sm focus:outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="bg-gold px-5 flex items-center justify-center hover:bg-gold-light transition-colors">
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
                  <span className="text-xs text-gold font-bold">₹{p.price?.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Link to="/schemes" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-black bg-gold rounded-full px-4 py-2 hover:bg-gold-light transition-all shadow-sm whitespace-nowrap">
            <Sparkles size={14} /> Schemes & Offers
          </Link>

          {user && (
            <Link
              to="/wishlist"
              className="hidden sm:flex w-9 h-9 rounded-full bg-black border border-gold/30 items-center justify-center text-white hover:bg-gold hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>
          )}

          {user ? (
            <div className="hidden md:flex items-center gap-1 cursor-pointer group relative text-gray-200 py-1">
              <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
              <ChevronDown size={14} />
              <div className="absolute top-full right-0 hidden group-hover:block bg-luxe-panel border border-gold/30 shadow-goldGlow rounded-md py-2 w-40 mt-1">
                <Link to="/orders" className="block px-3 py-1.5 text-sm text-gray-200 hover:text-gold">Your Orders</Link>
                <Link to="/wishlist" className="block px-3 py-1.5 text-sm text-gray-200 hover:text-gold">Wishlist</Link>
                <button onClick={logout} className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-white/5">Sign out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block text-sm font-medium text-gold hover:underline">Sign in</Link>
          )}

          <Link to="/cart" className="relative text-gray-200 hover:text-gold transition-colors p-1">
            <ShoppingCart size={26} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
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
          placeholder="Search Teotia Shopprix..."
          className="flex-1 px-4 py-2.5 bg-luxe-panel border border-gold/30 rounded-l-full text-white text-sm focus:outline-none placeholder:text-gray-500"
        />
        <button type="submit" className="bg-gold px-4 rounded-r-full flex items-center justify-center">
          <Search size={18} className="text-black" />
        </button>
      </form>

      <div className="hidden md:flex items-center justify-center gap-4 px-4 py-2.5 border-t border-gold/10 overflow-x-auto bg-black/40">
        {categories.map((c) => (
          <div 
            key={c._id} 
            className="relative group cursor-pointer"
            onMouseEnter={() => setActiveCategory(c._id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div
              onClick={() => navigate(`/?category=${encodeURIComponent(c.name)}`)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r ${c.gradient || 'from-blue-600 to-indigo-600'} text-white shadow-md hover:scale-105 transition-all duration-300 whitespace-nowrap`}
            >
              <span className="text-base bg-black/20 p-1.5 rounded-lg">{c.emoji}</span>
              <span className="text-xs font-bold tracking-wide">{c.name}</span>
              {c.subcategories && c.subcategories.length > 0 && <ChevronDown size={14} className="opacity-80" />}
            </div>

            {c.subcategories && c.subcategories.length > 0 && activeCategory === c._id && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-luxe-panel border border-gold/40 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-md">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold border-b border-gold/20 mb-1">
                  {c.name} Options
                </div>
                {c.subcategories.map((sub, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/?category=${encodeURIComponent(c.name)}&subcategory=${encodeURIComponent(sub)}`);
                      setActiveCategory(null);
                    }}
                    className="px-4 py-2 text-xs text-gray-200 hover:bg-gold/20 hover:text-gold transition-colors flex items-center justify-between"
                  >
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gold/20 bg-luxe-panel px-4 py-4 space-y-4">
          <Link to="/schemes" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 text-xs font-bold text-black bg-gold rounded-lg py-2.5 shadow">
            <Sparkles size={16} /> View Schemes & Offers
          </Link>

          {user ? (
            <div className="border-b border-gold/10 pb-3">
              <p className="text-gold font-medium text-sm mb-1">Hi, {user.name.split(' ')[0]}</p>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-gray-300 text-sm py-1">Your Orders</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block text-gray-300 text-sm py-1">Wishlist</Link>
              <button onClick={() => { logout(); setMobileOpen(false) }} className="block text-red-400 text-sm py-1">Sign out</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gold text-sm font-semibold py-1">Sign in</Link>
          )}

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Explore Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <div
                  key={c._id}
                  onClick={() => { navigate(`/?category=${encodeURIComponent(c.name)}`); setMobileOpen(false); }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r ${c.gradient || 'from-blue-600 to-indigo-600'} text-white cursor-pointer shadow`}
                >
                  <span className="text-sm">{c.emoji}</span>
                  <span className="text-xs font-bold truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

```
