import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { useCart } from './context/CartContext'
import { formatCurrency, openWhatsApp } from './lib/whatsapp'
import { useState, useRef } from 'react'

// ============== INITIAL PRODUCTS ==============
const INITIAL_PRODUCTS = [
  { id: '1', name: 'Amodiaquine Suspension', category: 'Prescription', description: 'Antimalarial • 60ml', price: 2500, image: null },
  { id: '2', name: 'Vitamin C + Zinc Complex', category: 'Supplements', description: 'Immune Support • 30 Tabs', price: 4000, salePrice: 3200, image: null, isFeatured: true },
  { id: '3', name: 'Hand Sanitizer', category: 'Personal Care', description: 'Kills 99.9% Germs • 500ml', price: 2500, salePrice: 1800, image: null, isFeatured: true },
  { id: '4', name: 'First Aid Kit', category: 'First Aid', description: 'Home & Office • 50 Pieces', price: 8500, image: null, isFeatured: true },
  { id: '5', name: 'Paracetamol 500mg', category: 'Prescription', description: 'Pain Relief • 100 Tabs', price: 1500, image: null },
  { id: '6', name: 'Omega-3 Fish Oil', category: 'Supplements', description: 'Heart Health • 60 Caps', price: 6500, salePrice: 5200, image: null, isFeatured: true },
  { id: '7', name: 'Digital Thermometer', category: 'Medical Devices', description: 'Fast Reading • LCD Display', price: 3500, image: null },
  { id: '8', name: 'Baby Diapers Pack', category: 'Mother & Baby', description: 'Newborn • 60 Pieces', price: 7500, salePrice: 6200, image: null },
]

function loadProducts() {
  const saved = localStorage.getItem('nectarite_products')
  return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
}

function saveProducts(products) {
  localStorage.setItem('nectarite_products', JSON.stringify(products))
}

// ============== SETTINGS ==============
function loadSettings() {
  const saved = localStorage.getItem('nectarite_settings')
  return saved ? JSON.parse(saved) : { deliveryFee: 1500, freeThreshold: 10000 }
}

function saveSettings(settings) {
  localStorage.setItem('nectarite_settings', JSON.stringify(settings))
}

// ============== IMAGE DISPLAY HELPER ==============
function isBase64Image(str) {
  return str && typeof str === 'string' && str.startsWith('data:image')
}

function isEmoji(str) {
  return str && typeof str === 'string' && str.length <= 10 && !str.startsWith('data:')
}

function ProductImage({ image, alt, size = 'large' }) {
  const dimensions = {
    small: { width: '48px', height: '48px', fontSize: '1.5rem', borderRadius: '8px' },
    medium: { width: '60px', height: '60px', fontSize: '1.5rem', borderRadius: '8px' },
    large: { width: '100%', height: '100%', fontSize: '3rem', borderRadius: '0' }
  }
  const s = dimensions[size] || dimensions.large

  const containerStyle = {
    width: s.width,
    height: s.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }

  if (isBase64Image(image)) {
    return (
      <div style={containerStyle}>
        <img
          src={image}
          alt={alt || 'Product'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: s.borderRadius
          }}
        />
      </div>
    )
  }

  if (isEmoji(image)) {
    return (
      <div style={containerStyle}>
        <span style={{ fontSize: s.fontSize }}>{image}</span>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <span style={{ fontSize: s.fontSize }}>💊</span>
    </div>
  )
}

