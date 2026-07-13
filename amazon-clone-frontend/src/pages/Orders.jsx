import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my', true).then(setOrders).finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="bg-surface min-h-[60vh] flex items-center justify-center text-gray-500">Loading orders...</main>

  if (orders.length === 0) {
    return <main className="bg-surface min-h-[60vh] flex items-center justify-center text-gray-500">You have no orders yet.</main>
  }

  return (
    <main className="bg-surface min-h-[70vh] font-sans max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-medium mb-4">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-sm shadow-card p-4">
            <div className="flex justify-between text-sm text-gray-600 border-b pb-2 mb-2">
              <span>Order #{order._id.slice(-8)}</span>
              <span className={order.isPaid ? 'text-green-700' : order.paymentClaimed ? 'text-accent-orange' : 'text-price'}>
                {order.isPaid ? 'Paid' : order.paymentClaimed ? 'Verification pending' : 'Payment not received'} · {order.status}
              </span>
            </div>
            {order.items.map((item) => (
              <div key={item.product} className="flex justify-between text-sm py-1">
                <span>{item.name} × {item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-sm border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
