import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../lib/whatsapp'

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = cart.find(item => item.id === product.id)
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const displayPrice = hasDiscount ? product.salePrice : product.price

  const handleAdd = () => {
    addToCart({ ...product, image: product.image || '💊' })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #E5E7EB',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{
        height: '180px',
        background: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        position: 'relative'
      }}>
        {product.image || '💊'}
        {hasDiscount && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#EF4444', color: 'white', fontSize: '0.7rem',
            fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px'
          }}>
            -{Math.round((1 - product.salePrice / product.price) * 100)}%
          </span>
        )}
      </div>
      <div style={{ padding: '16px' }}>
        <p style={{ color: '#0D5E4E', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
          {product.category}
        </p>
        <h3 style={{ fontWeight: '600', margin: '4px 0', fontSize: '0.95rem' }}>{product.name}</h3>
        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '12px' }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0D5E4E' }}>
            {formatCurrency(displayPrice)}
          </span>
          {hasDiscount && (
            <span style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.85rem' }}>
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
        {inCart ? (
          <div style={{
            background: '#ECFDF5', color: '#0D5E4E', padding: '8px',
            borderRadius: '8px', textAlign: 'center', fontWeight: '500',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            <Check size={16} /> {inCart.quantity} in Cart
          </div>
        ) : (
          <button onClick={handleAdd} style={{
            width: '100%', padding: '10px', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: added ? '#10B981' : '#0D5E4E', color: 'white',
            transition: 'background 0.2s'
          }}>
            {added ? <><Check size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
          </button>
        )}
      </div>
    </div>
  )
}