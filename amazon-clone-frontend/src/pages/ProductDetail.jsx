import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    api
      .get(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    setAdding(true)
    try {
      await addToCart(product._id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <main className="bg-luxe-bg min-h-[70vh] flex items-center justify-center text-gray-400">Loading product...</main>
  }

  if (error || !product) {
    return (
      <main className="bg-luxe-bg min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-400">
        <p>Product nahi mila.</p>
        <button onClick={() => navigate('/')} className="text-gold hover:underline text-sm">Home pe wapas jao</button>
      </main>
    )
  }

  const { name, description, price, mrp, rating = 0, numReviews = 0, images = [], stock, category, brand } = product
  const discount = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0

  return (
    <main className="bg-luxe-bg min-h-[70vh] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg overflow-hidden mb-3 aspect-square flex items-center justify-center">
            <img src={images[activeImg]} alt={name} className="max-h-full max-w-full object-contain" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-md overflow-hidden bg-white border-2 ${
                    activeImg === i ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {category && <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{category}{brand ? ` · ${brand}` : ''}</p>}
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">{name}</h1>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(rating) ? '#D4AF37' : 'none'} strokeWidth={1} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({numReviews.toLocaleString('en-IN')} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-white">₹{price.toLocaleString('en-IN')}</span>
            {mrp > price && (
              <>
                <span className="text-gray-500 line-through text-sm">₹{mrp.toLocaleString('en-IN')}</span>
                <span className="text-green-400 text-sm font-medium">{discount}% off</span>
              </>
            )}
          </div>

          <p className={`text-sm mb-4 ${stock > 0 ? 'text-green-400' : 'text-blush-from'}`}>
            {stock > 0 ? `In stock (${stock} available)` : 'Out of stock'}
          </p>

          <p className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-line">{description}</p>

          <button
            onClick={handleAddToCart}
            disabled={adding || stock === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black font-semibold px-8 py-3 rounded-full text-sm disabled:opacity-50 transition-colors"
          >
            <ShoppingCart size={18} />
            {added ? 'Added to Cart ✓' : adding ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <div className="grid grid-cols-3 gap-3 mt-8 text-center">
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Truck size={20} className="text-gold" />
              <span className="text-xs">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <RotateCcw size={20} className="text-gold" />
              <span className="text-xs">7-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ShieldCheck size={20} className="text-gold" />
              <span className="text-xs">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
