import { useEffect, useState } from 'react'
import { UserCircle, Mail, ShieldCheck, CalendarDays, MapPin, Package, Heart, Pencil, Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { updateProfile: saveAccount } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    api.get('/auth/profile', true)
      .then((data) => {
        setProfile(data)
        setForm({ name: data?.name || '', email: data?.email || '' })
      })
      .catch((err) => setError(err.message || 'Profile load nahi hua'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const updated = await saveAccount(form)
      setProfile((current) => ({ ...current, ...updated }))
      setEditing(false)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Profile update nahi hua')
    } finally {
      setSaving(false)
    }
  }

  function cancelEdit() {
    setForm({ name: profile?.name || '', email: profile?.email || '' })
    setEditing(false)
    setError('')
  }

  if (loading) return <main className="min-h-[70vh] bg-luxe-bg flex items-center justify-center text-slate-500">Loading profile...</main>
  if (error && !profile) return <main className="min-h-[70vh] bg-luxe-bg flex items-center justify-center text-red-500">{error}</main>

  const addresses = profile?.addresses || []
  const created = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  return (
    <main className="bg-luxe-bg min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E9E4EF] shadow-sm p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-[#F7F1FB] border border-gold/20 flex items-center justify-center shrink-0">
              <UserCircle size={58} strokeWidth={1.35} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">My Account</p>
              <h1 className="text-2xl font-bold text-slate-900">{profile?.name}</h1>
              <p className="text-sm text-slate-500">Teotia Shopprix customer profile</p>
            </div>
            {!editing && (
              <button onClick={() => { setMessage(''); setError(''); setEditing(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-white px-4 py-2.5 text-sm font-bold hover:bg-gold-light transition-colors">
                <Pencil size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {message && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {editing && (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gold/20 shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-slate-900">Edit Profile</h2>
                <p className="text-xs text-slate-500 mt-1">Update the details used for your Teotia Shopprix account.</p>
              </div>
              <button type="button" onClick={cancelEdit} className="w-9 h-9 rounded-full border flex items-center justify-center text-slate-500 hover:text-gold" aria-label="Cancel editing"><X size={18} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-[#DCD3E5] px-4 py-3 text-sm outline-none focus:border-gold" />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-xl border border-[#DCD3E5] px-4 py-3 text-sm outline-none focus:border-gold" />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button type="button" onClick={cancelEdit} className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
              <button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gold text-white px-5 py-2.5 text-sm font-bold disabled:opacity-60"><Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <section className="bg-white rounded-2xl border border-[#E9E4EF] p-5">
            <h2 className="font-bold text-slate-900 mb-4">Personal Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-center"><UserCircle size={18} className="text-gold" /><span>{profile?.name}</span></div>
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
