import { useEffect, useState } from 'react'
import { Gift, Check, Copy } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Schemes() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [schemes, setSchemes] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [depositUpiRef, setDepositUpiRef] = useState('')
  const [showDepositFor, setShowDepositFor] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const schemesData = await api.get('/schemes')
      setSchemes(schemesData)
      const settingsData = await api.get('/settings')
      setSettings(settingsData)
      if (user) {
        try {
          const enrollData = await api.get('/schemes/my-enrollments', true)
          setEnrollments(enrollData)
        } catch (err) {
          console.error('Failed to load enrollments:', err.message)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  function myEnrollment(schemeId) {
    return enrollments.find((e) => e.scheme?._id === schemeId && e.status !== 'cancelled')
  }

  async function handleJoin(scheme) {
    if (!user) {
      showToast('Please sign in to join a scheme', 'error')
      return
    }
    try {
      const enrollment = await api.post(`/schemes/${scheme._id}/join`, {}, true)
      showToast(`Joined ${scheme.name}! Ab deposit karo.`)
      setShowDepositFor(enrollment._id)
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function handleClaimDeposit(enrollmentId) {
    try {
      await api.put(`/schemes/enrollments/${enrollmentId}/claim-deposit`, { upiRef: depositUpiRef }, true)
      showToast('Deposit claim bhej diya, admin verify karega')
      setShowDepositFor(null)
      setDepositUpiRef('')
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function handleRedeem(enrollmentId) {
    try {
      const data = await api.put(`/schemes/enrollments/${enrollmentId}/redeem`, {}, true)
      showToast(data.message)
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  function copyUpi() {
    navigator.clipboard.writeText(settings?.upiId || '')
    showToast('UPI ID copied')
  }

  if (loading) return <main className="bg-luxe-bg min-h-[60vh] flex items-center justify-center text-gray-400">Loading schemes...</main>

  if (error) {
    return (
      <main className="bg-luxe-bg min-h-[60vh] flex flex-col items-center justify-center gap-2 font-sans px-4 text-center">
        <p className="text-blush-from text-sm">Schemes load nahi ho payi: {error}</p>
      </main>
    )
  }

  return (
    <main className="bg-luxe-bg min-h-[70vh] font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="text-gold" size={24} />
          <h1 className="text-xl font-bold text-white">Savings Schemes</h1>
        </div>
        <p className="text-sm text-gray-400 mb-6">
          Ek baar deposit karo, har mahine paisa wapas milta hai — aakhri mahine bonus ke saath.
        </p>

        {schemes.length === 0 && <p className="text-gray-500 text-sm">Abhi koi scheme available nahi hai.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((s) => {
            const enrollment = myEnrollment(s._id)
            const redeemedCount = enrollment?.coupons.filter((c) => c.redeemed).length || 0
            const paidOutCount = enrollment?.coupons.filter((c) => c.paidOut).length || 0
            const pendingPayout = enrollment?.coupons
              .filter((c) => c.redeemed && !c.paidOut)
              .reduce((sum, c) => sum + c.baseAmount, 0) || 0

            const now = new Date()
            const monthsElapsed = enrollment?.depositConfirmedAt
              ? Math.max((now.getFullYear() - new Date(enrollment.depositConfirmedAt).getFullYear()) * 12 + (now.getMonth() - new Date(enrollment.depositConfirmedAt).getMonth()) + 1, 1)
              : 0
            const canRedeem = enrollment?.coupons.some((c) => !c.redeemed && c.monthNumber <= monthsElapsed)

            return (
              <div key={s._id} className="bg-luxe-panel border border-gold/20 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gold mb-1">{s.name}</h2>
                {s.description && <p className="text-xs text-gray-400 mb-3">{s.description}</p>}

                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <div className="flex justify-between"><span>One-time Deposit:</span><span className="text-white font-medium">₹{s.depositAmount.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Monthly Payout:</span><span className="text-white">₹{s.monthlyPayout.toLocaleString('en-IN')} × {s.durationMonths - 1} months</span></div>
                  <div className="flex justify-between"><span>Last Month Bonus:</span><span className="text-white">₹{s.finalPayout.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-medium border-t border-gold/10 pt-1"><span className="text-green-400">Total You Get Back:</span><span className="text-green-400">₹{s.totalReturn.toLocaleString('en-IN')}</span></div>
                </div>

                {!enrollment ? (
                  <button onClick={() => handleJoin(s)} className="w-full bg-gold hover:bg-gold-light text-black text-sm font-semibold py-2 rounded-full transition-colors">
                    Join Scheme
                  </button>
                ) : !enrollment.depositConfirmed ? (
                  <div className="border-t border-gold/10 pt-3">
                    {enrollment.depositClaimed ? (
                      <p className="text-gold text-xs">Deposit claim bheji ja chuki hai. Admin verify karne ka wait karo.</p>
                    ) : showDepositFor === enrollment._id ? (
                      <div className="space-y-2">
                        {settings?.qrCodeImage && <img src={settings.qrCodeImage} alt="QR" className="w-28 h-28 mx-auto object-contain bg-white rounded" />}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                          <span>{settings?.upiId}</span>
                          <button onClick={copyUpi}><Copy size={12} className="text-gold" /></button>
                        </div>
                        <input
                          value={depositUpiRef}
                          onChange={(e) => setDepositUpiRef(e.target.value)}
                          placeholder="UTR / reference number (optional)"
                          className="w-full bg-black/40 border border-gold/30 text-white rounded-md px-2 py-1.5 text-xs"
                        />
                        <button onClick={() => handleClaimDeposit(enrollment._id)} className="w-full bg-gold text-black text-xs font-medium py-2 rounded-full">
                          I've Paid ₹{s.depositAmount.toLocaleString('en-IN')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDepositFor(enrollment._id)}
                        className="w-full bg-white/5 border border-gold/30 text-gold text-sm font-medium py-2 rounded-full hover:bg-gold/10"
                      >
                        Pay Deposit — ₹{s.depositAmount.toLocaleString('en-IN')}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-gold/10 pt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Coupons Redeemed</span>
                      <span>{redeemedCount}/{s.durationMonths}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                      <div className="h-full bg-gold" style={{ width: `${(redeemedCount / s.durationMonths) * 100}%` }} />
                    </div>

                    {pendingPayout > 0 && (
                      <p className="text-xs text-gold mb-2">₹{pendingPayout.toLocaleString('en-IN')} redeem ho chuka hai, admin se payout lena baaki hai.</p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">₹{(paidOutCount * s.monthlyPayout).toLocaleString('en-IN')}+ already paid out</p>

                    {enrollment.status === 'completed' ? (
                      <p className="text-green-400 text-sm flex items-center gap-1"><Check size={14} /> Scheme completed!</p>
                    ) : canRedeem ? (
                      <button onClick={() => handleRedeem(enrollment._id)} className="w-full bg-gold hover:bg-gold-light text-black text-sm font-semibold py-2 rounded-full">
                        Redeem This Month
                      </button>
                    ) : (
                      <p className="text-xs text-gray-500">Agle mahine ka coupon abhi eligible nahi hai.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
