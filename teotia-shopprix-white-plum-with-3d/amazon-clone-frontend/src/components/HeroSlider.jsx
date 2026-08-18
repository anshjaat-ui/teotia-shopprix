import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, BadgeIndianRupee, Zap, Headphones } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const fallbackSlide = {
  type: 'image',
  url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1800&auto=format&fit=crop',
  heading: 'NEW COLLECTION',
  subheading: 'LADIES SUITS',
  description: 'Elegant Designs | Premium Fabrics | Perfect for Every Occasion',
}

const trustItems = [
  { icon: BadgeIndianRupee, title: 'Premium Quality', text: 'Carefully selected products' },
  { icon: Zap, title: 'Best Prices', text: 'Great value every day' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'Safe & trusted checkout' },
  { icon: Truck, title: 'Fast Delivery', text: 'Quick doorstep delivery' },
  { icon: Headphones, title: 'Customer Support', text: 'We are here to help' },
]

export default function HeroSlider() {
  const navigate = useNavigate()
  const [slides, setSlides] = useState([fallbackSlide])
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    api.get('/banners').then((data) => {
      if (Array.isArray(data) && data.length > 0) setSlides(data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    clearInterval(timerRef.current)
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [slides])

  function goTo(i) {
    setIndex(i)
    clearInterval(timerRef.current)
  }
  function prev() { goTo((index - 1 + slides.length) % slides.length) }
  function next() { goTo((index + 1) % slides.length) }

  const slide = slides[index] || fallbackSlide
  const heading = slide.heading || 'NEW COLLECTION'
  const subheading = slide.subheading || 'LADIES SUITS'
  const description = slide.description || 'Elegant Designs | Premium Fabrics | Perfect for Every Occasion'

  return (
    <section className="bg-luxe-bg">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 pt-4 sm:pt-5">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[390px] sm:min-h-[440px] lg:min-h-[500px] bg-white border border-[#E9E4EF] shadow-goldGlow">
          {slide.type === 'video' ? (
            <video key={slide.url} src={slide.url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <img key={slide.url} src={slide.url} alt={heading} loading="eager" className="absolute inset-0 w-full h-full object-cover" />
          )}


          <div className="relative z-10 h-full min-h-[390px] sm:min-h-[440px] lg:min-h-[500px] flex items-center px-6 sm:px-10 lg:px-16 py-10">
            <div className="max-w-2xl rounded-2xl bg-white/92 border border-white/80 shadow-lg px-5 py-5 sm:px-7 sm:py-6">
              <p className="mt-1 text-sm sm:text-base font-bold tracking-[0.22em] text-blush-from">{heading}</p>
              <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[0.98]">
                {subheading}
              </h1>
              <p className="mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-slate-600">
                {description}
              </p>
              <button
                onClick={() => navigate('/?category=Fashion')}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-blush-gradient px-7 py-3.5 text-sm font-bold text-white shadow-goldGlowLg hover:scale-[1.02]"
              >
                SHOP NOW <ArrowRight size={17} />
              </button>
            </div>

            <div className="hidden lg:block absolute right-8 xl:right-12 top-1/2 -translate-y-1/2 w-[260px] xl:w-[290px] rounded-2xl border border-white/70 bg-white/95 p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Special Delivery Offer</p>
              <p className="mt-3 text-3xl font-black text-slate-900 leading-tight">FREE DELIVERY</p>
              <p className="mt-2 text-base font-semibold text-slate-600">On Orders Above ₹999</p>
              <div className="mt-5 h-px bg-[#E9E4EF]" />
              <p className="mt-4 text-sm text-slate-500">Shop your favourites and enjoy convenient doorstep delivery.</p>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous banner" className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-white shadow-md flex items-center justify-center text-gold hover:bg-white">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} aria-label="Next banner" className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-white shadow-md flex items-center justify-center text-gold hover:bg-white">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)} aria-label={`Banner ${i + 1}`} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-gold w-7' : 'bg-white/80'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-3 sm:py-4">
          {[
            ['⚡', 'Today’s Deals', 'Grab the best offers', '#trending'],
            ['🔥', 'Best Sellers', 'What shoppers love', '#trending'],
            ['✨', 'Explore Store', 'See every product', '#all-products'],
            ['🎁', 'Special Schemes', 'Extra savings for you', '/schemes'],
          ].map(([icon, title, text, target]) => (
            <button
              key={title}
              type="button"
              onClick={() => {
                if (target.startsWith('#')) document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                else navigate(target)
              }}
              className="group text-left rounded-2xl border border-gold/15 bg-white px-4 py-4 flex items-center gap-3 shadow-sm hover:shadow-goldGlow hover:-translate-y-0.5 transition-all"
            >
              <span className="w-11 h-11 rounded-full bg-[#F7F1FB] border border-gold/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">{icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-slate-900 truncate">{title}</span>
                <span className="block text-xs text-slate-500 mt-0.5 truncate">{text}</span>
              </span>
              <ArrowRight size={16} className="ml-auto shrink-0 text-gold group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 py-5 sm:py-6">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border border-[#E9E4EF] bg-white px-3 py-3.5 shadow-sm">
              <span className="w-10 h-10 shrink-0 rounded-full bg-[#F7F1FB] border border-gold/10 flex items-center justify-center text-gold">
                <Icon size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{title}</p>
                <p className="text-[11px] text-slate-500 truncate">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
