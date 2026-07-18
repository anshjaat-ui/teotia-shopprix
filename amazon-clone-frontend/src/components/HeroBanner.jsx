import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const fallback = {
  heading: 'Shop More, Save More, Smile More',
  subheading: 'Curated picks across electronics, fashion, home & more — delivered fast.',
  ctaText: 'Explore Now',
  bannerImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1600&auto=format&fit=crop',
  highlights: [],
}

export default function HeroBanner() {
  const navigate = useNavigate()
  const [hero, setHero] = useState(fallback)

  useEffect(() => {
    api.get('/settings/hero').then(setHero).catch(() => setHero(fallback))
  }, [])

  return (
    <div className="relative overflow-hidden bg-luxe-bg">
      <img
        src={hero.bannerImage}
        alt="Store banner"
        loading="lazy"
        className="w-full h-[320px] md:h-[440px] object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-luxe-bg via-luxe-bg/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]">
          {hero.heading}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base mb-4 max-w-md">
          {hero.subheading}
        </p>

        {hero.highlights?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {hero.highlights.map((h, i) => (
              <span key={i} className="text-xs bg-white/10 border border-gold/30 text-gold px-3 py-1 rounded-full">
                {h}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="bg-blush-gradient text-white font-semibold px-8 py-3 rounded-full text-sm shadow-goldGlow hover:opacity-90 transition-opacity"
        >
          {hero.ctaText}
        </button>
      </div>
    </div>
  )
}
