import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  return (
    <main className="bg-luxe-bg min-h-screen">
      <HeroSlider />
      <CategoryGrid />
      <ProductGrid />
    </main>
  )
}
