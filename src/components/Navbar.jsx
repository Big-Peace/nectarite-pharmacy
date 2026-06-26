import { Link } from 'react-router-dom'
import { ShoppingCart, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { openWhatsApp } from '../lib/whatsapp'

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <nav style={{
      background: '#ffffff',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
      }}>
        <img 
          src="/Nectarite Logo.png" 
          alt="Nectarite Pharmacy" 
          style={{ height: '40px', width: 'auto' }}
        />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/shop" style={linkStyle}>Shop</Link>
        
        <button onClick={() => setIsOpen(true)} style={iconBtnStyle}>
          <ShoppingCart size={22} />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#d9261c',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 'bold',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{totalItems}</span>
          )}
        </button>

        <button onClick={() => openWhatsApp()} style={{
          background: '#85c226',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.9rem'
        }}>
          <Phone size={16} /> WhatsApp
        </button>
      </div>
    </nav>
  )
}

const linkStyle = {
  textDecoration: 'none',
  color: '#4B5563',
  fontWeight: '500',
  fontSize: '0.95rem'
}

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  color: '#4B5563',
  padding: '8px'
}