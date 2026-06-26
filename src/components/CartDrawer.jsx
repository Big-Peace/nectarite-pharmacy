import { Link } from 'react-router-dom'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../lib/whatsapp'

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div onClick={() => setIsOpen(false)} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50
      }} />
      <div style={{
        position: 'fixed', right: 0, top: 0, height: '100%', width: '100%',
        maxWidth: '400px', background: 'white', zIndex: 60, display: 'flex',
        flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} /> Cart ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px' }} />
              <p>Your cart is empty</p>
              <Link to="/shop" onClick={() => setIsOpen(false)} style={{ color: '#d9261c', fontWeight: '500' }}>
                Browse Products →
              </Link>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', background: '#F9FAFB', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: 'white', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.5rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {item.image && typeof item.image === 'string' && item.image.startsWith('data:image') ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span>{typeof item.image === 'string' && item.image.length <= 10 ? item.image : '💊'}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.name}</p>
                  <p style={{ color: '#d9261c', fontWeight: '600', fontSize: '0.9rem' }}>{formatCurrency(item.price)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={qtyBtn}><Minus size={14} /></button>
                    <span style={{ fontWeight: '500' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={qtyBtn}><Plus size={14} /></button>
                    <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', color: '#d9261c', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
            </div>
            <Link to="/cart" onClick={() => setIsOpen(false)} style={{
              display: 'block', width: '100%', background: '#85c226', color: 'white',
              textAlign: 'center', padding: '12px', borderRadius: '8px',
              textDecoration: 'none', fontWeight: '600'
            }}>
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

const qtyBtn = {
  background: 'white',
  border: '1px solid #D1D5DB',
  borderRadius: '4px',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}