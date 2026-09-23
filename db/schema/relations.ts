import { defineRelations } from "drizzle-orm";

import * as schema from "./index";

export const relations = defineRelations(schema, (r) => ({
  // =========================================================
  // USERS
  // =========================================================

  users: {
    addresses: r.many.addresses({
      from: r.users.id,
      to: r.addresses.userId,
    }),

    orders: r.many.orders({
      from: r.users.id,
      to: r.orders.userId,
    }),

    cart: r.one.carts({
      from: r.users.id,
      to: r.carts.userId,
    }),

    ratings: r.many.ratings({
      from: r.users.id,
      to: r.ratings.userId,
    }),

    wishlistItems: r.many.wishlistItems({
      from: r.users.id,
      to: r.wishlistItems.userId,
    }),

    contactMessages: r.many.contactMessages({
      from: r.users.id,
      to: r.contactMessages.userId,
    }),

    inventoryMovements: r.many.inventoryMovements({
      from: r.users.id,
      to: r.inventoryMovements.userId,
    }),
  },

  // =========================================================
  // CATEGORIES
  // =========================================================

  categories: {
    products: r.many.products({
      from: r.categories.id,
      to: r.products.categoryId,
    }),
  },

  // =========================================================
  // COLORS
  // =========================================================

  colors: {
    variants: r.many.productVariants({
      from: r.colors.id,
      to: r.productVariants.colorId,
    }),
  },

  // =========================================================
  // PRODUCTS
  // =========================================================

  products: {
    category: r.one.categories({
      from: r.products.categoryId,
      to: r.categories.id,
    }),

    images: r.many.productImages({
      from: r.products.id,
      to: r.productImages.productId,
    }),

    variants: r.many.productVariants({
      from: r.products.id,
      to: r.productVariants.productId,
    }),

    cartItems: r.many.cartItems({
      from: r.products.id,
      to: r.cartItems.productId,
    }),

    orderItems: r.many.orderItems({
      from: r.products.id,
      to: r.orderItems.productId,
    }),

    ratings: r.many.ratings({
      from: r.products.id,
      to: r.ratings.productId,
    }),

    wishlistItems: r.many.wishlistItems({
      from: r.products.id,
      to: r.wishlistItems.productId,
    }),
  },

  // =========================================================
  // PRODUCT VARIANTS
  // =========================================================

  productVariants: {
    product: r.one.products({
      from: r.productVariants.productId,
      to: r.products.id,
      optional: false,
    }),

    color: r.one.colors({
      from: r.productVariants.colorId,
      to: r.colors.id,
      optional: false,
    }),

    cartItems: r.many.cartItems({
      from: r.productVariants.id,
      to: r.cartItems.variantId,
    }),

    orderItems: r.many.orderItems({
      from: r.productVariants.id,
      to: r.orderItems.variantId,
    }),

    inventoryMovements: r.many.inventoryMovements({
      from: r.productVariants.id,
      to: r.inventoryMovements.variantId,
    }),
  },

  // =========================================================
  // PRODUCT IMAGES
  // =========================================================

  productImages: {
    product: r.one.products({
      from: r.productImages.productId,
      to: r.products.id,
    }),
  },

  // =========================================================
  // CARTS
  // =========================================================

  carts: {
    user: r.one.users({
      from: r.carts.userId,
      to: r.users.id,
    }),

    items: r.many.cartItems({
      from: r.carts.id,
      to: r.cartItems.cartId,
    }),
  },

  // =========================================================
  // CART ITEMS
  // =========================================================

  cartItems: {
    cart: r.one.carts({
      from: r.cartItems.cartId,
      to: r.carts.id,
      optional: false,
    }),

    product: r.one.products({
      from: r.cartItems.productId,
      to: r.products.id,
      optional: false,
    }),

    variant: r.one.productVariants({
      from: r.cartItems.variantId,
      to: r.productVariants.id,
      optional: false,
    }),
  },

  // =========================================================
  // ADDRESSES
  // =========================================================

  addresses: {
    user: r.one.users({
      from: r.addresses.userId,
      to: r.users.id,
    }),
  },

  // =========================================================
  // ORDERS
  // =========================================================

  orders: {
    user: r.one.users({
      from: r.orders.userId,
      to: r.users.id,
    }),

    shippingAddress: r.one.orderShippingAddresses({
      from: r.orders.id,
      to: r.orderShippingAddresses.orderId,
    }),

    items: r.many.orderItems({
      from: r.orders.id,
      to: r.orderItems.orderId,
    }),

    payments: r.many.payments({
      from: r.orders.id,
      to: r.payments.orderId,
    }),

    refunds: r.many.refunds({
      from: r.orders.id,
      to: r.refunds.orderId,
    }),

    inventoryMovements: r.many.inventoryMovements({
      from: r.orders.id,
      to: r.inventoryMovements.orderId,
    }),
  },

  // =========================================================
  // ORDER SHIPPING ADDRESSES
  // =========================================================

  orderShippingAddresses: {
    order: r.one.orders({
      from: r.orderShippingAddresses.orderId,
      to: r.orders.id,
    }),
  },

  // =========================================================
  // ORDER ITEMS
  // =========================================================

  orderItems: {
    order: r.one.orders({
      from: r.orderItems.orderId,
      to: r.orders.id,
    }),

    product: r.one.products({
      from: r.orderItems.productId,
      to: r.products.id,
    }),

    variant: r.one.productVariants({
      from: r.orderItems.variantId,
      to: r.productVariants.id,
    }),
  },

  // =========================================================
  // PAYMENTS
  // =========================================================

  payments: {
    order: r.one.orders({
      from: r.payments.orderId,
      to: r.orders.id,
    }),

    refunds: r.many.refunds({
      from: r.payments.id,
      to: r.refunds.paymentId,
    }),
  },

  // =========================================================
  // REFUNDS
  // =========================================================

  refunds: {
    payment: r.one.payments({
      from: r.refunds.paymentId,
      to: r.payments.id,
    }),

    order: r.one.orders({
      from: r.refunds.orderId,
      to: r.orders.id,
    }),
  },

  // =========================================================
  // RATINGS
  // =========================================================

  ratings: {
    product: r.one.products({
      from: r.ratings.productId,
      to: r.products.id,
    }),

    user: r.one.users({
      from: r.ratings.userId,
      to: r.users.id,
    }),
  },

  // =========================================================
  // WISHLIST
  // =========================================================

  wishlistItems: {
    user: r.one.users({
      from: r.wishlistItems.userId,
      to: r.users.id,
    }),

    product: r.one.products({
      from: r.wishlistItems.productId,
      to: r.products.id,
    }),
  },

  // =========================================================
  // ANNOUNCEMENTS
  // =========================================================

  announcements: {},

  // =========================================================
  // CONTACT MESSAGES
  // =========================================================

  contactMessages: {
    user: r.one.users({
      from: r.contactMessages.userId,
      to: r.users.id,
    }),
  },

  // =========================================================
  // NEWSLETTER
  // =========================================================

  newsletterSubscribers: {},

  // =========================================================
  // INVENTORY MOVEMENTS
  // =========================================================

  inventoryMovements: {
    variant: r.one.productVariants({
      from: r.inventoryMovements.variantId,
      to: r.productVariants.id,
    }),

    user: r.one.users({
      from: r.inventoryMovements.userId,
      to: r.users.id,
    }),

    order: r.one.orders({
      from: r.inventoryMovements.orderId,
      to: r.orders.id,
    }),
  },
}));
