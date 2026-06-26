import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useQuery(api.products.getProductById, { productId: id })
  const updateProduct = useMutation(api.products.updateProduct)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || '',
        imageUrl: product.imageUrl || '',
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isActive: product.isActive,
        requiresPrescription: product.requiresPrescription,
        stockQuantity: product.stockQuantity.toString(),
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProduct({
        productId: id,
        name: form.name,
        category: form.category,
        description: form.description,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        imageUrl: form.imageUrl || undefined,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isActive: form.isActive,
        requiresPrescription: form.requiresPrescription,
        stockQuantity: parseInt(form.stockQuantity) || 0,
      })
      toast.success('Product updated!')
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to update product')
    }
    setSaving(false)
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/admin/products" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-4">
          <ArrowLeft size={14} /> Back to Products
        </Link>

        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same fields as AddProduct */}
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                {['Prescription', 'Supplements', 'Personal Care', 'Mother & Baby', 'Medical Devices', 'First Aid', 'Herbal'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (₦) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sale Price (₦)</label>
                <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { name: 'isFeatured', label: 'Featured' },
                { name: 'isNew', label: 'New' },
                { name: 'isActive', label: 'Active' },
                { name: 'requiresPrescription', label: 'Prescription Required' },
              ].map(toggle => (
                <label key={toggle.name} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={toggle.name} checked={form[toggle.name]} onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 rounded" />
                  <span className="text-sm">{toggle.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} min="0"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={18} /> {saving ? 'Saving...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}