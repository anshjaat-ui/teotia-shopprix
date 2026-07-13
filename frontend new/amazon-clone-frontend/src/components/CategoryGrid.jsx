const tiles = [
  {
    title: 'Revamp your home in style',
    cta: 'Shop now',
    img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Top deals on headphones',
    cta: 'See more',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Refresh your wardrobe',
    cta: 'Explore fashion',
    img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Get your game on',
    cta: 'Shop gaming',
    img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop',
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 -mt-24 relative z-10 max-w-7xl mx-auto">
      {tiles.map(t => (
        <div key={t.title} className="bg-white p-4 shadow-card rounded-sm">
          <h3 className="font-bold text-lg mb-3">{t.title}</h3>
          <img src={t.img} alt={t.title} className="w-full h-40 object-cover mb-3" />
          <button className="text-link text-sm hover:underline hover:text-price">{t.cta}</button>
        </div>
      ))}
    </div>
  )
}
