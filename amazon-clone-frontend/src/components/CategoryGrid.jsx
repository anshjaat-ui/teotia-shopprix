const tiles = [
  { title: 'Home & Living', img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=600&auto=format&fit=crop' },
  { title: 'Audio & Sound', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' },
  { title: 'Fashion', img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=600&auto=format&fit=crop' },
  { title: 'Gaming', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop' },
]

export default function CategoryGrid() {
  return (
    <div className="bg-luxe-bg px-4 py-8">
      <h2 className="text-white text-lg font-semibold mb-4 max-w-7xl mx-auto">Shop by Category</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {tiles.map(t => (
          <div
            key={t.title}
            className="relative rounded-lg overflow-hidden border border-gold/20 group cursor-pointer transition-all hover:border-gold/60 hover:shadow-goldGlow"
          >
            <img src={t.img} alt={t.title} loading="lazy" className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
              <span className="text-white text-sm font-medium">{t.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
