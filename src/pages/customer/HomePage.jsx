import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ArrowRight, Shield, Truck, Star, Phone } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import { openWhatsApp } from '../../lib/whatsapp'

export default function HomePage() {
  const products = useQuery(api.products.getActiveProducts)
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 8)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <Shield size={16} className="text-amber-400" />
              NAFDAC Approved Pharmacy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
              Your Health,{' '}
              <span className="text-amber-400">Our Priority</span>
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Premium pharmaceutical care delivered to your doorstep. 
              Genuine medicines, expert consultations, and wellness products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-amber-500 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-amber-400 transition-all inline-flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => openWhatsApp('Hello Nectarite Pharmacy, I want to place an order')}
                className="bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all inline-flex items-center gap-2"
              >
                <Phone size={18} />
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { icon: Shield, label: 'NAFDAC Approved' },
              { icon: Truck, label: 'Fast Delivery' },
              { icon: Star, label: '4.8/5 Rating' },
              { icon: Phone, label: 'WhatsApp Ordering' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <item.icon size={16} className="text-emerald-600" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 font-serif">Popular Products</h2>
              <p className="text-gray-500 mt-2">Top-selling items our customers love</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/shop" className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center gap-2">
                View All Products <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-lg">
              <h2 className="text-3xl font-bold font-serif mb-3">Order Instantly on WhatsApp</h2>
              <p className="text-white/90">
                Send us your prescription or product list. Our pharmacists will confirm 
                your order and arrange delivery within minutes.
              </p>
            </div>
            <button
              onClick={() => openWhatsApp('Hello Nectarite Pharmacy, I want to place an order')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl flex items-center gap-3 flex-shrink-0"
            >
              <Phone size={22} />
              Start WhatsApp Order
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}