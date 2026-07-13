export default function HeroBanner() {
  return (
    <div className="relative">
      <img
        src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1600&auto=format&fit=crop"
        alt="Big deals banner"
        className="w-full h-[280px] md:h-[400px] object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
    </div>
  )
}
