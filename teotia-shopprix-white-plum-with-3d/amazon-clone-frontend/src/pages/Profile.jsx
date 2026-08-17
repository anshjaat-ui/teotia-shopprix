import { useEffect, useState } from 'react'
import { UserCircle, Mail, ShieldCheck, CalendarDays, MapPin, Package, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/profile', true)
      .then(setProfile)
      .catch((err) => setError(err.message || 'Profile load nahi hua'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="min-h-[70vh] bg-luxe-bg flex items-center justify-center text-slate-500">Loading profile...</main>
  if (error) return <main className="min-h-[70vh] bg-luxe-bg flex items-center justify-center text-red-500">{error}</main>

  const addresses = profile?.addresses || []
  const created = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  return (
    <main className="bg-luxe-bg min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E9E4EF] shadow-sm p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <UserCircle size={72} strokeWidth={1.5} className="text-gold" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">My Account</p>
              <h1 className="text-2xl font-bold text-slate-900">{profile?.name}</h1>
              <p className="text-sm text-slate-500">Teotia Shopprix customer profile</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <section className="bg-white rounded-2xl border border-[#E9E4EF] p-5">
            <h2 className="font-bold text-slate-900 mb-4">Personal Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-center"><Mail size={18} className="text-gold" /><span>{profile?.email}</span></div>
              <div className="flex gap-3 items-center"><ShieldCheck size={18} className="text-gold" /><span className="capitalize">{profile?.role || 'customer'}</span></div>
              <div className="flex gap-3 items-center"><CalendarDays size={18} className="text-gold" /><span>Member since {created}</span></div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-[#E9E4EF] p-5">
            <h2 className="font-bold text-slate-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/orders" className="rounded-xl border p-4 hover:border-gold/50"><Package size={20} className="text-gold mb-2" /><span className="text-sm font-semibold">Your Orders</span></Link>
              <Link to="/wishlist" className="rounded-xl border p-4 hover:border-gold/50"><Heart size={20} className="text-gold mb-2" /><span className="text-sm font-semibold">Wishlist</span></Link>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-[#E9E4EF] p-5 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Saved Addresses</h2>
            <span className="text-xs text-slate-500">{addresses.length} saved</span>
          </div>
          {addresses.length === 0 ? (
            <p className="text-sm text-slate-500">No saved address yet. Your checkout address will appear here when saved.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {addresses.map((a, i) => (
                <div key={a._id || i} className="border rounded-xl p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold"><MapPin size={17} className="text-gold" /> {a.fullName || profile.name}{a.isDefault ? ' · Default' : ''}</div>
                  <p className="text-slate-600 mt-2">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                  <p className="text-slate-600">{a.city}, {a.state} - {a.pincode}</p>
                  {a.phone && <p className="text-slate-500 mt-1">{a.phone}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
