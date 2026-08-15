import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

const fallbackGallery = [
  { id: 'home', title: 'Home & Living', tag: 'Home', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200&auto=format&fit=crop' },
  { id: 'audio', title: 'Audio & Sound', tag: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop' },
  { id: 'fashion', title: 'Fashion Picks', tag: 'Fashion', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop' },
  { id: 'gaming', title: 'Gaming Setup', tag: 'Gaming', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop' },
  { id: 'lifestyle', title: 'Everyday Essentials', tag: 'Lifestyle', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop' },
  { id: 'trending', title: 'Fresh Finds', tag: 'Trending', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop' },
]

export default function Gallery() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let mounted = true
    api.get('/products')
      .then((data) => mounted && setProducts(Array.isArray(data?.products) ? data.products : []))
      .catch(() => mounted && setProducts([]))
    return () => { mounted = false }
  }, [])

  const productItems = useMemo(() => {
    const result = []
    const seenImages = new Set()
    for (const product of products) {
      const images = Array.isArray(product?.images) ? product.images : []
      images.slice(0, 4).forEach((image, index) => {
        if (!image || seenImages.has(image)) return
        seenImages.add(image)
        result.push({
          id: `${product._id || product.name || 'product'}-${index}`,
          image,
          title: product.name || 'Product',
          tag: product.category || 'Shop',
          productId: product._id,
          price: product.price,
        })
      })
    }
    return result
  }, [products])

  const items = productItems.length ? productItems : fallbackGallery
  const tags = ['All', ...Array.from(new Set(items.map((item) => item.tag).filter(Boolean))).slice(0, 10)]
  const filtered = filter === 'All' ? items : items.filter((item) => item.tag === filter)

  function move(direction) {
    if (!selected || filtered.length < 2) return
    const currentIndex = filtered.findIndex((item) => item.id === selected.id)
    const nextIndex = (currentIndex + direction + filtered.length) % filtered.length
    setSelected(filtered[nextIndex])
  }

  useEffect(() => {
    if (!selected) return undefined
    function onKeyDown(event) {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, filtered])

  return (
    <main className="bg-luxe-bg min-h-screen">
      <section className="bg-gradient-to-br from-[#351652] via-[#481F72] to-[#6c369e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <p className="text-sm font-semibold text-white/75">📸 TEOTIA SHOPPRIX</p>
          <h1 className="text-3xl sm:text-5xl font-bold mt-2">Explore. Discover. Shop.</h1>
          <p className="mt-3 text-white/80 max-w-2xl">Browse our visual collection and open any image to explore the product.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${filter === tag ? 'bg-[#481F72] text-white border-[#481F72]' : 'bg-white text-slate-700 border-slate-200 hover:border-[#481F72]'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 text-left shadow-sm hover:shadow-lg transition-shadow"
            >
              <img src={item.image} alt={item.title} loading="lazy" className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
                <p className="text-[11px] uppercase tracking-wide text-white/70">{item.tag}</p>
                <p className="font-semibold line-clamp-2">{item.title}</p>
                {item.price != null && <p className="text-sm font-bold mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>}
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/85 p-4 flex items-center justify-center" onClick={() => setSelected(null)}>
          <button type="button" onClick={() => setSelected(null)} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white flex items-center justify-center" aria-label="Close">
            <X />
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(-1) }} className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white flex items-center justify-center" aria-label="Previous">
            <ChevronLeft />
          </button>
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="max-h-[72vh] max-w-full object-contain rounded-xl" />
            <div className="bg-white rounded-xl p-4 mt-4 w-full max-w-xl flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">{selected.tag}</p>
                <p className="font-bold text-slate-900 truncate">{selected.title}</p>
                {selected.price != null && <p className="font-bold text-[#481F72]">₹{Number(selected.price).toLocaleString('en-IN')}</p>}
              </div>
              {selected.productId && (
                <Link to={`/product/${selected.productId}`} onClick={() => setSelected(null)} className="shrink-0 bg-[#481F72] text-white rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
                  Shop Now <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(1) }} className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white flex items-center justify-center" aria-label="Next">
            <ChevronRight />
          </button>
        </div>
      )}
    </main>
  )
}
