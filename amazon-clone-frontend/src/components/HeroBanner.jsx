import { useNavigate } from 'react-router-dom'

export default function HeroBanner() {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden bg-luxe-bg">
      <img
        src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1600&auto=format&fit=crop"
        alt="Luxury shopping banner"
        loading="lazy"
        className="w-full h-[320px] md:h-[440px] object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-luxe-bg via-luxe-bg/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]">
          Shop More, <span className="text-gold">Save More</span>, Smile More
        </h1>
        <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-md">
          Curated picks across electronics, fashion, home & more — delivered fast.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blush-gradient text-white font-semibold px-8 py-3 rounded-full text-sm shadow-goldGlow hover:opacity-90 transition-opacity"
        >
          Explore Now
        </button>
      </div>
    </div>
  )
}
