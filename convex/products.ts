import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Get all active products for the store
export const getActiveProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('isActive'), true))
      .order('desc')
      .collect()
  },
})

// Get all products (for admin)
export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('products')
      .order('desc')
      .collect()
  },
})

// Get single product by ID
export const getProductById = query({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId)
  },
})

// Add new product (admin only)
export const addProduct = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.float64(),
    salePrice: v.optional(v.float64()),
    imageUrl: v.optional(v.string()),
    isFeatured: v.boolean(),
    isNew: v.boolean(),
    requiresPrescription: v.boolean(),
    stockQuantity: v.int64(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    return await ctx.db.insert('products', {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
  },
})

// Update product (admin only)
export const updateProduct = mutation({
  args: {
    productId: v.id('products'),
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
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args
    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  },
})

// Delete product (soft delete - sets inactive)
export const deleteProduct = mutation({
  args: { productId: v.id('products') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, { isActive: false })
  },
})