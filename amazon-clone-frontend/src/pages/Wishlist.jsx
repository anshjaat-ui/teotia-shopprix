import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function Wishlist() {
  const { products, toggle } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  if (products.length === 0) {
    return (
      <main className="bg-luxe-bg min-h-[60vh] flex flex-col items-center justify-center gap-3 font-sans">
        <Heart size={40} className="text-gray-600" />
        <p className="text-gray-400">Your wishlist is empty.</p>
        <Link to="/" className="bg-gold hover:bg-gold-light px-6 py-1.5 rounded-full text-sm font-medium border border-gold/40">
          Continue shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="bg-luxe-bg min-h-[70vh] font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-4">Your Wishlist ({products.length})</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)}
              className="relative bg-luxe-panel border border-gold/20 rounded-lg p-3 flex flex-col cursor-pointer hover:border-gold/50"
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggle(p._id) }}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
              >
                <Heart size={16} className="fill-blush-from text-blush-from" />
              </button>
              <img src={p.images?.[0]} alt={p.name} className="h-40 object-contain mb-3 bg-white rounded" />
              <p className="text-sm text-gray-200 line-clamp-2 mb-2">{p.name}</p>
              <p className="text-lg font-semibold text-white mb-2">₹{p.price.toLocaleString('en-IN')}</p>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(p._id, 1) }}
                className="mt-auto bg-gold hover:bg-gold-light text-black text-sm font-semibold py-2 rounded-full"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
