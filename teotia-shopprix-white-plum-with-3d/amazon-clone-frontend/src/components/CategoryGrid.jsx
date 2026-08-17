import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function CategoryGrid() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories')
      .then((data) => setCategories((data || []).filter((c) => !c.parent)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-luxe-bg px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold mb-1">Explore</p>
            <h2 className="text-slate-900 text-xl font-bold">Shop by Category</h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">Choose a category to start shopping</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-500">Categories abhi available nahi hain.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => navigate(`/?category=${encodeURIComponent(category.name)}`)}
                className="group min-h-[112px] rounded-xl border border-[#E9E4EF] bg-white px-2 py-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-gold/50 hover:-translate-y-0.5"
                aria-label={`Shop ${category.name}`}
              >
                <span className="w-14 h-14 rounded-full bg-[#F7F1FB] border border-gold/15 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {category.emoji || '🛍️'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center leading-tight group-hover:text-gold">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
