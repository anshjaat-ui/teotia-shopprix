import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  async function handlePayment(e) {
    e.preventDefault()
    setError('')
    setPlacing(true)

    try {
      const items = cart.items.map((i) => ({ product: i.product._id, qty: i.qty }))
      const orderData = await api.post('/orders', { items, shippingAddress: address }, true)

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
        theme: { color: '#febd69' },
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
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input name="fullName" required placeholder="Full name" value={address.fullName} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="phone" required placeholder="Phone number" value={address.phone} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line1" required placeholder="Address line 1" value={address.line1} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="line2" placeholder="Address line 2 (optional)" value={address.line2} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5 col-span-2" />
            <input name="city" required placeholder="City" value={address.city} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5" />
            <input name="state" required placeholder="State" value={address.state} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5" />
            <input name="pincode" required placeholder="Pincode" value={address.pincode} onChange={handleChange} className="border border-gold/30 rounded-sm px-2 py-1.5 col-span-2" />
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-gold hover:bg-gold-light rounded-full py-2 text-sm font-medium border border-gold/40 disabled:opacity-60"
          >
            {placing ? 'Processing...' : `Pay ₹${(subtotal + (subtotal > 499 ? 0 : 49)).toLocaleString('en-IN')} with Razorpay`}
          </button>
        </form>

        <div className="bg-luxe-panel border border-gold/20 p-5 rounded-lg h-fit space-y-2 text-sm">
          <h2 className="font-medium text-base mb-2 text-white">Order Summary</h2>
          <div className="flex justify-between text-gray-300"><span>Items:</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between text-gray-300"><span>Shipping:</span><span>{subtotal > 499 ? 'FREE' : '₹49'}</span></div>
          <div className="flex justify-between font-bold text-blush-from border-t pt-2">
            <span>Order Total:</span>
            <span>₹{(subtotal + (subtotal > 499 ? 0 : 49)).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
