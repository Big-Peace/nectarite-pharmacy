import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Products table - managed by admin
  products: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.float64(),
    salePrice: v.optional(v.float64()),
    imageUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
    isNew: v.boolean(),
    isActive: v.boolean(),
    requiresPrescription: v.boolean(),
    stockQuantity: v.int64(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_category', ['category'])
    .index('by_active', ['isActive']),

  // Orders table - created when customer checks out via WhatsApp
  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    customerAddress: v.string(),
    items: v.array(v.object({
      productId: v.id('products'),
      name: v.string(),
      price: v.float64(),
      quantity: v.int64(),
      imageUrl: v.optional(v.string()),
    })),
    subtotal: v.float64(),
    deliveryFee: v.float64(),
    total: v.float64(),
    status: v.string(), // 'pending', 'confirmed', 'delivered', 'cancelled'
    note: v.optional(v.string()),
    createdAt: v.string(),
  }).index('by_status', ['status']),
})