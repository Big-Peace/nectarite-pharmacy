import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Package, ShoppingBag, DollarSign, ClipboardList, LogOut, Plus, List } from 'lucide-react'
import { formatCurrency } from '../../lib/whatsapp'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const products = useQuery(api.products.getAllProducts)
  const orders = useQuery(api.orders.getAllOrders)

  useEffect(() => {
    if (!localStorage.getItem('nectarite_admin')) {
      navigate('/admin/login')
    }
  }, [navigate])

  const revenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const activeProducts = products?.filter(p => p.isActive).length || 0

  const handleSignOut = () => {
    localStorage.removeItem('nectarite_admin')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
          <button onClick={handleSignOut} className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-1">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'Products', value: activeProducts, color: 'bg-blue-500' },
            { icon: ShoppingBag, label: 'Total Orders', value: orders?.length || 0, color: 'bg-green-500' },
            { icon: DollarSign, label: 'Revenue', value: formatCurrency(revenue), color: 'bg-purple-500' },
            { icon: ClipboardList, label: 'Pending', value: pendingOrders, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/admin/products" className="bg-white rounded-xl p-6 border hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Manage Products</h3>
                <p className="text-sm text-gray-500">Add, edit, or remove products</p>
              </div>
              <List size={32} className="text-gray-300" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm mt-4">
              <Plus size={16} /> Add New Product
            </span>
          </Link>

          <Link to="/admin/orders" className="bg-white rounded-xl p-6 border hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">View Orders</h3>
                <p className="text-sm text-gray-500">Track and manage customer orders</p>
              </div>
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            {pendingOrders > 0 && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mt-3">
                {pendingOrders} pending
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}