// ============== PRODUCT CARD ==============
function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = cart.find(item => item.id === product.id)
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const displayPrice = hasDiscount ? product.salePrice : product.price

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: product.image
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #F3F4F6',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 15px 50px rgba(217,38,28,0.4), 0 0 0 3px rgba(217,38,28,0.15)'
      e.currentTarget.style.transform = 'translateY(-6px)'
      e.currentTarget.style.borderColor = '#d9261c'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = '#F3F4F6'
    }}>
      <div style={{
        height: '200px',
        background: '#F9FAFB',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ProductImage image={product.image} alt={product.name} size="large" />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {hasDiscount && (
            <span style={{
              background: '#d9261c',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px'
            }}>
              -{Math.round((1 - product.salePrice / product.price) * 100)}% OFF
            </span>
          )}
          {product.isNew && (
            <span style={{
              background: '#85c226',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>NEW</span>
          )}
        </div>
        {inCart && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#d9261c',
            color: '#ffffff',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            {inCart.quantity}
          </div>
        )}
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{
          color: '#85c226',
          fontSize: '0.7rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '6px'
        }}>
          {product.category}
        </p>
        <h3 style={{
          fontWeight: '700',
          fontSize: '1rem',
          color: '#111827',
          marginBottom: '4px',
          lineHeight: '1.3'
        }}>
          {product.name}
        </h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '16px' }}>
          {product.description}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#85c226'
          }}>
            {formatCurrency(displayPrice)}
          </span>
          {hasDiscount && (
            <span style={{
              textDecoration: 'line-through',
              color: '#D1D5DB',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        {inCart ? (
          <div style={{
            background: '#f2fae6',
            color: '#5c8a1a',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>✓</span> {inCart.quantity} in Cart
          </div>
        ) : (
          <button onClick={handleAdd} style={{
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: added ? '#d9261c' : '#85c226',
            color: '#ffffff',
            transition: 'all 0.2s ease'
          }}>
            {added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}

// ============== HOME PAGE ==============
function HomePage() {
  const products = loadProducts()
  const allFeatured = products.filter(p => p.isFeatured).slice(0, 8)

  return (
    <div>
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #5c8a1a 0%, #6aa01e 25%, #85c226 50%, #5c8a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff'
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(217,38,28,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '500', marginBottom: '28px' }}>
              <span style={{ color: '#d9261c' }}>✓</span> NAFDAC Approved Pharmacy
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Your Health,<br /><span style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Our Priority</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px' }}>
              Premium pharmaceutical care delivered to your doorstep. Genuine medicines, expert consultations, and wellness products — all just a tap away.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/shop" style={{ background: '#d9261c', color: '#ffffff', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: 'all 0.3s ease', boxShadow: '0 8px 25px rgba(217,38,28,0.3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#b51d14'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(217,38,28,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#d9261c'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(217,38,28,0.3)' }}>
                Shop Now <span>→</span>
              </a>
              <button onClick={() => openWhatsApp()} style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '2px solid rgba(255,255,255,0.3)', padding: '16px 32px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                📱 Order via WhatsApp
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '💊', title: 'Prescription Refills', desc: 'Fast & accurate dispensing' },
              { icon: '🩺', title: 'Pharmacist Consultation', desc: 'Free expert advice' },
              { icon: '🚚', title: 'Same-Day Delivery', desc: 'Lagos & Abuja metro areas' },
              { icon: '🔒', title: '100% Genuine Products', desc: 'NAFDAC-verified medicines' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderLeft: '3px solid #d9261c', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s ease' }}>
                <div style={{ width: '52px', height: '52px', background: 'rgba(217,38,28,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px', color: '#ffffff' }}>{item.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #F3F4F6', padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {[
          { icon: '🏅', text: 'NAFDAC Approved' },
          { icon: '🚚', text: 'Fast Delivery' },
          { icon: '🛡️', text: 'Secure Shopping' },
          { icon: '⭐', text: '4.8/5 Rating' },
          { icon: '📱', text: 'WhatsApp Ordering' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '500', color: '#4B5563' }}>
            <span>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      {allFeatured.length > 0 && (
        <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span style={{ display: 'inline-block', background: '#f2fae6', color: '#5c8a1a', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '16px' }}>✨ Featured Products</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Popular Items</h2>
              <p style={{ color: '#6B7280', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto' }}>Top-selling products our customers love</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {allFeatured.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <a href="/shop" style={{ color: '#d9261c', fontWeight: '600', textDecoration: 'none', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>View All Products <span>→</span></a>
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section style={{ padding: '80px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Why Choose Nectarite</h2>
            <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>The pharmacy that puts your health first</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '32px' }}>
            {[
              { icon: '💊', title: '100% Genuine', desc: 'All medicines are NAFDAC-registered and sourced directly from certified manufacturers.' },
              { icon: '🚚', title: 'Reliable Delivery', desc: 'Same-day delivery in Lagos & Abuja. Nationwide shipping within 2-3 business days.' },
              { icon: '🩺', title: 'Expert Pharmacists', desc: 'Free consultations with licensed pharmacists to guide your health decisions.' },
              { icon: '💰', title: 'Affordable Prices', desc: 'Competitive pricing with regular discounts. Quality healthcare shouldn\'t break the bank.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.6rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111827', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / VISIT US */}
      <section style={{ padding: '60px 24px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Visit Us</h2>
          <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '1rem' }}>We're here to serve you</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', background: '#fef2f2', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>📍</div>
              <h3 style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111827', marginBottom: '8px' }}>Our Location</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.7' }}>2 Olorunwa Close,<br />Opposite 87 Karimu Laka St,<br />Egbeda, Lagos</p>
            </div>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', background: '#f2fae6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>📞</div>
              <h3 style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111827', marginBottom: '8px' }}>Call Us</h3>
              <a href="tel:+2348175800735" style={{ color: '#85c226', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none' }}>+234 817 580 0735</a>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>Mon - Sat, 8am - 8pm</p>
            </div>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', background: '#f2fae6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>💬</div>
              <h3 style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111827', marginBottom: '8px' }}>WhatsApp</h3>
              <button onClick={() => openWhatsApp()} style={{ background: 'none', border: 'none', color: '#85c226', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>Chat with Us</button>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px' }}>Instant response</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section style={{ background: 'linear-gradient(135deg, #5c8a1a 0%, #85c226 50%, #6aa01e 100%)', padding: '70px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>Order Instantly on WhatsApp</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', marginBottom: '32px', lineHeight: '1.7' }}>Send us your prescription or product list. Our pharmacists will confirm your order and arrange delivery within minutes.</p>
          <button onClick={() => openWhatsApp()} style={{ background: '#d9261c', color: '#ffffff', padding: '18px 40px', borderRadius: '14px', fontWeight: '700', fontSize: '1.1rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px', boxShadow: '0 12px 40px rgba(217,38,28,0.4)', transition: 'all 0.3s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#b51d14'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 18px 50px rgba(217,38,28,0.6)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#d9261c'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(217,38,28,0.4)' }}>
            📱 Start WhatsApp Order
          </button>
        </div>
      </section>
    </div>
  )
}

// ============== SHOP PAGE ==============
function ShopPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const products = loadProducts()
  const categories = ['All', ...new Set(products.map(p => p.category))]
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || p.category === category
    return matchSearch && matchCategory
  })

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ display: 'inline-block', background: '#f2fae6', color: '#5c8a1a', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px' }}>🛍️ All Products</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', fontFamily: 'Georgia, serif' }}>Our Pharmacy Range</h1>
          <p style={{ color: '#6B7280', fontSize: '1.05rem' }}>Genuine NAFDAC-approved products at competitive prices</p>
        </div>
        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 24px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>🔍</span>
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 44px', border: '2px solid #E5E7EB', borderRadius: '14px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', background: '#ffffff' }}
            onFocus={(e) => e.target.style.borderColor = '#d9261c'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '10px 20px', borderRadius: '50px', border: '2px solid', borderColor: category === cat ? '#d9261c' : '#E5E7EB', background: category === cat ? '#d9261c' : '#ffffff', color: category === cat ? '#ffffff' : '#4B5563', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s ease' }}>{cat}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#374151', margin: '16px 0 8px' }}>No products found</h3>
            <p style={{ color: '#9CA3AF' }}>Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============== CART PAGE ==============
function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryFee, total, clearCart, settings } = useCart()
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', note: '' })

  const handleCheckout = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required fields')
      return
    }
    let message = '🛒 *NEW ORDER - Nectarite Pharmacy*\n\n*Items:*\n'
    cart.forEach((item, i) => { message += `${i + 1}. ${item.name} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}\n` })
    message += `\n*Subtotal:* ${formatCurrency(subtotal)}\n`
    message += `*Delivery:* ${deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}\n`
    message += `*TOTAL:* ${formatCurrency(total)}\n\n`
    message += `*Name:* ${customerInfo.name}\n*Phone:* ${customerInfo.phone}\n*Address:* ${customerInfo.address}\n`
    if (customerInfo.note) message += `*Note:* ${customerInfo.note}\n`
    message += '\n_Please confirm this order. Thank you!_ 🙏'
    openWhatsApp(message)
    clearCart()
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', background: '#F9FAFB', minHeight: '60vh' }}>
        <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🛒</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: '#6B7280', marginBottom: '24px' }}>Browse our products and add items to your cart</p>
        <a href="/shop" style={{ background: '#d9261c', color: '#ffffff', padding: '14px 32px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>🛍️ Browse Products</a>
      </div>
    )
  }

  return (
    <div style={{ background: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '32px', fontFamily: 'Georgia, serif' }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
          <div>
            {cart.map(item => (
              <div key={item.id} style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #F3F4F6', display: 'flex', gap: '16px', marginBottom: '14px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', flexShrink: 0 }}>
                  {item.image && typeof item.image === 'string' && item.image.startsWith('data:image') ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: '1.8rem' }}>{item.image && typeof item.image === 'string' && item.image.length <= 10 ? item.image : '💊'}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '2px' }}>{item.name}</h3>
                  <p style={{ color: '#d9261c', fontWeight: '700', fontSize: '1.05rem' }}>{formatCurrency(item.price)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyBtn}>−</button>
                    <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', color: '#d9261c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem' }}>🗑️ Remove</button>
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.15rem', color: '#111827' }}>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', position: 'sticky', top: '88px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '20px', color: '#111827' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#6B7280' }}><span>Subtotal</span><span style={{ fontWeight: '600', color: '#374151' }}>{formatCurrency(subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#6B7280' }}>
              <span>Delivery Fee</span>
              <span style={{ fontWeight: '600', color: deliveryFee === 0 ? '#85c226' : '#374151' }}>{deliveryFee === 0 ? 'FREE 🎉' : formatCurrency(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Free delivery on orders over {formatCurrency(settings?.freeThreshold || 10000)}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #d9261c', marginTop: '12px', fontWeight: '700', fontSize: '1.2rem', color: '#111827' }}>
              <span>Total</span><span style={{ color: '#d9261c' }}>{formatCurrency(total)}</span>
            </div>
            <div style={{ marginTop: '24px' }}>
              <p style={{ fontWeight: '600', color: '#374151', marginBottom: '12px', fontSize: '0.95rem' }}>Delivery Details</p>
              <input type="text" placeholder="Full Name *" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={checkoutInput} />
              <input type="tel" placeholder="Phone Number *" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={checkoutInput} />
              <textarea placeholder="Delivery Address *" value={customerInfo.address} rows={2} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} style={{...checkoutInput, resize: 'none'}} />
              <textarea placeholder="Additional Note (optional)" value={customerInfo.note} rows={2} onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})} style={{...checkoutInput, resize: 'none'}} />
              <button onClick={handleCheckout} style={{ width: '100%', padding: '16px', background: '#d9261c', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 30px rgba(217,38,28,0.3)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#b51d14'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(217,38,28,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#d9261c'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(217,38,28,0.3)' }}>
                📱 Checkout via WhatsApp
              </button>
              <a href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '12px', color: '#d9261c', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>← Continue Shopping</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============== ADMIN PAGES ==============
function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'nectarite2026') { localStorage.setItem('nectarite_admin', 'true'); window.location.href = '/admin/dashboard' }
    else setError('Invalid password')
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #5c8a1a, #85c226)', padding: '24px' }}>
      <div style={{ background: '#ffffff', padding: '48px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <img src="/Nectarite Logo.png" alt="Nectarite" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', fontFamily: 'Georgia, serif' }}>Admin Login</h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: '4px' }}>Nectarite Pharmacy Management</p>
        </div>
        {error && <div style={{ background: '#FEF2F2', color: '#d9261c', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '16px', border: '2px solid #E5E7EB', borderRadius: '14px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '4px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#d9261c'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
          <button type="submit" style={{ width: '100%', padding: '16px', background: '#d9261c', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#b51d14'} onMouseLeave={(e) => e.currentTarget.style.background = '#d9261c'}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

function AdminDashboard() {
  if (!localStorage.getItem('nectarite_admin')) { window.location.href = '/admin'; return null }
  const products = loadProducts()
  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <nav style={{ background: '#ffffff', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/Nectarite Logo.png" alt="Nectarite" style={{ height: '36px', width: 'auto' }} />
          <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#111827' }}>Admin Panel</span>
        </div>
        <button onClick={() => { localStorage.removeItem('nectarite_admin'); window.location.href = '/admin' }} style={{ background: 'none', border: 'none', color: '#d9261c', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>Sign Out →</button>
      </nav>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', marginBottom: '28px' }}>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {[
            { label: 'Total Products', value: products.length, color: '#85c226', icon: '📦' },
            { label: 'Total Orders', value: '0', color: '#85c226', icon: '🛒' },
            { label: 'Revenue', value: '₦0', color: '#85c226', icon: '💰' },
            { label: 'Pending Orders', value: '0', color: '#d9261c', icon: '⏳' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', background: stat.color === '#d9261c' ? '#fef2f2' : '#f2fae6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{stat.icon}</div>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '2px' }}>{stat.value}</p>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          <a href="/admin/products" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
              <h3 style={{ fontWeight: '700', fontSize: '1.15rem', margin: '12px 0 4px', color: '#111827' }}>Manage Products</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Add, edit, or remove products from the store</p>
              <span style={{ color: '#d9261c', fontWeight: '600', fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>+ Add New Product →</span>
            </div>
          </a>
          <a href="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '2rem' }}>📋</span>
              <h3 style={{ fontWeight: '700', fontSize: '1.15rem', margin: '12px 0 4px', color: '#111827' }}>View Orders</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Track and manage customer orders in real-time</p>
            </div>
          </a>
          <a href="/admin/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <span style={{ fontSize: '2rem' }}>⚙️</span>
              <h3 style={{ fontWeight: '700', fontSize: '1.15rem', margin: '12px 0 4px', color: '#111827' }}>Settings</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Delivery fees and store configuration</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

function ImageUpload({ currentImage, onImageChange }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(currentImage || null)
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return }
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return }
    const reader = new FileReader()
    reader.onload = (event) => { setPreview(event.target.result); onImageChange(event.target.result) }
    reader.readAsDataURL(file)
  }
  const handleRemove = () => { setPreview(null); onImageChange(null); if (fileInputRef.current) fileInputRef.current.value = '' }
  return (
    <div>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem', color: '#374151' }}>Product Image</label>
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
          <img src={preview} alt="Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '14px', border: '2px solid #E5E7EB' }} />
          <button onClick={handleRemove} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#d9261c', color: '#ffffff', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 12px rgba(217,38,28,0.4)' }}>✕</button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} style={{ width: '200px', height: '200px', border: '2px dashed #D1D5DB', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#F9FAFB', transition: 'all 0.2s', marginBottom: '12px' }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📷</span>
          <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: '500' }}>Click to upload</span>
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>JPG, PNG, GIF (max 5MB)</span>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
      {preview && <button onClick={() => fileInputRef.current?.click()} style={{ display: 'block', background: 'none', border: 'none', color: '#d9261c', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px' }}>Change Image</button>}
    </div>
  )
}

function AdminProducts() {
  if (!localStorage.getItem('nectarite_admin')) { window.location.href = '/admin'; return null }
  const [products, setProducts] = useState(loadProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'Prescription', description: '', price: '', salePrice: '', image: null, isFeatured: false, isNew: false })
  const handleImageChange = (base64) => setForm(prev => ({ ...prev, image: base64 }))
  const handleSubmit = (e) => {
    e.preventDefault()
    const productData = { name: form.name, category: form.category, description: form.description, price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined, image: form.image, isFeatured: form.isFeatured, isNew: form.isNew }
    let updated = editingProduct ? products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p) : [...products, { id: Date.now().toString(), ...productData }]
    setProducts(updated); saveProducts(updated); setShowForm(false); setEditingProduct(null)
    setForm({ name: '', category: 'Prescription', description: '', price: '', salePrice: '', image: null, isFeatured: false, isNew: false })
  }
  const handleEdit = (product) => { setEditingProduct(product); setForm({ name: product.name, category: product.category, description: product.description, price: product.price.toString(), salePrice: product.salePrice?.toString() || '', image: product.image || null, isFeatured: product.isFeatured || false, isNew: product.isNew || false }); setShowForm(true) }
  const handleDelete = (id) => { if (confirm('Delete this product?')) { const updated = products.filter(p => p.id !== id); setProducts(updated); saveProducts(updated) } }
  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div><a href="/admin/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Dashboard</a><h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', marginTop: '4px' }}>Products</h1></div>
          <button onClick={() => { setShowForm(!showForm); setEditingProduct(null); setForm({ name: '', category: 'Prescription', description: '', price: '', salePrice: '', image: null, isFeatured: false, isNew: false }) }} style={{ background: '#d9261c', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#b51d14'} onMouseLeave={(e) => e.currentTarget.style.background = '#d9261c'}>+ Add Product</button>
        </div>
        {showForm && (
          <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #F3F4F6', marginBottom: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '20px', color: '#111827' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <input type="text" placeholder="Product Name *" value={form.name} required onChange={e => setForm({...form, name: e.target.value})} style={adminInput} />
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={adminInput}>
                  {['Prescription', 'Supplements', 'Personal Care', 'Mother & Baby', 'Medical Devices', 'First Aid', 'Herbal'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={adminInput} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input type="number" placeholder="Price (₦) *" value={form.price} required onChange={e => setForm({...form, price: e.target.value})} style={adminInput} />
                  <input type="number" placeholder="Sale Price (₦)" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} style={adminInput} />
                </div>
                <ImageUpload currentImage={form.image} onImageChange={handleImageChange} />
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} style={{ width: '18px', height: '18px' }} /> Featured Product</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}><input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} style={{ width: '18px', height: '18px' }} /> Mark as New</label>
                </div>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <button type="submit" style={{ background: '#85c226', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = '#6aa01e'} onMouseLeave={(e) => e.currentTarget.style.background = '#85c226'}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ background: '#E5E7EB', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #F3F4F6', overflow: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}><th style={thStyle}>Product</th><th style={thStyle}>Category</th><th style={thStyle}>Price</th><th style={thStyle}>Featured</th><th style={thStyle}>Actions</th></tr></thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}><div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}><ProductImage image={product.image} alt={product.name} size="small" /></div><div><p style={{ fontWeight: '600', color: '#111827' }}>{product.name}</p><p style={{ color: '#6B7280', fontSize: '0.8rem' }}>{product.description}</p></div></div></td>
                  <td style={tdStyle}><span style={{ background: '#fef2f2', color: '#d9261c', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>{product.category}</span></td>
                  <td style={tdStyle}><span style={{ fontWeight: '700', color: '#85c226' }}>{formatCurrency(product.salePrice || product.price)}</span>{product.salePrice && <span style={{ textDecoration: 'line-through', color: '#D1D5DB', fontSize: '0.8rem', marginLeft: '8px' }}>{formatCurrency(product.price)}</span>}</td>
                  <td style={tdStyle}>{product.isFeatured ? '⭐' : '—'}</td>
                  <td style={tdStyle}><button onClick={() => handleEdit(product)} style={{...actionBtn, color: '#85c226'}}>✏️ Edit</button><button onClick={() => handleDelete(product.id)} style={{...actionBtn, color: '#d9261c'}}>🗑️ Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminOrders() {
  if (!localStorage.getItem('nectarite_admin')) { window.location.href = '/admin'; return null }
  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <a href="/admin/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Dashboard</a>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', marginTop: '4px', marginBottom: '28px' }}>Orders</h1>
        <div style={{ background: '#ffffff', padding: '80px 24px', borderRadius: '16px', border: '1px solid #F3F4F6', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '16px' }}>📋</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>No orders yet</h3>
          <p style={{ color: '#6B7280' }}>Customer orders placed via WhatsApp will appear here</p>
        </div>
      </div>
    </div>
  )
}

function AdminSettings() {
  if (!localStorage.getItem('nectarite_admin')) { window.location.href = '/admin'; return null }
  const [settings, setSettings] = useState(loadSettings)
  const [form, setForm] = useState({ deliveryFee: settings.deliveryFee.toString(), freeThreshold: settings.freeThreshold.toString() })
  const [saved, setSaved] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    const newSettings = { deliveryFee: parseFloat(form.deliveryFee) || 1500, freeThreshold: parseFloat(form.freeThreshold) || 10000 }
    setSettings(newSettings); saveSettings(newSettings); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }
  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <a href="/admin/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Dashboard</a>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#111827', marginTop: '4px', marginBottom: '28px' }}>Settings</h1>
        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '24px', color: '#111827' }}>💰 Delivery Settings</h3>
          {saved && <div style={{ background: '#f2fae6', color: '#5c8a1a', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600' }}>✅ Settings saved successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem', color: '#374151' }}>Delivery Fee (₦)</label>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>Amount charged for delivery on orders below the free threshold</p>
                <input type="number" value={form.deliveryFee} onChange={e => setForm({...form, deliveryFee: e.target.value})} style={{ width: '100%', padding: '14px', border: '2px solid #E5E7EB', borderRadius: '12px', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} onFocus={(e) => e.target.style.borderColor = '#85c226'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem', color: '#374151' }}>Free Delivery Threshold (₦)</label>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>Orders above this amount get free delivery</p>
                <input type="number" value={form.freeThreshold} onChange={e => setForm({...form, freeThreshold: e.target.value})} style={{ width: '100%', padding: '14px', border: '2px solid #E5E7EB', borderRadius: '12px', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} onFocus={(e) => e.target.style.borderColor = '#85c226'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <p style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>📋 Current Rules:</p>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>• Delivery fee: <strong style={{ color: '#d9261c' }}>₦{parseFloat(form.deliveryFee).toLocaleString()}</strong><br />• Free delivery on orders over: <strong style={{ color: '#85c226' }}>₦{parseFloat(form.freeThreshold).toLocaleString()}</strong></p>
              </div>
              <button type="submit" style={{ background: '#85c226', color: '#ffffff', border: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#6aa01e'} onMouseLeave={(e) => e.currentTarget.style.background = '#85c226'}>💾 Save Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ============== APP ==============
export default function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <CartProvider>
        <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
          {!isAdminRoute && <Navbar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <CartDrawer />}
          <Toaster position="bottom-right" />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

// ============== SHARED STYLES ==============
const thStyle = { padding: '14px 18px', textAlign: 'left', fontSize: '0.8rem', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }
const tdStyle = { padding: '14px 18px', fontSize: '0.9rem' }
const actionBtn = { background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', marginRight: '14px' }
const qtyBtn = { width: '32px', height: '32px', background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: '700', fontSize: '1rem' }
const checkoutInput = { width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', marginBottom: '10px', boxSizing: 'border-box', transition: 'border-color 0.2s' }
const adminInput = { width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }