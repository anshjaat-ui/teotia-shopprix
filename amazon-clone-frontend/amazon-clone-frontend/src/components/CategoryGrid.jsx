import { useNavigate } from "react-router-dom";

const tiles = [
  {
    title: "Stationary",
    img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=600&auto=format&fit=crop",
    sub: ["Books", "Notebook", "Pen & Pencil", "Geometry"]
  },
  {
    title: "Audio",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    sub: ["Headphones", "Speakers", "Earbuds"]
  },
  {
    title: "Fashion",
    img: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=600&auto=format&fit=crop",
    sub: ["Shirts", "Shoes", "Accessories"]
  },
  {
    title: "Gaming",
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop",
    sub: ["Consoles", "Games", "Accessories"]
  }
];

const colors = [
  "from-pink-500 to-purple-500",
  "from-blue-500 to-indigo-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500"
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="bg-luxe-bg px-4 py-8">
      <h2 className="text-white text-lg font-semibold mb-4 max-w-7xl mx-auto">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {tiles.map((t, index) => (
          <div
            key={t.title}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all 
            bg-gradient-to-r ${colors[index % colors.length]} 
            hover:scale-105`}
            onClick={() => navigate(`/category/${t.title}`)}
          >
            {/* Image */}
            <img
              src={t.img}
              alt={t.title}
              className="w-full h-32 sm:h-40 object-cover opacity-80"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-3">
              <span className="text-white text-sm font-semibold">
                {t.title}
              </span>

              {/* 🔥 Subcategories */}
              <div className="flex flex-wrap gap-1 mt-1">
                {t.sub.map((s) => (
                  <span
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${t.title}?sub=${s}`);
                    }}
                    className="text-xs bg-white/20 text-white px-2 py-0.5 rounded hover:bg-white/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
