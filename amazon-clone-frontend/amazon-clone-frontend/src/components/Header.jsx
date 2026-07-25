import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/client"

export default function Header() {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const res = await api.get("/categories")
      const data = res.data

      // 🔥 STEP 1: main categories
      const main = data.filter(c => c.parent === null)

      // 🔥 STEP 2: attach subcategories
      const structured = main.map(cat => ({
        ...cat,
        subCategories: data.filter(sub => sub.parent === cat._id)
      }))

      setCategories(structured)
    }

    load()
  }, [])

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-4 py-3">
      <div className="flex gap-6 overflow-x-auto">

        {categories.map(c => (
          <div
            key={c._id}
            className="relative"
            onMouseEnter={() => setOpen(c._id)}
            onMouseLeave={() => setOpen(null)}
          >
            {/* 🔥 ICON SECTION */}
            <div
              onClick={() => navigate(`/category/${c.name}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs">{c.name}</span>
            </div>

            {/* 🔥 DROPDOWN */}
            {open === c._id && c.subCategories.length > 0 && (
              <div className="absolute top-12 left-0 bg-white text-black shadow-lg rounded p-3 min-w-[180px] z-50">

                {c.subCategories.map(sub => (
                  <div
                    key={sub._id}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/category/${c.name}?sub=${sub.name}`)
                    }}
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer rounded"
                  >
                    {sub.name}
                  </div>
                ))}

              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}
