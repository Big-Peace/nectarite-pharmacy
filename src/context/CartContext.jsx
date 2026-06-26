import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

function loadSettings() {
  const saved = localStorage.getItem('nectarite_settings')
  return saved ? JSON.parse(saved) : { deliveryFee: 1500, freeThreshold: 10000 }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    const saved = localStorage.getItem('nectarite_cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('nectarite_cart', JSON.stringify(cart))
  }, [cart])

  // Listen for settings changes
  useEffect(() => {
    const handleStorage = () => setSettings(loadSettings())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }, [removeFromCart])

  const clearCart = useCallback(() => setCart([]), [])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const currentSettings = loadSettings()
  const deliveryFee = subtotal >= currentSettings.freeThreshold ? 0 : currentSettings.deliveryFee
  const total = subtotal + deliveryFee

  return (
    <CartContext.Provider value={{
      cart, isOpen, setIsOpen, addToCart, removeFromCart,
      updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total,
      settings: currentSettings
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)