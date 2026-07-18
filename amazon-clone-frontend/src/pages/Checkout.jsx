import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Truck, RotateCcw, Tag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

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

  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const shippingPrice = subtotal > 499 ? 0 : 49
  const discount = appliedCoupon?.discount || 0
  const total = Math.max(subtotal + shippingPrice - discount, 0)

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return
    setCouponError('')
    setApplyingCoupon(true)
    try {
      const data = await api.post('/coupons/validate', { code: couponInput.trim(), orderValue: subtotal }, true)
      setAppliedCoupon({ code: data.code, discount: data.discount })
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err.message)
    } finally {
      setApplyingCoupon(false)
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

  async function handlePayment(e) {
    e.preventDefault()
    setError('')
    setPlacing(true)

    try {
      const items = cart.items.map((i) => ({ product: i.product._id, qty: i.qty }))
      const orderData = await api.post(
        '/orders',
        { items, shippingAddress: address, couponCode: appliedCoupon?.code },
        true
      )

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Razorpay SDK load nahi hua. Internet connection check karo.')
        setPlacing(false)
        return
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Teotia Shopprix',
        description: 'Order Payment',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post(
              '/orders/verify',
              {
                orderId: orderData.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              true
            )
            await refreshCart()
            navigate('/orders')
          } catch (err) {
            setError('Payment verification failed: ' + err.message)
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: { color: '#D4AF37' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (!cart.items || cart.items.length === 0) {
    return <main className="bg-luxe-bg min-h-[60vh] flex items-center justify-center text-gray-500">Cart is empty</main>
  }

  return (
    <main className="bg-luxe-bg min-h-[70vh] font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 py-6">
        <form onSubmit={handlePayment} className="lg:col-span-2 bg-luxe-panel border border-gold/20 p-5 rounded-lg space-y-3">
          <h1 className="text-xl font-medium mb-2 text-white">Shipping Address</h1>

          {error && (
            <div className="bg-blush-from/10 border border-blush-from/30 text-blush-from text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input name="fullName" required placeholder="Full name" value={address.fullName} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 col-span-2" />
            <input name="phone" required placeholder="Phone number" value={address.phone} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line1" required placeholder="Address line 1" value={address.line1} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line2" placeholder="Address line 2 (optional)" value={address.line2} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 col-span-2" />
            <input name="city" required placeholder="City" value={address.city} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5" />
            <input name="state" required placeholder="State" value={address.state} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5" />
            <input name="pincode" required placeholder="Pincode" value={address.pincode} onChange={handleChange} className="bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 col-span-2" />
          </div>

          <div className="border-t border-gold/10 pt-3">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-1 mb-2">
              <Tag size={14} className="text-gold" /> Have a coupon?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-md px-3 py-2 text-sm">
                <span className="text-green-400">"{appliedCoupon.code}" applied — you saved ₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                <button type="button" onClick={removeCoupon}><X size={16} className="text-gray-400" /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 bg-black/40 border border-gold/30 text-white rounded-sm px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="bg-white/5 hover:bg-white/10 border border-gold/30 text-gold px-4 rounded-sm text-sm disabled:opacity-60"
                >
                  {applyingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-blush-from mt-1">{couponError}</p>}
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-gold hover:bg-gold-light rounded-full py-2 text-sm font-medium border border-gold/40 disabled:opacity-60"
          >
            {placing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')} with Razorpay`}
          </button>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gold/10">
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <ShieldCheck size={18} className="text-gold" />
              <span className="text-[10px] text-center">100% Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <Truck size={18} className="text-gold" />
              <span className="text-[10px] text-center">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <RotateCcw size={18} className="text-gold" />
              <span className="text-[10px] text-center">Easy 7-Day Returns</span>
            </div>
          </div>
        </form>

        <div className="bg-luxe-panel border border-gold/20 p-5 rounded-lg h-fit space-y-2 text-sm">
          <h2 className="font-medium text-base mb-2 text-white">Order Summary</h2>
          <div className="flex justify-between text-gray-300"><span>Items:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-300"><span>Shipping:</span><span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400"><span>Coupon Discount:</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>
          )}
          <div className="flex justify-between font-bold text-blush-from border-t border-gold/10 pt-2">
            <span>Order Total:</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
