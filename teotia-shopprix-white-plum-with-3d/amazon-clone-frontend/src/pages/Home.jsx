import HeroSlider from '../components/HeroSlider'
import CategoryGrid from '../components/CategoryGrid'
import SubcategoryBar from '../components/SubcategoryBar'
import ProductGrid from '../components/ProductGrid'
import { useSearchParams } from 'react-router-dom'

export default function Home() {
  const [searchParams] = useSearchParams()
  const hasCategory = !!searchParams.get('category')

  return (
    <main className="bg-luxe-bg min-h-screen">
      {!hasCategory && (
        <>
          <HeroSlider />
          <CategoryGrid />
        </>
      )}
      <SubcategoryBar />
      <ProductGrid />
    </main>
  )
}
