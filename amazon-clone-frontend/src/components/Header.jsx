import { Search, MapPin, ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categories = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Beauty',
  'Sports', 'Toys', 'Grocery', 'Mobiles'
]

export default function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Top bar */}
      <div className="bg-navy text-white flex items-center gap-4 px-3 py-2">
        <Link to="/" className="flex items-center shrink-0 px-2 py-1 border border-transparent hover:border-white rounded-sm">
          <span className="text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap">Teotia Shopprix</span>
          <span className="text-accent-orange text-lg sm:text-2xl leading-none -mt-2 ml-0.5">.</span>
        </Link>

        {/* Deliver to */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
          <MapPin size={18} className="mt-2" />
          <div className="text-xs leading-tight">
            <div className="text-gray-300">Deliver to Meerut</div>
            <div className="font-bold">Uttar Pradesh 250001</div>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-3xl rounded-md overflow-hidden">
          <select className="hidden sm:block bg-gray-100 text-xs text-gray-700 px-2 border-r border-gray-300 focus:outline-none">
            <option>All</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search teotiashopprix.com"
            className="flex-1 px-3 py-2 text-black text-sm focus:outline-none"
          />
          <button type="submit" className="bg-accent px-4 flex items-center justify-center hover:bg-accent-orange">
            <Search size={20} className="text-navy" />
          </button>
        </form>

        {/* Account & Orders */}
        {user ? (
          <div className="hidden md:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer group relative">
            <div className="text-xs leading-tight">
              <div className="text-gray-300">Hello, {user.name.split(' ')[0]}</div>
              <div className="font-bold flex items-center gap-0.5">Account & Lists <ChevronDown size={12} /></div>
            </div>
            <div className="absolute top-full right-0 hidden group-hover:block bg-white text-navy shadow-lg rounded-sm py-2 w-40 mt-1">
              <Link to="/orders" className="block px-3 py-1.5 text-sm hover:bg-gray-100">Your Orders</Link>
              <button onClick={logout} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100">Sign out</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="hidden md:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
            <div className="text-xs leading-tight">
              <div className="text-gray-300">Hello, sign in</div>
              <div className="font-bold flex items-center gap-0.5">Account & Lists <ChevronDown size={12} /></div>
            </div>
          </Link>
        )}

        <Link to="/orders" className="hidden md:flex flex-col text-xs leading-tight px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
          <span className="text-gray-300">Returns</span>
          <span className="font-bold">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="flex items-end gap-1 px-2 py-1 border border-transparent hover:border-white rounded-sm relative">
          <ShoppingCart size={30} />
          <span className="absolute top-0 left-4 text-accent-orange font-bold text-sm">{itemCount}</span>
          <span className="font-bold hidden sm:inline">Cart</span>
        </Link>
      </div>

      {/* Category strip */}
      <div className="bg-navy-light text-white text-sm flex items-center gap-4 px-3 py-1.5 overflow-x-auto">
        <span className="flex items-center gap-1 font-bold cursor-pointer hover:outline hover:outline-1 hover:outline-white px-1 shrink-0">
          <Menu size={18} /> All
        </span>
        {categories.map(c => (
          <span
            key={c}
            onClick={() => navigate(`/?category=${encodeURIComponent(c)}`)}
            className="cursor-pointer hover:outline hover:outline-1 hover:outline-white px-1 whitespace-nowrap shrink-0"
          >
            {c}
          </span>
        ))}
      </div>
    </header>
  )
}
