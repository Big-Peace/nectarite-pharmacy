export default function Footer() {
  return (
    <footer style={{
      background: '#111827',
      color: '#D1D5DB',
      padding: '48px 24px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px',
        marginBottom: '32px'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '1.1rem',
            marginBottom: '16px',
            fontFamily: 'Georgia, serif'
          }}>
            Nectarite Pharmacy
          </h3>
          <p style={{
            fontSize: '0.9rem',
            lineHeight: '1.7',
            color: '#9CA3AF',
            marginBottom: '16px'
          }}>
            Your trusted online pharmacy. Genuine medicines, expert consultations, and wellness products delivered to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '1.1rem',
            marginBottom: '16px'
          }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/" style={footerLink}>Home</a>
            <a href="/shop" style={footerLink}>Shop</a>
            <a href="/cart" style={footerLink}>Cart</a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '1.1rem',
            marginBottom: '16px'
          }}>
            Contact Us
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📍</span>
              <span style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#9CA3AF' }}>
                2 Olorunwa Close,<br />
                Opposite 87 Karimu Laka St,<br />
                Egbeda, Lagos
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>📞</span>
              <a href="tel:+2348175800735" style={{
                color: '#85c226',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                +234 817 580 0735
              </a>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💬</span>
              <a href="https://wa.me/2348175800735" target="_blank" rel="noopener" style={{
                color: '#85c226',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem'
              }}>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #374151',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#6B7280'
      }}>
        <p>© 2026 Nectarite Pharmacy. All rights reserved. NAFDAC Approved.</p>
      </div>
    </footer>
  )
}

const footerLink = {
  color: '#9CA3AF',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.2s'
}