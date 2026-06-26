import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowLeft, Phone } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useCart } from '../../context/CartContext'
import { formatCurrency, buildOrderMessage, openWhatsApp } from '../../lib/whatsapp'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, clearCart } = useCart()
  const createOrder = useMutation(api.orders.createOrder)
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', address: '', note: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      // Save order to Convex
      await createOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        deliveryFee,
        total,
        note: customerInfo.note || undefined,
      })

      // Build and open WhatsApp message
      const message = buildOrderMessage(cart, customerInfo)
      openWhatsApp(message)

      toast.success('Order sent via WhatsApp!')
      clearCart()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Browse our products and add items to your cart</p>
        <Link to="/shop" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 font-serif mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="bg-white rounded-xl p-4 flex gap-4 border">
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : '💊'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-emerald-700 font-semibold">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:bg-gray-100 rounded">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:bg-gray-100 rounded">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 ml-4 flex items-center gap-1 text-sm">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-bold text-lg">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Form */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t mt-3">
                <span>Total</span>
                <span className="text-emerald-700">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name *" value={customerInfo.name}
                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="tel" placeholder="Phone Number *" value={customerInfo.phone}
                onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" />
              <textarea placeholder="Delivery Address *" value={customerInfo.address} rows={2}
                onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              <textarea placeholder="Additional Note (optional)" value={customerInfo.note} rows={2}
                onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
            <button onClick={handleCheckout} disabled={submitting}
              className="w-full mt-4 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50">
              <Phone size={18} />
              {submitting ? 'Processing...' : 'Checkout via WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}