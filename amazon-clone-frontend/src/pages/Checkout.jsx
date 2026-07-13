import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, Check, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

export default function Checkout() {
  const { cart, subtotal, refreshCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [paymentInfo, setPaymentInfo] = useState(null) // { orderId, amount, upiId, upiLink, qrCodeUrl, whatsappLink }
  const [upiRef, setUpiRef] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setError('')
    setPlacing(true)
    try {
      const items = cart.items.map((i) => ({ product: i.product._id, qty: i.qty }))
      const data = await api.post('/orders', { items, shippingAddress: address }, true)
      setPaymentInfo(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  async function handleClaimPayment() {
    setClaiming(true)
    setError('')
    try {
      await api.put(`/orders/${paymentInfo.orderId}/claim-payment`, { upiRef }, true)
      await refreshCart()
      setClaimed(true)
      setTimeout(() => navigate('/orders'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setClaiming(false)
    }
  }

  function copyUpiId() {
    navigator.clipboard.writeText(paymentInfo.upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!cart.items || cart.items.length === 0) {
    return <main className="bg-surface min-h-[60vh] flex items-center justify-center text-gray-500">Cart is empty</main>
  }

  // ---- Payment step: order ban chuka hai, ab UPI se pay karna hai ----
  if (paymentInfo) {
    return (
      <main className="bg-surface min-h-[70vh] font-sans">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-sm shadow-card p-6 text-center">
            {claimed ? (
              <div className="py-8">
                <Check size={48} className="mx-auto text-green-600 mb-3" />
                <p className="font-medium">Payment claim bhej diya gaya!</p>
                <p className="text-sm text-gray-600 mt-1">Order verify hote hi confirm ho jaayega. Redirecting...</p>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-medium mb-1">Scan & Pay via UPI</h1>
                <p className="text-2xl font-bold text-price mb-4">₹{paymentInfo.amount.toLocaleString('en-IN')}</p>

                <img src={paymentInfo.qrCodeUrl} alt="UPI QR Code" className="mx-auto mb-4 border rounded" />

                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm text-gray-700">{paymentInfo.upiId}</span>
                  <button onClick={copyUpiId} className="text-link hover:underline flex items-center gap-1 text-xs">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <a
                  href={paymentInfo.upiLink}
                  className="block mt-3 bg-accent hover:bg-accent-orange rounded-full py-2 text-sm font-medium border border-accent-orange/40"
                >
                  Open in UPI App (mobile)
                </a>

                <div className="text-left mt-6 border-t pt-4">
                  <p className="text-sm font-medium mb-2">Payment karne ke baad:</p>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-2">
                      {error}
                    </div>
                  )}
                  <input
                    value={upiRef}
                    onChange={(e) => setUpiRef(e.target.value)}
                    placeholder="UPI transaction ref / UTR number (optional)"
                    className="w-full border border-gray-400 rounded-sm px-2 py-1.5 text-sm mb-2"
                  />
                  <button
                    onClick={handleClaimPayment}
                    disabled={claiming}
                    className="w-full bg-navy text-white rounded-full py-2 text-sm font-medium disabled:opacity-60 mb-2"
                  >
                    {claiming ? 'Sending...' : "I've Paid"}
                  </button>

                  <a
                    href={paymentInfo.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-700 rounded-full py-2 text-sm font-medium hover:bg-green-50"
                  >
                    <MessageCircle size={16} /> Notify on WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    )
  }

  // ---- Address step ----
  return (
    <main className="bg-surface min-h-[70vh] font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 py-6">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 bg-white p-5 rounded-sm shadow-card space-y-3">
          <h1 className="text-xl font-medium mb-2">Shipping Address</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input name="fullName" required placeholder="Full name" value={address.fullName} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="phone" required placeholder="Phone number" value={address.phone} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line1" required placeholder="Address line 1" value={address.line1} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line2" placeholder="Address line 2 (optional)" value={address.line2} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="city" required placeholder="City" value={address.city} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5" />
            <input name="state" required placeholder="State" value={address.state} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5" />
            <input name="pincode" required placeholder="Pincode" value={address.pincode} onChange={handleChange} className="border border-gray-400 rounded-sm px-2 py-1.5 col-span-2" />
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-accent hover:bg-accent-orange rounded-full py-2 text-sm font-medium border border-accent-orange/40 disabled:opacity-60"
          >
            {placing ? 'Processing...' : `Continue to Pay ₹${(subtotal + (subtotal > 499 ? 0 : 49)).toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="bg-white p-5 rounded-sm shadow-card h-fit space-y-2 text-sm">
          <h2 className="font-medium text-base mb-2">Order Summary</h2>
          <div className="flex justify-between"><span>Items:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>{subtotal > 499 ? 'FREE' : '₹49'}</span></div>
          <div className="flex justify-between font-bold text-price border-t pt-2">
            <span>Order Total:</span>
            <span>₹{(subtotal + (subtotal > 499 ? 0 : 49)).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
