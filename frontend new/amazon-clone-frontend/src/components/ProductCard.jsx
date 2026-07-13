import { useState } from 'react'
import { Star } from 'lucide-react'
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

  async function handleAddToCart() {
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

  return (
    <div className="bg-white rounded-sm shadow-card p-3 flex flex-col hover:shadow-lg transition-shadow">
      <img src={img} alt={name} className="h-40 object-contain mb-3" />
      <p className="text-sm line-clamp-2 mb-1">{name}</p>

      <div className="flex items-center gap-1 mb-1">
        <div className="flex text-accent-orange">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < Math.round(rating) ? '#ff9900' : 'none'} strokeWidth={1} />
          ))}
        </div>
        <span className="text-xs text-link">{numReviews.toLocaleString('en-IN')}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs align-top">₹</span>
        <span className="text-xl font-medium">{price.toLocaleString('en-IN')}</span>
        {mrp && (
          <>
            <span className="text-xs text-gray-500 line-through">₹{mrp.toLocaleString('en-IN')}</span>
            <span className="text-xs text-green-700">{discount}% off</span>
          </>
        )}
      </div>

      <p className="text-xs text-gray-600 mb-3">Free delivery by tomorrow</p>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="mt-auto bg-accent hover:bg-accent-orange text-sm font-medium py-1.5 rounded-full border border-accent-orange/40 disabled:opacity-60"
      >
        {added ? 'Added ✓' : adding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  )
}
