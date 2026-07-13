import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (category) params.set('category', category)

    api
      .get(`/products?${params.toString()}`)
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [keyword, category])

  const heading = keyword
    ? `Results for "${keyword}"`
    : category
    ? category
    : "Today's Deals for you"

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4">{heading}</h2>

      {loading && <p className="text-gray-500 text-sm">Loading products...</p>}

      {error && (
        <p className="text-sm text-price">
          Products load nahi ho paaye. Backend chal raha hai aur VITE_API_URL sahi hai? ({error})
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">
          Koi product nahi mila. Backend mein <code>npm run seed</code> chalao ya search badlo.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  )
}
