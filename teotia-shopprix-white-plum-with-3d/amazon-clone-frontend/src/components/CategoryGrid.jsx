import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function CategoryGrid() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const all = await api.get('/categories')
        const roots = (all || []).filter((c) => !c.parent)
        const enriched = await Promise.all(roots.map(async (category) => {
          try {
            const data = await api.get(`/products?category=${encodeURIComponent(category.name)}&page=1`)
            return { ...category, image: data.products?.[0]?.images?.[0] || '' }
          } catch {
            return { ...category, image: '' }
          }
        }))
        if (!cancelled) setCategories(enriched)
      } catch {
        if (!cancelled) setCategories([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="bg-white px-3 sm:px-6 lg:px-10 py-7 sm:py-9">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="hidden sm:block h-px w-14 bg-[#e52b59]" />
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl tracking-wide text-slate-900">SHOP BY CATEGORY</h2>
            <span className="block text-[#e52b59] text-lg leading-none mt-0.5">⌁</span>
          </div>
          <span className="hidden sm:block h-px w-14 bg-[#e52b59]" />
        </div>

        {loading ? (
          <div className="flex justify-center gap-7 sm:gap-10 overflow-hidden py-2">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="shrink-0 w-24 sm:w-32 flex flex-col items-center gap-3"><div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#fff3f6] animate-pulse" /><div className="w-16 h-3 rounded bg-[#f4e9ed] animate-pulse" /></div>)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-slate-500">Categories abhi available nahi hain.</p>
        ) : (
          <div className="flex gap-7 sm:gap-10 overflow-x-auto category-scroll pb-2 justify-start lg:justify-center">
            {categories.map((category) => (
              <button key={category._id} type="button" onClick={() => navigate(`/?category=${encodeURIComponent(category.name)}`)} className="group shrink-0 w-[92px] sm:w-[125px] flex flex-col items-center gap-3 text-center" aria-label={`Shop ${category.name}`}>
                <span className="w-[88px] h-[88px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden bg-[#fff1f4] border-[3px] border-[#f7dce3] flex items-center justify-center shadow-sm group-hover:border-[#e52b59] group-hover:shadow-lg group-hover:-translate-y-1 transition-all">
                  {category.image ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" /> : <span className="text-4xl">{category.emoji || '🛍️'}</span>}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight group-hover:text-[#e52b59]">{category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
