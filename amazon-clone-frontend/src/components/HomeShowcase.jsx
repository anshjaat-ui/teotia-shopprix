import { useEffect, useState } from 'react'
import { ArrowRight, Flame, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from './ProductCard'

function Section({ title, subtitle, icon: Icon, products, linkText, linkTo }) {
  if (!products.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-full bg-[#481F72]/8 text-[#481F72] flex items-center justify-center shrink-0"><Icon size={19} /></span>
          <div><h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2><p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p></div>
        </div>
        {linkTo && <Link to={linkTo} className="text-xs sm:text-sm font-semibold text-[#481F72] inline-flex items-center gap-1 hover:underline shrink-0">{linkText} <ArrowRight size={15} /></Link>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">{products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}</div>
    </section>
  )
}

export default function HomeShowcase() {
  const [products, setProducts] = useState([])
  useEffect(() => { api.get('/products').then((data) => setProducts(data.products || [])).catch(() => setProducts([])) }, [])

  const unique = products.filter((p, i, all) => all.findIndex((x) => (x.name || '').trim().toLowerCase() === (p.name || '').trim().toLowerCase()) === i)
  const discounted = [...unique].filter((p) => p.mrp > p.price).sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp))
  const best = [...unique].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
  const fresh = [...unique].slice(-4).reverse()

  return <>
    <Section title="Deals of the Day" subtitle="Big savings on products worth checking out" icon={Flame} products={discounted} linkText="View all deals" linkTo="/" />
    <Section title="Best Sellers" subtitle="Popular picks shoppers are checking out" icon={Sparkles} products={best} linkText="Shop more" linkTo="/" />
    <Section title="New Arrivals" subtitle="Fresh products added to the store" icon={Sparkles} products={fresh} linkText="Explore" linkTo="/" />
  </>
}
