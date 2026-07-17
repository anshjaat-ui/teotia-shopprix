import { useState } from 'react'
import { Star, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { name, price, mrp, rating = 0, numReviews = 0, images, _id } = product
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0
  const img = images?.[0]

  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  async function handleAddToCart(e) {
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: '/' } })
      return
    }
    setAdding(true)
    try {
      await addToCart(_id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } finally {
      setAdding(false)
    }
  }

  function handleWishlist(e) {
    e.stopPropagation()
    setWishlisted(!wishlisted)
  }

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="relative bg-luxe-panel border border-gold/20 rounded-lg p-3 flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-goldGlowLg hover:border-gold/50"
    >
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-blush-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      )}
      <button
        onClick={handleWishlist}
        aria-label="Wishlist"
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
      >
        <Heart size={16} className={wishlisted ? 'fill-blush-from text-blush-from' : 'text-gray-300'} />
      </button>

      <img src={img} alt={name} loading="lazy" className="h-40 object-contain mb-3 bg-white rounded" />
      <p className="text-sm text-gray-200 line-clamp-2 mb-1">{name}</p>

      <div className="flex items-center gap-1 mb-1">
        <div className="flex text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} fill={i < Math.round(rating) ? '#D4AF37' : 'none'} strokeWidth={1} />
          ))}
        </div>
        <span className="text-xs text-gray-500">({numReviews.toLocaleString('en-IN')})</span>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-lg font-semibold text-white">₹{price.toLocaleString('en-IN')}</span>
        {mrp && <span className="text-xs text-gray-500 line-through">₹{mrp.toLocaleString('en-IN')}</span>}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="mt-auto bg-gold hover:bg-gold-light text-black text-sm font-semibold py-2.5 rounded-full disabled:opacity-60 transition-colors"
      >
        {added ? 'Added ✓' : adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}
