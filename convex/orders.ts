import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Create order when customer checks out
export const createOrder = mutation({
  args: {
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
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert('orders', {
      ...args,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    return orderId
  },
})

// Get all orders (admin)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('orders')
      .order('desc')
      .collect()
  },
})

// Update order status (admin)
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status })
  },
})