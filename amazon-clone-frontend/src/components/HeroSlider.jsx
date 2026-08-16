import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../api/client'

const fallbackSlide = {
  type: 'image',
  url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1600&auto=format&fit=crop',
  heading: 'Shop More, Save More, Smile More',
  subheading: 'Curated picks across categories — delivered fast.',
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([fallbackSlide])
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    api.get('/banners').then((data) => {
      if (data.length > 0) setSlides(data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    clearInterval(timerRef.current)
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4500)
    return () => clearInterval(timerRef.current)
  }, [slides])

  function goTo(i) {
    setIndex(i)
    clearInterval(timerRef.current)
  }
  function prev() {
    goTo((index - 1 + slides.length) % slides.length)
  }
  function next() {
    goTo((index + 1) % slides.length)
  }

  const slide = slides[index]

  return (
    <div className="relative overflow-hidden bg-white h-[260px] sm:h-[320px] md:h-[420px]">
      {slide.type === 'video' ? (
        <video
          key={slide.url}
          src={slide.url}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={slide.url}
          src={slide.url}
          alt={slide.heading || 'Banner'}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-gold hover:bg-[#FEA3B6]/25">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-gold hover:bg-[#FEA3B6]/25">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-gold' : 'bg-[#481F72]/20'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
