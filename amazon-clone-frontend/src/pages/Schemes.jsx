import { useEffect, useState } from 'react'
import { Gift, Check, X } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Schemes() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [schemes, setSchemes] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState(null)
  const [upiRef, setUpiRef] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [schemesData, enrollData] = await Promise.all([
        api.get('/schemes'),
        user ? api.get('/schemes/my-enrollments', true) : Promise.resolve([]),
      ])
      setSchemes(schemesData)
      setEnrollments(enrollData)
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
      await api.post(`/schemes/${scheme._id}/join`, {}, true)
      showToast(`Joined ${scheme.name}!`)
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function handlePayMonth(enrollmentId) {
    try {
      await api.put(`/schemes/enrollments/${enrollmentId}/pay`, { upiRef }, true)
      showToast('Payment claim sent, awaiting confirmation')
      setPayingId(null)
      setUpiRef('')
      load()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) return <main className="bg-luxe-bg min-h-[60vh] flex items-center justify-center text-gray-400">Loading schemes...</main>

  return (
    <main className="bg-luxe-bg min-h-[70vh] font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-1">
          <Gift className="text-gold" size={24} />
          <h1 className="text-xl font-bold text-white">Savings Schemes</h1>
        </div>
        <p className="text-sm text-gray-400 mb-6">Save a little every month, get bonus rewards at the end.</p>

        {schemes.length === 0 && <p className="text-gray-500 text-sm">Abhi koi scheme available nahi hai.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((s) => {
            const enrollment = myEnrollment(s._id)
            const confirmedMonths = enrollment?.payments.filter((p) => p.confirmed).length || 0
            const hasPendingClaim = enrollment?.payments.some((p) => p.claimed && !p.confirmed)

            return (
              <div key={s._id} className="bg-luxe-panel border border-gold/20 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gold mb-1">{s.name}</h2>
                {s.description && <p className="text-xs text-gray-400 mb-3">{s.description}</p>}

                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <div className="flex justify-between"><span>Monthly:</span><span className="text-white">₹{s.monthlyAmount.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Duration:</span><span className="text-white">{s.durationMonths} months</span></div>
                  <div className="flex justify-between"><span>Total Paid:</span><span className="text-white">₹{(s.monthlyAmount * s.durationMonths).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between font-medium"><span className="text-green-400">You Get:</span><span className="text-green-400">₹{s.rewardAmount.toLocaleString('en-IN')}</span></div>
                </div>

                {!enrollment ? (
                  <button onClick={() => handleJoin(s)} className="w-full bg-gold hover:bg-gold-light text-black text-sm font-semibold py-2 rounded-full transition-colors">
                    Join Scheme
                  </button>
                ) : (
                  <div className="border-t border-gold/10 pt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{confirmedMonths}/{s.durationMonths} months</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                      <div className="h-full bg-gold" style={{ width: `${(confirmedMonths / s.durationMonths) * 100}%` }} />
                    </div>

                    {enrollment.status === 'completed' ? (
                      <p className="text-green-400 text-sm flex items-center gap-1"><Check size={14} /> Completed! Reward unlocked.</p>
                    ) : hasPendingClaim ? (
                      <p className="text-gold text-xs">This month's payment pending admin confirmation.</p>
                    ) : payingId === enrollment._id ? (
                      <div className="space-y-2">
                        <input
                          value={upiRef}
                          onChange={(e) => setUpiRef(e.target.value)}
                          placeholder="UTR / reference number (optional)"
                          className="w-full bg-black/40 border border-gold/30 text-white rounded-md px-2 py-1.5 text-xs"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handlePayMonth(enrollment._id)} className="flex-1 bg-gold text-black text-xs font-medium py-1.5 rounded-full">Confirm Paid</button>
                          <button onClick={() => setPayingId(null)}><X size={16} className="text-gray-400" /></button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPayingId(enrollment._id)}
                        className="w-full bg-white/5 border border-gold/30 text-gold text-sm font-medium py-2 rounded-full hover:bg-gold/10"
                      >
                        Pay Month {confirmedMonths + 1}
                      </button>
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
