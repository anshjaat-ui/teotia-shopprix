import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

const fallbackGallery = [
  { title: 'Home & Living', tag: 'Home', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Audio & Sound', tag: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Fashion Picks', tag: 'Fashion', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Gaming Setup', tag: 'Gaming', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Everyday Essentials', tag: 'Lifestyle', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Fresh Finds', tag: 'Trending', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop' },
]

export default function Gallery() {
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/products').then((data) => setProducts(data.products || [])).catch(() => setProducts([]))
  }, [])

  const productItems = useMemo(() => products.flatMap((p) => (p.images || []).slice(0, 3).map((image, i) => ({
    id: `${p._id}-${i}`,
    image,
    title: p.name,
    tag: p.category || 'Shop',
    productId: p._id,
    price: p.price,
  }))).filter((item, index, all) => all.findIndex((x) => x.image === item.image) === index), [products])

  const items = productItems.length ? productItems : fallbackGallery.map((x, i) => ({ ...x, id: `fallback-${i}` }))
  const tags = ['All', ...Array.from(new Set(items.map((x) => x.tag).filter(Boolean))).slice(0, 10)]
  const filtered = filter === 'All' ? items : items.filter((x) => x.tag === filter)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowLeft') move(-1)
      if (e.key === 'ArrowRight') move(1)
    }
    if (selected) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, filtered])

  function move(direction) {
    if (!selected) return
    const index = filtered.findIndex((x) => x.id === selected.id)
    const next = (index + direction + filtered.length) % filtered.length
    setSelected(filtered[next])
  }

  return (
    <main className="bg-luxe-bg min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#351652] via-[#481F72] to-[#6c369e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold mb-4">
              <ImageIcon size={14} /> Teotia Gallery
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Explore. Discover. Shop.</h1>
            <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">A visual collection of products, trends and everyday finds from Teotia Shopprix.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Shop the Gallery</h2>
            <p className="text-sm text-slate-500 mt-1">Tap any image to preview it, then shop the product.</p>
          </div>
          <Link to="/" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#481F72] hover:underline">Continue shopping <ArrowRight size={16} /></Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tags.map((tag) => (
            <button key={tag} onClick={() => setFilter(tag)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold border transition ${filter === tag ? 'bg-[#481F72] text-white border-[#481F72]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#481F72]/40'}`}>
              {tag}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 mt-5 [column-fill:_balance]">
          {filtered.map((item, index) => (
            <button key={item.id} onClick={() => setSelected(item)} className="group relative mb-4 block w-full overflow-hidden rounded-2xl bg-white text-left shadow-sm border border-slate-100 break-inside-avoid focus:outline-none focus:ring-2 focus:ring-[#481F72]">
              <img src={item.image} alt={item.title} loading={index < 6 ? 'eager' : 'lazy'} className="w-full h-auto min-h-40 object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-14 text-white">
                <p className="text-[10px] uppercase tracking-wider text-white/70">{item.tag}</p>
                <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                {item.price && <p className="text-xs mt-1 font-bold">₹{Number(item.price).toLocaleString('en-IN')}</p>}
              </div>
              <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#481F72] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><ExternalLink size={16} /></span>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/85 p-4 sm:p-8 flex items-center justify-center" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-slate-800 flex items-center justify-center" aria-label="Close gallery"><X /></button>
          <button onClick={(e) => { e.stopPropagation(); move(-1) }} className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/90 text-slate-800 flex items-center justify-center" aria-label="Previous image"><ChevronLeft /></button>
          <div className="max-w-5xl max-h-[88vh] relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-2xl" />
            <div className="mt-4 w-full max-w-xl bg-white rounded-xl p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{selected.tag}</p>
                <h3 className="font-bold text-slate-900 truncate">{selected.title}</h3>
                {selected.price && <p className="text-[#481F72] font-bold mt-1">₹{Number(selected.price).toLocaleString('en-IN')}</p>}
              </div>
              {selected.productId && <Link to={`/product/${selected.productId}`} onClick={() => setSelected(null)} className="shrink-0 bg-[#481F72] text-white rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">Shop now <ArrowRight size={15} /></Link>}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); move(1) }} className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/90 text-slate-800 flex items-center justify-center" aria-label="Next image"><ChevronRight /></button>
        </div>
      )}
    </main>
  )
}
