import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
    <section className="bg-luxe-bg px-3 sm:px-5 py-7 sm:py-9">
      <div className="max-w-[1440px] mx-auto rounded-2xl sm:rounded-3xl border border-[#E9E4EF] bg-white px-4 sm:px-7 py-7 sm:py-9 shadow-sm">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gold font-bold mb-1">Explore the store</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">SHOP BY CATEGORY</h2>
            <p className="text-sm text-slate-500 mt-1">Discover your favourite categories in one place.</p>
          </div>
          <button onClick={() => navigate('/')} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-light">
            View all <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="shrink-0 w-28 h-36 rounded-xl bg-[#F7F1FB] animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-slate-500">Categories abhi available nahi hain.</p>
        ) : (
          <div className="flex gap-5 sm:gap-7 overflow-x-auto category-scroll pb-2">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => navigate(`/?category=${encodeURIComponent(category.name)}`)}
                className="group shrink-0 w-[88px] sm:w-[112px] flex flex-col items-center gap-3 text-center"
                aria-label={`Shop ${category.name}`}
              >
                <span className="w-[76px] h-[76px] sm:w-[96px] sm:h-[96px] rounded-full bg-[#F7F1FB] border-2 border-gold/15 flex items-center justify-center text-4xl sm:text-5xl shadow-sm group-hover:border-gold/50 group-hover:shadow-goldGlow group-hover:-translate-y-1 transition-all">
                  {category.emoji || '🛍️'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700 leading-tight group-hover:text-gold">
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
