import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import SubcategoryBar from '../components/SubcategoryBar'
import ProductGrid from '../components/ProductGrid'
import TrustStrip from '../components/TrustStrip'
import HomeShowcase from '../components/HomeShowcase'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Camera } from 'lucide-react'

export default function Home() {
  const [searchParams] = useSearchParams()
  const hasCategory = !!searchParams.get('category')
  const hasSearch = !!searchParams.get('keyword')

  return (
    <main className="bg-luxe-bg min-h-screen">
      {!hasCategory && !hasSearch && (
        <>
          <HeroSlider />
          <TrustStrip />
          <CategoryGrid />
          <HomeShowcase />
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#351652] via-[#481F72] to-[#6c369e] px-6 sm:px-10 py-8 text-white shadow-goldGlowLg">
              <div className="relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/10 border border-white/20 rounded-full px-3 py-1.5"><Camera size={14} /> Teotia Gallery</div>
                <h2 className="text-2xl sm:text-3xl font-bold mt-3">See what is trending. Then shop it.</h2>
                <p className="text-white/75 text-sm mt-2">Explore product photos, discover new finds and jump straight to the product page.</p>
                <Link to="/gallery" className="inline-flex items-center gap-2 mt-5 bg-white text-[#481F72] rounded-full px-5 py-2.5 text-sm font-bold hover:scale-[1.02] transition">Open Gallery <ArrowRight size={16} /></Link>
              </div>
              <div className="absolute -right-16 -bottom-24 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute right-20 -top-24 w-48 h-48 rounded-full bg-white/10" />
            </div>
          </section>
        </>
      )}
      <SubcategoryBar />
      <ProductGrid />
    </main>
  )
}
