import { useState, useRef } from 'react'
import { Star, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'

export default function ProductCard({ product }) {
  const { name, price, mrp, rating = 0, numReviews = 0, images, _id, stock } = product
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0
  const img = images?.[0]

  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

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
      showToast('Added to cart')
      setTimeout(() => setAdded(false), 1500)
    } catch (err) {
      showToast(err.message || 'Could not add to cart', 'error')
    } finally {
      setAdding(false)
    }
  }

  async function handleWishlist(e) {
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: '/' } })
      return
    }
    setWishBusy(true)
    try {
      const added = await toggle(_id)
      showToast(added ? 'Added to wishlist' : 'Removed from wishlist')
    } catch (err) {
      showToast(err.message || 'Wishlist update failed. Try again.', 'error')
    } finally {
      setWishBusy(false)
    }
  }

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 })
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 })
  }

  const wishlisted = isWishlisted(_id)

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/product/${_id}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative bg-luxe-panel border border-gold/20 rounded-lg p-3 flex flex-col cursor-pointer hover:shadow-goldGlowLg hover:border-gold/50"
    >
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-blush-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </span>
      )}
      <button
        onClick={handleWishlist}
        disabled={wishBusy}
        aria-label="Wishlist"
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"
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

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-lg font-semibold text-white">₹{price.toLocaleString('en-IN')}</span>
        {mrp && <span className="text-xs text-gray-500 line-through">₹{mrp.toLocaleString('en-IN')}</span>}
      </div>

      {stock > 0 && stock <= 5 && (
        <p className="text-xs text-blush-from font-medium mb-2">Only {stock} left!</p>
      )}
      {stock === 0 && (
        <p className="text-xs text-gray-500 font-medium mb-2">Out of stock</p>
      )}

      <button
        onClick={handleAddToCart}
        disabled={adding || stock === 0}
        className="mt-auto bg-gold hover:bg-gold-light hover:scale-[1.02] text-black text-sm font-semibold py-2.5 rounded-full disabled:opacity-60 disabled:hover:scale-100 transition-all"
      >
        {added ? 'Added ✓' : adding ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
