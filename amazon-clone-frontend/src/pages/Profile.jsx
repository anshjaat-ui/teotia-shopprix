import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRound, Mail, Phone, MapPin, CalendarDays, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/profile', true)
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message || 'Unable to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const addresses = profile?.addresses || []

  return (
    <main className="bg-luxe-bg min-h-screen px-4 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-gold font-medium">My Account</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">View your account details, saved addresses and account information.</p>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="bg-white border border-gold/15 rounded-2xl shadow-goldGlow overflow-hidden">
          <div className="bg-gradient-to-r from-gold/10 via-white to-pink-50 px-5 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
              <UserRound size={32} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{profile?.name || 'User'}</h2>
              <p className="text-sm text-slate-500 truncate">{profile?.email || '—'}</p>
            </div>
            {profile?.role && <span className="sm:ml-auto inline-flex items-center gap-1 rounded-full bg-white border border-gold/20 px-3 py-1 text-xs font-medium text-gold"><ShieldCheck size={14} /> {profile.role}</span>}
          </div>

          <div className="p-5 sm:p-8">
            <h3 className="text-base font-bold text-slate-900 mb-4">Personal Information</h3>
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1,2,3,4].map((n) => <div key={n} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <Info label="Full Name" value={profile?.name} icon={<UserRound size={18} />} />
                <Info label="Email Address" value={profile?.email} icon={<Mail size={18} />} />
                <Info label="Account Role" value={profile?.role || 'customer'} icon={<ShieldCheck size={18} />} />
                <Info label="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} icon={<CalendarDays size={18} />} />
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 bg-white border border-gold/15 rounded-2xl shadow-goldGlow p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Addresses</h3>
              <p className="text-xs text-slate-500 mt-1">Addresses saved to your Teotia Shopprix account.</p>
            </div>
            <Link to="/checkout" className="text-xs font-medium text-gold hover:underline">Manage at checkout</Link>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gold/20 bg-gold/5 p-6 text-center">
              <MapPin className="mx-auto text-gold mb-2" size={24} />
              <p className="text-sm font-medium text-slate-700">No saved addresses yet</p>
              <p className="text-xs text-slate-500 mt-1">Your saved delivery addresses will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address, index) => (
                <div key={address._id || index} className="rounded-xl border border-gold/15 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gold mt-0.5 shrink-0" size={19} />
                    <div className="text-sm text-slate-700 leading-6">
                      <p className="font-semibold text-slate-900">{address.fullName || profile?.name}</p>
                      {address.phone && <p className="flex items-center gap-1 text-xs text-slate-500"><Phone size={12} /> {address.phone}</p>}
                      <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                      <p>{address.city}{address.state ? `, ${address.state}` : ''}{address.pincode ? ` - ${address.pincode}` : ''}</p>
                      {address.isDefault && <span className="inline-block mt-2 text-[11px] font-semibold text-gold bg-gold/10 rounded-full px-2 py-0.5">Default address</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/orders" className="rounded-full bg-gold text-white px-5 py-2.5 text-sm font-semibold hover:bg-gold-light">Your Orders</Link>
          <Link to="/wishlist" className="rounded-full border border-gold/25 bg-white text-gold px-5 py-2.5 text-sm font-semibold hover:bg-gold/5">Wishlist</Link>
        </div>
      </div>
    </main>
  )
}

function Info({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-gold/10 bg-slate-50/70 p-4 flex items-start gap-3">
      <span className="w-9 h-9 rounded-lg bg-white text-gold border border-gold/10 flex items-center justify-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-1 break-words">{value || '—'}</p>
      </div>
    </div>
  )
}
