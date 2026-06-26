const WHATSAPP_NUMBER = '2348175800735'

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦')
}

export function openWhatsApp(message) {
  const encoded = encodeURIComponent(message || 'Hello Nectarite Pharmacy')
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
}