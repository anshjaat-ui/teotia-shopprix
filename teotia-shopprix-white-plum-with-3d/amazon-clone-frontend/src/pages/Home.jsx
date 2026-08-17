import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import SubcategoryBar from '../components/SubcategoryBar'
import ProductGrid from '../components/ProductGrid'
import ProductCarousel from '../components/ProductCarousel'
import { api } from '../api/client'

export default function Home() {
  const [searchParams] = useSearchParams()
  const hasCategory = !!searchParams.get('category')
  const hasSearch = !!searchParams.get('keyword') || !!searchParams.get('subcategory')
  const [trending, setTrending] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loadingAll, setLoadingAll] = useState(true)

  useEffect(() => {
    if (hasCategory || hasSearch) return

    let cancelled = false

    api.get('/products/trending')
      .then((data) => {
        if (!cancelled) setTrending(data.products || [])
      })
      .catch(() => {
        if (!cancelled) setTrending([])
      })

    const loadAllProducts = async () => {
      try {
        const first = await api.get('/products?page=1')
        const products = [...(first.products || [])]
        const pages = Number(first.pages) || 1

        for (let page = 2; page <= pages; page += 1) {
          const data = await api.get(`/products?page=${page}`)
          products.push(...(data.products || []))
        }

        if (!cancelled) setAllProducts(products)
      } catch {
        if (!cancelled) setAllProducts([])
      } finally {
        if (!cancelled) setLoadingAll(false)
      }
    }

    loadAllProducts()

    return () => { cancelled = true }
  }, [hasCategory, hasSearch])

  if (hasCategory || hasSearch) {
    return (
      <main className="bg-luxe-bg min-h-screen">
        <SubcategoryBar />
        <ProductGrid />
      </main>
    )
  }

  return (
    <main className="bg-luxe-bg min-h-screen">
      <HeroSlider />
      <CategoryGrid />
      <SubcategoryBar />

      <ProductCarousel
        title="Trending Now"
        subtitle="Top discounts · Most viewed · High-stock picks"
        products={trending}
        speed={34}
      />

      <ProductCarousel
        title="All Products"
        subtitle="Browse the complete store — drag, swipe or use the arrows"
        products={allProducts}
        speed={24}
        reverse
      />

      {loadingAll && (
        <div className="max-w-7xl mx-auto px-4 pb-8 text-sm text-slate-500">Loading all products...</div>
      )}
    </main>
  )
}
