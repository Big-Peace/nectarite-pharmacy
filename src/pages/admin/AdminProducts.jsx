import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react'
import { formatCurrency } from '../../lib/whatsapp'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AdminProducts() {
  const products = useQuery(api.products.getAllProducts)
  const deleteProduct = useMutation(api.products.deleteProduct)
  const [search, setSearch] = useState('')

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    await deleteProduct({ productId: id })
    toast.success('Product deleted')
  }

  const filtered = products?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-2">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Products</h1>
          </div>
          <Link to="/admin/products/add" className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 flex items-center gap-2">
            <Plus size={18} /> Add Product
          </Link>
        </div>

        <div className="relative mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        {!products ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered?.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {product.imageUrl ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : '💊'}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(product.salePrice || product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(product._id, product.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}