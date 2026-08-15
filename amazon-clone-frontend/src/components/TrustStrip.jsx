import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'

const items = [
  { icon: Truck, title: 'Fast Delivery', text: 'Quick doorstep delivery' },
  { icon: ShieldCheck, title: 'Secure Payments', text: 'Protected checkout' },
  { icon: RotateCcw, title: 'Easy Returns', text: 'Simple return support' },
  { icon: Headphones, title: 'Customer Support', text: 'We are here to help' },
]

export default function TrustStrip() {
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 px-4 sm:px-6 py-5">
            <span className="w-10 h-10 rounded-full bg-[#481F72]/8 text-[#481F72] flex items-center justify-center shrink-0"><Icon size={19} /></span>
            <div><p className="text-sm font-bold text-slate-900">{title}</p><p className="text-[11px] text-slate-500 mt-0.5">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}
