import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ArrowLeft, Phone, Check, X, Clock } from 'lucide-react'
import { formatCurrency } from '../../lib/whatsapp'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const orders = useQuery(api.orders.getAllOrders)
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)

  const handleUpdateStatus = async (orderId, status) => {
    await updateOrderStatus({ orderId, status })
    toast.success(`Order marked as ${status}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/admin" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-2">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        {!orders ? (
          <div className="text-center py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No orders yet</h3>
            <p className="text-gray-400">New orders will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl border p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{order.customerName}</h3>
                      <a href={`tel:${order.customerPhone}`} className="text-green-600">
                        <Phone size={16} />
                      </a>
                    </div>
                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    <p className="text-sm text-gray-500">{order.customerAddress}</p>
                    {order.note && <p className="text-sm text-gray-400 italic mt-1">"{order.note}"</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="pb-2">Item</th>
                        <th className="pb-2 text-center">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-1">{item.name}</td>
                          <td className="py-1 text-center">×{item.quantity}</td>
                          <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="text-sm text-gray-500">
                    Delivery: {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                  </span>
                  <span className="text-lg font-bold text-emerald-700">Total: {formatCurrency(order.total)}</span>
                </div>

                {order.status === 'pending' && (
                  <div className="border-t pt-3 mt-3 flex gap-2 justify-end">
                    <button onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                      <Check size={14} /> Confirm
                    </button>
                    <button onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                )}
                {order.status === 'confirmed' && (
                  <div className="border-t pt-3 mt-3 flex justify-end">
                    <button onClick={() => handleUpdateStatus(order._id, 'delivered')}
                      className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600">
                      <Check size={14} /> Mark Delivered
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}