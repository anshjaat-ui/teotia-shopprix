import { Shirt, Home, Headphones, Gamepad2, Heart, Gift, Laptop, Watch } from "lucide-react"

const categories = [
  { name: "Fashion", icon: Shirt },
  { name: "Home", icon: Home },
  { name: "Audio", icon: Headphones },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Gifts", icon: Gift },
  { name: "Electronics", icon: Laptop },
  { name: "Watches", icon: Watch },
  { name: "Favorites", icon: Heart },
]

export default function CategoryGrid() {
  return (
    <div className="bg-black px-4 py-8">
      <h2 className="text-white text-lg font-semibold mb-6 max-w-7xl mx-auto">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {categories.map((cat, i) => {
          const Icon = cat.icon

          return (
            <div
              key={i}
              className="rounded-2xl border border-gray-800 p-6 flex flex-col items-center justify-center hover:border-gray-600 transition"
            >
              {/* ICON */}
              <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center mb-3">
                <Icon size={24} color="white" />
              </div>

              {/* NAME */}
              <span className="text-white text-sm font-medium">
                {cat.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
