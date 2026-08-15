import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sendPhoneOtp } from '../firebase'

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  return value.trim()
}

export default function Signup() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState(false)

  const { loginWithPhone } = useAuth()
  const navigate = useNavigate()

  async function handleSendOtp(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    const normalized = normalizePhone(phone)
    if (!/^\+\d{10,15}$/.test(normalized)) {
      setError('Please enter a valid phone number with country code.')
      return
    }

    setSending(true)
    try {
      const result = await sendPhoneOtp(normalized)
      setPhone(normalized)
      setConfirmation(result)
    } catch (err) {
      setError(err?.message || 'Could not send OTP. Please try again.')
    } finally {
      setSending(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    if (!confirmation) return

    setSubmitting(true)
    try {
      const credential = await confirmation.confirm(otp)
      const idToken = await credential.user.getIdToken()
      await loginWithPhone(phone, idToken, name.trim())
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-luxe-bg min-h-[80vh] flex justify-center py-10 px-4 font-sans">
      <div className="bg-luxe-panel border border-gold/20 rounded-sm p-6 w-full max-w-sm h-fit">
        <h1 className="text-2xl font-medium mb-4 text-slate-900">Create account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

        {!confirmation ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1 text-slate-600">Your name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gold/30 rounded-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1 text-slate-600">Phone number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                autoComplete="tel"
                className="w-full border border-gold/30 rounded-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold"
              />
              <p className="text-xs text-slate-500 mt-1">India numbers are automatically prefixed with +91.</p>
            </div>
            <div id="recaptcha-container" />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gold hover:bg-gold-light text-white rounded-full py-1.5 text-sm font-medium border border-gold/40 disabled:opacity-60"
            >
              {sending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1 text-slate-600">Enter OTP</label>
              <input
                type="text"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
                className="w-full border border-gold/30 rounded-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || otp.length < 6}
              className="w-full bg-gold hover:bg-gold-light text-white rounded-full py-1.5 text-sm font-medium border border-gold/40 disabled:opacity-60"
            >
              {submitting ? 'Creating account...' : 'Verify & create account'}
            </button>
            <button
              type="button"
              onClick={() => { setConfirmation(null); setOtp(''); setError('') }}
              className="w-full text-sm text-gold hover:underline"
            >
              Change phone number
            </button>
          </form>
        )}

        <p className="text-xs text-slate-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
