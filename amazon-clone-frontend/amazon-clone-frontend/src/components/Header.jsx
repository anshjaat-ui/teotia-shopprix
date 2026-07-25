import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/client"

export default function Header() {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/categories")
        const data = res.data

        const main = data.filter(c => c.parent === null)

        const structured = main.map(cat => ({
          ...cat,
          subCategories: data.filter(sub => sub.parent === cat._id)
        }))

        setCategories(structured)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  return (
    <div className="bg-black text-white px-4 py-3">
      <div className="flex gap-6 overflow-x-auto">

        {categories.map(c => (
          <div
            key={c._id}
            className="relative"
            onMouseEnter={() => setOpen(c._id)}
            onMouseLeave={() => setOpen(null)}
          >
            <div
              onClick={() => navigate(`/category/${c.name}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </div>

            {open === c._id && c.subCategories?.length > 0 && (
              <div className="absolute top-10 bg-white text-black p-2 rounded shadow">

                {(c.subCategories || []).map(sub => (
                  <div
                    key={sub._id}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/category/${c.name}?sub=${sub.name}`)
                    }}
                    className="hover:bg-gray-200 px-2 py-1 cursor-pointer"
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
