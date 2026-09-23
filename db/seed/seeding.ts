import "dotenv/config";

import { randomUUID } from "crypto";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "@/db/drizzle";

import {
  users,
  addresses,
  categories,
  colors,
  products,
  productVariants,
  productImages,
  ratings,
  wishlistItems,
  carts,
  cartItems,
  orders,
  orderItems,
  payments,
  inventoryMovements,
  announcements,
  contactMessages,
  newsletterSubscribers,
} from "@/db/schema";

type OrderInsert = InferInsertModel<typeof orders>;

// ============================================================
// HELPERS
// ============================================================

const now = new Date();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// ============================================================
// IDS
// ============================================================

const userIds = {
  admin: randomUUID(),
  customer1: randomUUID(),
  customer2: randomUUID(),
  customer3: randomUUID(),
};

const categoryIds = {
  tote: randomUUID(),
  crossbody: randomUUID(),
  shoulder: randomUUID(),
  clutch: randomUUID(),
  laptop: randomUUID(),
};

const colorIds = {
  black: randomUUID(),
  brown: randomUUID(),
  tan: randomUUID(),
  wine: randomUUID(),
  green: randomUUID(),
  cream: randomUUID(),
  orange: randomUUID(),
};

const productIds = {
  classicTote: randomUUID(),
  crossbody: randomUUID(),
  shoulder: randomUUID(),
  clutch: randomUUID(),
  miniTote: randomUUID(),
  laptopBag: randomUUID(),
  structuredTote: randomUUID(),
  everydayBag: randomUUID(),
  boxClutch: randomUUID(),
  softShoulder: randomUUID(),
  travelTote: randomUUID(),
  executiveBag: randomUUID(),
};

// ============================================================
// VARIANT IDS
// ============================================================

const variantIds = {
  classicToteBrown: randomUUID(),
  classicToteBlack: randomUUID(),
  classicToteTan: randomUUID(),

  crossbodyBrown: randomUUID(),
  crossbodyBlack: randomUUID(),
  crossbodyWine: randomUUID(),

  shoulderBrown: randomUUID(),
  shoulderBlack: randomUUID(),
  shoulderGreen: randomUUID(),

  clutchBlack: randomUUID(),
  clutchWine: randomUUID(),
  clutchTan: randomUUID(),

  miniToteTan: randomUUID(),
  miniToteBrown: randomUUID(),
  miniToteBlack: randomUUID(),

  laptopBlack: randomUUID(),
  laptopBrown: randomUUID(),

  structuredBlack: randomUUID(),
  structuredBrown: randomUUID(),
  structuredTan: randomUUID(),

  everydayBrown: randomUUID(),
  everydayBlack: randomUUID(),

  boxClutchWine: randomUUID(),
  boxClutchBlack: randomUUID(),

  softShoulderBrown: randomUUID(),
  softShoulderGreen: randomUUID(),

  travelToteBrown: randomUUID(),
  travelToteBlack: randomUUID(),

  executiveBlack: randomUUID(),
  executiveBrown: randomUUID(),
};

// ============================================================
// CART IDS
// ============================================================

const cartIds = {
  customer1: randomUUID(),
  guest: randomUUID(),
};

// ============================================================
// ORDER IDS
// ============================================================

const orderIds = {
  first: randomUUID(),
  second: randomUUID(),
  third: randomUUID(),
};

// ============================================================
// ADDRESS IDS
// ============================================================

const addressIds = {
  customer1: randomUUID(),
  customer2: randomUUID(),
  customer3: randomUUID(),
};

// ============================================================
// PRODUCT IMAGE IDS
// ============================================================

const imageIds = {
  classicTote1: randomUUID(),
  classicTote2: randomUUID(),

  crossbody1: randomUUID(),
  crossbody2: randomUUID(),

  shoulder1: randomUUID(),
  shoulder2: randomUUID(),

  clutch1: randomUUID(),
  clutch2: randomUUID(),

  miniTote1: randomUUID(),
  miniTote2: randomUUID(),

  laptop1: randomUUID(),
  laptop2: randomUUID(),

  structured1: randomUUID(),
  structured2: randomUUID(),

  everyday1: randomUUID(),
  everyday2: randomUUID(),

  boxClutch1: randomUUID(),
  boxClutch2: randomUUID(),

  softShoulder1: randomUUID(),
  softShoulder2: randomUUID(),

  travel1: randomUUID(),
  travel2: randomUUID(),

  executive1: randomUUID(),
  executive2: randomUUID(),
};

// ============================================================
// SEED
// ============================================================

async function seed() {
  console.log("🌱 Starting SHOPPFD database seed...\n");

  // ==========================================================
  // CLEAR EXISTING DATA
  // ==========================================================

  console.log("🧹 Clearing existing seed data...");

  // Delete deepest child records first.

  await db.delete(payments);
  await db.delete(orderItems);
  await db.delete(orders);

  await db.delete(inventoryMovements);

  await db.delete(cartItems);
  await db.delete(carts);

  await db.delete(wishlistItems);
  await db.delete(ratings);

  await db.delete(contactMessages);
  await db.delete(newsletterSubscribers);

  await db.delete(addresses);

  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(products);

  await db.delete(announcements);

  await db.delete(colors);
  await db.delete(categories);

  await db.delete(users);

  // ==========================================================
  // USERS
  // ==========================================================

  console.log("👤 Creating users...");

  await db.insert(users).values([
    {
      id: userIds.admin,
      clerkId: "user_shoppfd_admin",
      email: "admin@shoppfd.com",
      firstName: "SHOPPFD",
      lastName: "Admin",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      phone: "+2348012345678",
      isBanned: false,
      role: "admin",
      createdAt: daysAgo(30),
      updatedAt: now,
    },

    {
      id: userIds.customer1,
      clerkId: "user_shoppfd_customer_001",
      email: "amara@example.com",
      firstName: "Amara",
      lastName: "Okafor",
      imageUrl:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
      phone: "+2348031234567",
      isBanned: false,
      role: "customer",
      createdAt: daysAgo(20),
      updatedAt: now,
    },

    {
      id: userIds.customer2,
      clerkId: "user_shoppfd_customer_002",
      email: "chidi@example.com",
      firstName: "Chidi",
      lastName: "Eze",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      phone: "+2348069876543",
      isBanned: false,
      role: "customer",
      createdAt: daysAgo(15),
      updatedAt: now,
    },

    {
      id: userIds.customer3,
      clerkId: "user_shoppfd_customer_003",
      email: "blessing@example.com",
      firstName: "Blessing",
      lastName: "Adebayo",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      phone: "+2348094567890",
      isBanned: false,
      role: "customer",
      createdAt: daysAgo(10),
      updatedAt: now,
    },
  ]);

// ==========================================================
// CATEGORIES
// ==========================================================

console.log("📂 Creating categories...");

await db.insert(categories).values([
  {
    id: categoryIds.tote,
    name: "Tote Bags",
    slug: "tote-bags",
    description:
      "Spacious handcrafted tote bags designed for everyday essentials.",
    position: 1,
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: now,
  },

  {
    id: categoryIds.crossbody,
    name: "Crossbody Bags",
    slug: "crossbody-bags",
    description:
      "Compact handcrafted crossbody bags for everyday use.",
    position: 2,
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: now,
  },

  {
    id: categoryIds.shoulder,
    name: "Shoulder Bags",
    slug: "shoulder-bags",
    description:
      "Elegant shoulder bags combining comfort and functionality.",
    position: 3,
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: now,
  },

  {
    id: categoryIds.clutch,
    name: "Clutches",
    slug: "clutches",
    description:
      "Elegant handcrafted clutches for special occasions.",
    position: 4,
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: now,
  },

  {
    id: categoryIds.laptop,
    name: "Laptop Bags",
    slug: "laptop-bags",
    description:
      "Stylish and practical bags for laptops and work essentials.",
    position: 5,
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: now,
  },
]);

  // ==========================================================
  // COLORS
  // ==========================================================

  console.log("🎨 Creating colors...");

  await db.insert(colors).values([
    {
      id: colorIds.black,
      name: "Black",
      hexCode: "#111111",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.brown,
      name: "Brown",
      hexCode: "#7A432A",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.tan,
      name: "Tan",
      hexCode: "#C19A6B",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.wine,
      name: "Wine",
      hexCode: "#722F37",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.green,
      name: "Olive Green",
      hexCode: "#556B2F",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.cream,
      name: "Cream",
      hexCode: "#F5E6CC",
      isActive: true,
      createdAt: daysAgo(30),
    },

    {
      id: colorIds.orange,
      name: "Burnt Orange",
      hexCode: "#C65D21",
      isActive: true,
      createdAt: daysAgo(30),
    },
  ]);

  // ==========================================================
  // PRODUCTS
  // ==========================================================

  console.log("👜 Creating products...");

  await db.insert(products).values([
    {
      id: productIds.classicTote,
      name: "Classic Tote Bag",
      slug: "classic-tote-bag",
      sku: "SHOP-TOTE-001",
      description:
        "A timeless handcrafted tote bag designed for women who appreciate quality, simplicity and everyday functionality.",
      categoryId: categoryIds.tote,
      price: "85000.00",
      compareAtPrice: "95000.00",
      costPrice: "48000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      averageRating: "4.80",
      ratingCount: 24,
      soldCount: 87,
      metaTitle: "Classic Tote Bag | SHOPPFD",
      metaDescription:
        "Shop the handcrafted SHOPPFD Classic Tote Bag.",
      createdAt: daysAgo(25),
      updatedAt: now,
    },

    {
      id: productIds.crossbody,
      name: "Crossbody Bag",
      slug: "crossbody-bag",
      sku: "SHOP-CROSS-001",
      description:
        "A lightweight handcrafted crossbody bag with a clean silhouette and enough space for everyday essentials.",
      categoryId: categoryIds.crossbody,
      price: "65000.00",
      compareAtPrice: "72000.00",
      costPrice: "36000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      averageRating: "4.70",
      ratingCount: 18,
      soldCount: 62,
      metaTitle: "Crossbody Bag | SHOPPFD",
      metaDescription:
        "Discover the SHOPPFD handcrafted Crossbody Bag.",
      createdAt: daysAgo(18),
      updatedAt: now,
    },

    {
      id: productIds.shoulder,
      name: "Classic Shoulder Bag",
      slug: "classic-shoulder-bag",
      sku: "SHOP-SHOULDER-001",
      description:
        "A comfortable shoulder bag crafted for everyday use with a refined handmade finish.",
      categoryId: categoryIds.shoulder,
      price: "75000.00",
      compareAtPrice: "85000.00",
      costPrice: "42000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      averageRating: "4.60",
      ratingCount: 15,
      soldCount: 48,
      metaTitle: "Classic Shoulder Bag | SHOPPFD",
      metaDescription:
        "Handcrafted shoulder bags made with care by SHOPPFD.",
      createdAt: daysAgo(20),
      updatedAt: now,
    },

    {
      id: productIds.clutch,
      name: "Classic Clutch",
      slug: "classic-clutch",
      sku: "SHOP-CLUTCH-001",
      description:
        "A compact handcrafted clutch designed to complement elegant outfits and special occasions.",
      categoryId: categoryIds.clutch,
      price: "45000.00",
      compareAtPrice: "52000.00",
      costPrice: "24000.00",
      status: "active",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.50",
      ratingCount: 9,
      soldCount: 31,
      metaTitle: "Classic Clutch | SHOPPFD",
      metaDescription:
        "Elegant handcrafted clutch bags from SHOPPFD.",
      createdAt: daysAgo(12),
      updatedAt: now,
    },

    {
      id: productIds.miniTote,
      name: "Mini Tote Bag",
      slug: "mini-tote-bag",
      sku: "SHOP-MINI-001",
      description:
        "A smaller version of our signature tote, perfect for carrying essentials.",
      categoryId: categoryIds.tote,
      price: "55000.00",
      compareAtPrice: "62000.00",
      costPrice: "30000.00",
      status: "active",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.40",
      ratingCount: 7,
      soldCount: 22,
      metaTitle: "Mini Tote Bag | SHOPPFD",
      metaDescription:
        "Shop the handcrafted SHOPPFD Mini Tote Bag.",
      createdAt: daysAgo(8),
      updatedAt: now,
    },

    {
      id: productIds.laptopBag,
      name: "Laptop Bag",
      slug: "laptop-bag",
      sku: "SHOP-LAPTOP-001",
      description:
        "A structured handmade laptop bag designed for professionals who want protection without sacrificing style.",
      categoryId: categoryIds.laptop,
      price: "95000.00",
      compareAtPrice: "105000.00",
      costPrice: "54000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      averageRating: "4.80",
      ratingCount: 12,
      soldCount: 36,
      metaTitle: "Laptop Bag | SHOPPFD",
      metaDescription:
        "Carry your laptop in style with the SHOPPFD Laptop Bag.",
      createdAt: daysAgo(16),
      updatedAt: now,
    },

    {
      id: productIds.structuredTote,
      name: "Structured Tote",
      slug: "structured-tote",
      sku: "SHOP-TOTE-002",
      description:
        "A structured tote with a polished silhouette for work, meetings and everyday style.",
      categoryId: categoryIds.tote,
      price: "110000.00",
      compareAtPrice: "125000.00",
      costPrice: "62000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.90",
      ratingCount: 11,
      soldCount: 29,
      metaTitle: "Structured Tote | SHOPPFD",
      metaDescription:
        "Structured handcrafted tote bag by SHOPPFD.",
      createdAt: daysAgo(7),
      updatedAt: now,
    },

    {
      id: productIds.everydayBag,
      name: "Everyday Bag",
      slug: "everyday-bag",
      sku: "SHOP-EVERYDAY-001",
      description:
        "A versatile everyday bag designed to move effortlessly from work to casual outings.",
      categoryId: categoryIds.shoulder,
      price: "70000.00",
      compareAtPrice: "78000.00",
      costPrice: "39000.00",
      status: "active",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.30",
      ratingCount: 6,
      soldCount: 18,
      metaTitle: "Everyday Bag | SHOPPFD",
      metaDescription:
        "A versatile handcrafted everyday bag from SHOPPFD.",
      createdAt: daysAgo(5),
      updatedAt: now,
    },

    {
      id: productIds.boxClutch,
      name: "Box Clutch",
      slug: "box-clutch",
      sku: "SHOP-CLUTCH-002",
      description:
        "A sophisticated box-style clutch for weddings, dinners, parties and special occasions.",
      categoryId: categoryIds.clutch,
      price: "50000.00",
      compareAtPrice: "58000.00",
      costPrice: "27000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.70",
      ratingCount: 8,
      soldCount: 24,
      metaTitle: "Box Clutch | SHOPPFD",
      metaDescription:
        "Shop the elegant handcrafted SHOPPFD Box Clutch.",
      createdAt: daysAgo(6),
      updatedAt: now,
    },

    {
      id: productIds.softShoulder,
      name: "Soft Shoulder Bag",
      slug: "soft-shoulder-bag",
      sku: "SHOP-SHOULDER-002",
      description:
        "A soft and relaxed shoulder bag designed for comfortable everyday carrying.",
      categoryId: categoryIds.shoulder,
      price: "68000.00",
      compareAtPrice: "75000.00",
      costPrice: "37000.00",
      status: "active",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      averageRating: "4.40",
      ratingCount: 5,
      soldCount: 15,
      metaTitle: "Soft Shoulder Bag | SHOPPFD",
      metaDescription:
        "Soft handcrafted shoulder bag from SHOPPFD.",
      createdAt: daysAgo(4),
      updatedAt: now,
    },

    {
      id: productIds.travelTote,
      name: "Travel Tote",
      slug: "travel-tote",
      sku: "SHOP-TRAVEL-001",
      description:
        "A spacious handcrafted tote designed for travel days, work trips and weekend getaways.",
      categoryId: categoryIds.tote,
      price: "125000.00",
      compareAtPrice: "140000.00",
      costPrice: "70000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      averageRating: "4.90",
      ratingCount: 20,
      soldCount: 51,
      metaTitle: "Travel Tote | SHOPPFD",
      metaDescription:
        "Spacious handcrafted travel tote from SHOPPFD.",
      createdAt: daysAgo(22),
      updatedAt: now,
    },

    {
      id: productIds.executiveBag,
      name: "Executive Bag",
      slug: "executive-bag",
      sku: "SHOP-EXEC-001",
      description:
        "A premium structured bag designed for professionals, meetings and polished everyday style.",
      categoryId: categoryIds.laptop,
      price: "135000.00",
      compareAtPrice: "150000.00",
      costPrice: "76000.00",
      status: "active",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      averageRating: "4.90",
      ratingCount: 17,
      soldCount: 43,
      metaTitle: "Executive Bag | SHOPPFD",
      metaDescription:
        "Premium handcrafted executive bag from SHOPPFD.",
      createdAt: daysAgo(28),
      updatedAt: now,
    },
  ]);

  // ==========================================================
  // PRODUCT VARIANTS
  // ==========================================================

  console.log("🏷️ Creating product color variants...");

  await db.insert(productVariants).values([
    // Classic Tote
    {
      id: variantIds.classicToteBrown,
      productId: productIds.classicTote,
      colorId: colorIds.brown,
      sku: "SHOP-TOTE-001-BRN",
      stock: 18,
      reservedStock: 2,
      createdAt: daysAgo(25),
      updatedAt: now,
    },
    {
      id: variantIds.classicToteBlack,
      productId: productIds.classicTote,
      colorId: colorIds.black,
      sku: "SHOP-TOTE-001-BLK",
      stock: 12,
      reservedStock: 1,
      createdAt: daysAgo(25),
      updatedAt: now,
    },
    {
      id: variantIds.classicToteTan,
      productId: productIds.classicTote,
      colorId: colorIds.tan,
      sku: "SHOP-TOTE-001-TAN",
      stock: 9,
      reservedStock: 0,
      createdAt: daysAgo(25),
      updatedAt: now,
    },

    // Crossbody
    {
      id: variantIds.crossbodyBrown,
      productId: productIds.crossbody,
      colorId: colorIds.brown,
      sku: "SHOP-CROSS-001-BRN",
      stock: 10,
      reservedStock: 1,
      createdAt: daysAgo(18),
      updatedAt: now,
    },
    {
      id: variantIds.crossbodyBlack,
      productId: productIds.crossbody,
      colorId: colorIds.black,
      sku: "SHOP-CROSS-001-BLK",
      stock: 8,
      reservedStock: 0,
      createdAt: daysAgo(18),
      updatedAt: now,
    },
    {
      id: variantIds.crossbodyWine,
      productId: productIds.crossbody,
      colorId: colorIds.wine,
      sku: "SHOP-CROSS-001-WIN",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(18),
      updatedAt: now,
    },

    // Shoulder
    {
      id: variantIds.shoulderBrown,
      productId: productIds.shoulder,
      colorId: colorIds.brown,
      sku: "SHOP-SHOULDER-001-BRN",
      stock: 8,
      reservedStock: 0,
      createdAt: daysAgo(20),
      updatedAt: now,
    },
    {
      id: variantIds.shoulderBlack,
      productId: productIds.shoulder,
      colorId: colorIds.black,
      sku: "SHOP-SHOULDER-001-BLK",
      stock: 7,
      reservedStock: 1,
      createdAt: daysAgo(20),
      updatedAt: now,
    },
    {
      id: variantIds.shoulderGreen,
      productId: productIds.shoulder,
      colorId: colorIds.green,
      sku: "SHOP-SHOULDER-001-GRN",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(20),
      updatedAt: now,
    },

    // Clutch
    {
      id: variantIds.clutchBlack,
      productId: productIds.clutch,
      colorId: colorIds.black,
      sku: "SHOP-CLUTCH-001-BLK",
      stock: 6,
      reservedStock: 0,
      createdAt: daysAgo(12),
      updatedAt: now,
    },
    {
      id: variantIds.clutchWine,
      productId: productIds.clutch,
      colorId: colorIds.wine,
      sku: "SHOP-CLUTCH-001-WIN",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(12),
      updatedAt: now,
    },
    {
      id: variantIds.clutchTan,
      productId: productIds.clutch,
      colorId: colorIds.tan,
      sku: "SHOP-CLUTCH-001-TAN",
      stock: 3,
      reservedStock: 0,
      createdAt: daysAgo(12),
      updatedAt: now,
    },

    // Mini Tote
    {
      id: variantIds.miniToteTan,
      productId: productIds.miniTote,
      colorId: colorIds.tan,
      sku: "SHOP-MINI-001-TAN",
      stock: 6,
      reservedStock: 0,
      createdAt: daysAgo(8),
      updatedAt: now,
    },
    {
      id: variantIds.miniToteBrown,
      productId: productIds.miniTote,
      colorId: colorIds.brown,
      sku: "SHOP-MINI-001-BRN",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(8),
      updatedAt: now,
    },
    {
      id: variantIds.miniToteBlack,
      productId: productIds.miniTote,
      colorId: colorIds.black,
      sku: "SHOP-MINI-001-BLK",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(8),
      updatedAt: now,
    },

    // Laptop
    {
      id: variantIds.laptopBlack,
      productId: productIds.laptopBag,
      colorId: colorIds.black,
      sku: "SHOP-LAPTOP-001-BLK",
      stock: 8,
      reservedStock: 1,
      createdAt: daysAgo(16),
      updatedAt: now,
    },
    {
      id: variantIds.laptopBrown,
      productId: productIds.laptopBag,
      colorId: colorIds.brown,
      sku: "SHOP-LAPTOP-001-BRN",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(16),
      updatedAt: now,
    },

    // Structured Tote
    {
      id: variantIds.structuredBlack,
      productId: productIds.structuredTote,
      colorId: colorIds.black,
      sku: "SHOP-TOTE-002-BLK",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(7),
      updatedAt: now,
    },
    {
      id: variantIds.structuredBrown,
      productId: productIds.structuredTote,
      colorId: colorIds.brown,
      sku: "SHOP-TOTE-002-BRN",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(7),
      updatedAt: now,
    },
    {
      id: variantIds.structuredTan,
      productId: productIds.structuredTote,
      colorId: colorIds.tan,
      sku: "SHOP-TOTE-002-TAN",
      stock: 3,
      reservedStock: 0,
      createdAt: daysAgo(7),
      updatedAt: now,
    },

    // Everyday
    {
      id: variantIds.everydayBrown,
      productId: productIds.everydayBag,
      colorId: colorIds.brown,
      sku: "SHOP-EVERYDAY-001-BRN",
      stock: 7,
      reservedStock: 0,
      createdAt: daysAgo(5),
      updatedAt: now,
    },
    {
      id: variantIds.everydayBlack,
      productId: productIds.everydayBag,
      colorId: colorIds.black,
      sku: "SHOP-EVERYDAY-001-BLK",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(5),
      updatedAt: now,
    },

    // Box Clutch
    {
      id: variantIds.boxClutchWine,
      productId: productIds.boxClutch,
      colorId: colorIds.wine,
      sku: "SHOP-CLUTCH-002-WIN",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(6),
      updatedAt: now,
    },
    {
      id: variantIds.boxClutchBlack,
      productId: productIds.boxClutch,
      colorId: colorIds.black,
      sku: "SHOP-CLUTCH-002-BLK",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(6),
      updatedAt: now,
    },

    // Soft Shoulder
    {
      id: variantIds.softShoulderBrown,
      productId: productIds.softShoulder,
      colorId: colorIds.brown,
      sku: "SHOP-SHOULDER-002-BRN",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(4),
      updatedAt: now,
    },
    {
      id: variantIds.softShoulderGreen,
      productId: productIds.softShoulder,
      colorId: colorIds.green,
      sku: "SHOP-SHOULDER-002-GRN",
      stock: 4,
      reservedStock: 0,
      createdAt: daysAgo(4),
      updatedAt: now,
    },

    // Travel Tote
    {
      id: variantIds.travelToteBrown,
      productId: productIds.travelTote,
      colorId: colorIds.brown,
      sku: "SHOP-TRAVEL-001-BRN",
      stock: 9,
      reservedStock: 1,
      createdAt: daysAgo(22),
      updatedAt: now,
    },
    {
      id: variantIds.travelToteBlack,
      productId: productIds.travelTote,
      colorId: colorIds.black,
      sku: "SHOP-TRAVEL-001-BLK",
      stock: 6,
      reservedStock: 0,
      createdAt: daysAgo(22),
      updatedAt: now,
    },

    // Executive
    {
      id: variantIds.executiveBlack,
      productId: productIds.executiveBag,
      colorId: colorIds.black,
      sku: "SHOP-EXEC-001-BLK",
      stock: 5,
      reservedStock: 0,
      createdAt: daysAgo(28),
      updatedAt: now,
    },
    {
      id: variantIds.executiveBrown,
      productId: productIds.executiveBag,
      colorId: colorIds.brown,
      sku: "SHOP-EXEC-001-BRN",
      stock: 3,
      reservedStock: 0,
      createdAt: daysAgo(28),
      updatedAt: now,
    },
  ]);

  // ==========================================================
  // PRODUCT IMAGES
  // ==========================================================

  console.log("🖼️ Creating product images...");

  await db.insert(productImages).values([
    {
      id: imageIds.classicTote1,
      productId: productIds.classicTote,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/classic-tote-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(25),
    },

    {
      id: imageIds.classicTote2,
      productId: productIds.classicTote,
      url:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      publicId: "shoppfd/products/classic-tote-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(25),
    },

    {
      id: imageIds.crossbody1,
      productId: productIds.crossbody,
      url:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      publicId: "shoppfd/products/crossbody-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(18),
    },

    {
      id: imageIds.crossbody2,
      productId: productIds.crossbody,
      url:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      publicId: "shoppfd/products/crossbody-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(18),
    },

    {
      id: imageIds.shoulder1,
      productId: productIds.shoulder,
      url:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      publicId: "shoppfd/products/shoulder-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(20),
    },

    {
      id: imageIds.shoulder2,
      productId: productIds.shoulder,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/shoulder-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(20),
    },

    {
      id: imageIds.clutch1,
      productId: productIds.clutch,
      url:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      publicId: "shoppfd/products/clutch-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(12),
    },

    {
      id: imageIds.clutch2,
      productId: productIds.clutch,
      url:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      publicId: "shoppfd/products/clutch-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(12),
    },

    {
      id: imageIds.miniTote1,
      productId: productIds.miniTote,
      url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      publicId: "shoppfd/products/mini-tote-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(8),
    },

    {
      id: imageIds.miniTote2,
      productId: productIds.miniTote,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/mini-tote-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(8),
    },

    {
      id: imageIds.laptop1,
      productId: productIds.laptopBag,
      url:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      publicId: "shoppfd/products/laptop-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(16),
    },

    {
      id: imageIds.laptop2,
      productId: productIds.laptopBag,
      url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      publicId: "shoppfd/products/laptop-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(16),
    },

    {
      id: imageIds.structured1,
      productId: productIds.structuredTote,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/structured-tote-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(7),
    },

    {
      id: imageIds.structured2,
      productId: productIds.structuredTote,
      url:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      publicId: "shoppfd/products/structured-tote-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(7),
    },

    {
      id: imageIds.everyday1,
      productId: productIds.everydayBag,
      url:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      publicId: "shoppfd/products/everyday-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(5),
    },

    {
      id: imageIds.everyday2,
      productId: productIds.everydayBag,
      url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      publicId: "shoppfd/products/everyday-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(5),
    },

    {
      id: imageIds.boxClutch1,
      productId: productIds.boxClutch,
      url:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
      publicId: "shoppfd/products/box-clutch-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(6),
    },

    {
      id: imageIds.boxClutch2,
      productId: productIds.boxClutch,
      url:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      publicId: "shoppfd/products/box-clutch-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(6),
    },

    {
      id: imageIds.softShoulder1,
      productId: productIds.softShoulder,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/soft-shoulder-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(4),
    },

    {
      id: imageIds.softShoulder2,
      productId: productIds.softShoulder,
      url:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      publicId: "shoppfd/products/soft-shoulder-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(4),
    },

    {
      id: imageIds.travel1,
      productId: productIds.travelTote,
      url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      publicId: "shoppfd/products/travel-tote-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(22),
    },

    {
      id: imageIds.travel2,
      productId: productIds.travelTote,
      url:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      publicId: "shoppfd/products/travel-tote-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(22),
    },

    {
      id: imageIds.executive1,
      productId: productIds.executiveBag,
      url:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      publicId: "shoppfd/products/executive-1",
      position: 1,
      isPrimary: true,
      createdAt: daysAgo(28),
    },

    {
      id: imageIds.executive2,
      productId: productIds.executiveBag,
      url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      publicId: "shoppfd/products/executive-2",
      position: 2,
      isPrimary: false,
      createdAt: daysAgo(28),
    },
  ]);

  // ==========================================================
  // RATINGS
  // ==========================================================

  console.log("⭐ Creating ratings...");

  await db.insert(ratings).values([
    {
      id: randomUUID(),
      productId: productIds.classicTote,
      userId: userIds.customer1,
      rating: 5,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(12),
    },

    {
      id: randomUUID(),
      productId: productIds.classicTote,
      userId: userIds.customer2,
      rating: 5,
      createdAt: daysAgo(9),
      updatedAt: daysAgo(9),
    },

    {
      id: randomUUID(),
      productId: productIds.crossbody,
      userId: userIds.customer1,
      rating: 5,
      createdAt: daysAgo(8),
      updatedAt: daysAgo(8),
    },

    {
      id: randomUUID(),
      productId: productIds.shoulder,
      userId: userIds.customer3,
      rating: 4,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },

    {
      id: randomUUID(),
      productId: productIds.laptopBag,
      userId: userIds.customer2,
      rating: 5,
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
  ]);

  // ==========================================================
  // WISHLIST
  // ==========================================================

  console.log("❤️ Creating wishlist items...");

  await db.insert(wishlistItems).values([
    {
      id: randomUUID(),
      userId: userIds.customer1,
      productId: productIds.structuredTote,
      createdAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      userId: userIds.customer1,
      productId: productIds.travelTote,
      createdAt: daysAgo(3),
    },

    {
      id: randomUUID(),
      userId: userIds.customer2,
      productId: productIds.classicTote,
      createdAt: daysAgo(5),
    },

    {
      id: randomUUID(),
      userId: userIds.customer3,
      productId: productIds.boxClutch,
      createdAt: daysAgo(2),
    },
  ]);

  // ==========================================================
  // ADDRESSES
  // ==========================================================

  console.log("📍 Creating addresses...");

  await db.insert(addresses).values([
    {
      id: addressIds.customer1,
      userId: userIds.customer1,
      firstName: "Amara",
      lastName: "Okafor",
      phone: "+2348031234567",
      addressLine1: "14 Admiralty Way",
      addressLine2: null,
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101233",
      isDefault: true,
      createdAt: daysAgo(18),
      updatedAt: now,
    },

    {
      id: addressIds.customer2,
      userId: userIds.customer2,
      firstName: "Chidi",
      lastName: "Eze",
      phone: "+2348069876543",
      addressLine1: "22 GRA Avenue",
      addressLine2: "Near City Mall",
      city: "Enugu",
      state: "Enugu",
      country: "Nigeria",
      postalCode: "400001",
      isDefault: true,
      createdAt: daysAgo(12),
      updatedAt: now,
    },

    {
      id: addressIds.customer3,
      userId: userIds.customer3,
      firstName: "Blessing",
      lastName: "Adebayo",
      phone: "+2348094567890",
      addressLine1: "8 Wuse II",
      addressLine2: null,
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
      postalCode: "900288",
      isDefault: true,
      createdAt: daysAgo(8),
      updatedAt: now,
    },
  ]);

  // ==========================================================
  // CARTS
  // ==========================================================

  console.log("🛒 Creating carts...");

  await db.insert(carts).values([
    {
      id: cartIds.customer1,
      userId: userIds.customer1,
      sessionId: null,
      createdAt: daysAgo(2),
      updatedAt: now,
    },

    {
      id: cartIds.guest,
      userId: null,
      sessionId: "shoppfd_guest_seed_session",
      createdAt: daysAgo(1),
      updatedAt: now,
    },
  ]);

  // ==========================================================
  // CART ITEMS
  // ==========================================================

  await db.insert(cartItems).values([
    {
      id: randomUUID(),
      cartId: cartIds.customer1,
      productId: productIds.classicTote,
      variantId: variantIds.classicToteBrown,
      quantity: 1,
      createdAt: daysAgo(1),
      updatedAt: now,
    },

    {
      id: randomUUID(),
      cartId: cartIds.customer1,
      productId: productIds.crossbody,
      variantId: variantIds.crossbodyBlack,
      quantity: 2,
      createdAt: daysAgo(1),
      updatedAt: now,
    },

    {
      id: randomUUID(),
      cartId: cartIds.guest,
      productId: productIds.miniTote,
      variantId: variantIds.miniToteTan,
      quantity: 1,
      createdAt: daysAgo(1),
      updatedAt: now,
    },
  ]);

// ==========================================================
// ORDERS
// ==========================================================

console.log("📦 Creating orders...");

const orderSeedData: OrderInsert[] = [
  {
    id: orderIds.first,
    orderNumber: "SHOPPFD-10001",
    userId: userIds.customer1,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "paystack",
    subtotal: "85000.00",
    shippingFee: "5000.00",
    discount: "0.00",
    total: "90000.00",
    notes: "Please call before delivery.",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(7),
  },

  {
    id: orderIds.second,
    orderNumber: "SHOPPFD-10002",
    userId: userIds.customer2,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "paystack",
    subtotal: "160000.00",
    shippingFee: "5000.00",
    discount: "10000.00",
    total: "155000.00",
    notes: null,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },

  {
    id: orderIds.third,
    orderNumber: "SHOPPFD-10003",
    userId: userIds.customer3,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash_on_delivery",
    subtotal: "70000.00",
    shippingFee: "5000.00",
    discount: "0.00",
    total: "75000.00",
    notes: "Customer requested evening delivery.",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

await db.insert(orders).values(orderSeedData);

  // ==========================================================
  // ORDER ITEMS
  // ==========================================================

  console.log("🧾 Creating order items...");

  await db.insert(orderItems).values([
    {
      id: randomUUID(),
      orderId: orderIds.first,
      productId: productIds.classicTote,
      variantId: variantIds.classicToteBrown,
      productName: "Classic Tote Bag",
      productSku: "SHOP-TOTE-001",
      variantSku: "SHOP-TOTE-001-BRN",
      colorName: "Brown",
      productImageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      quantity: 1,
      unitPrice: "85000.00",
      totalPrice: "85000.00",
      createdAt: daysAgo(14),
    },

    {
      id: randomUUID(),
      orderId: orderIds.second,
      productId: productIds.crossbody,
      variantId: variantIds.crossbodyBlack,
      productName: "Crossbody Bag",
      productSku: "SHOP-CROSS-001",
      variantSku: "SHOP-CROSS-001-BLK",
      colorName: "Black",
      productImageUrl:
        "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
      quantity: 1,
      unitPrice: "65000.00",
      totalPrice: "65000.00",
      createdAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      orderId: orderIds.second,
      productId: productIds.laptopBag,
      variantId: variantIds.laptopBrown,
      productName: "Laptop Bag",
      productSku: "SHOP-LAPTOP-001",
      variantSku: "SHOP-LAPTOP-001-BRN",
      colorName: "Brown",
      productImageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      quantity: 1,
      unitPrice: "95000.00",
      totalPrice: "95000.00",
      createdAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      orderId: orderIds.third,
      productId: productIds.everydayBag,
      variantId: variantIds.everydayBrown,
      productName: "Everyday Bag",
      productSku: "SHOP-EVERYDAY-001",
      variantSku: "SHOP-EVERYDAY-001-BRN",
      colorName: "Brown",
      productImageUrl:
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
      quantity: 1,
      unitPrice: "70000.00",
      totalPrice: "70000.00",
      createdAt: daysAgo(1),
    },
  ]);

  // ==========================================================
  // PAYMENTS
  // ==========================================================

  console.log("💳 Creating payments...");

  await db.insert(payments).values([
    {
      id: randomUUID(),
      orderId: orderIds.first,
      provider: "paystack",
      reference: "SHOPPFD-PAY-10001",
      amount: "90000.00",
      currency: "NGN",
      status: "paid",
      gatewayResponse: "Successful",
      paidAt: daysAgo(13),
      createdAt: daysAgo(14),
      updatedAt: daysAgo(13),
    },

    {
      id: randomUUID(),
      orderId: orderIds.second,
      provider: "paystack",
      reference: "SHOPPFD-PAY-10002",
      amount: "155000.00",
      currency: "NGN",
      status: "paid",
      gatewayResponse: "Successful",
      paidAt: daysAgo(4),
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      orderId: orderIds.third,
      provider: "cash_on_delivery",
      reference: "SHOPPFD-COD-10003",
      amount: "75000.00",
      currency: "NGN",
      status: "pending",
      gatewayResponse: null,
      paidAt: null,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ]);

  // ==========================================================
  // INVENTORY MOVEMENTS
  // ==========================================================

  console.log("📊 Creating inventory movements...");

  await db.insert(inventoryMovements).values([
    {
      id: randomUUID(),
      variantId: variantIds.classicToteBrown,
      userId: userIds.admin,
      orderId: null,
      quantityChange: 20,
      reason: "Initial stock",
      createdAt: daysAgo(25),
    },

    {
      id: randomUUID(),
      variantId: variantIds.classicToteBlack,
      userId: userIds.admin,
      orderId: null,
      quantityChange: 13,
      reason: "Initial stock",
      createdAt: daysAgo(25),
    },

    {
      id: randomUUID(),
      variantId: variantIds.crossbodyBlack,
      userId: userIds.admin,
      orderId: null,
      quantityChange: 8,
      reason: "Initial stock",
      createdAt: daysAgo(18),
    },

    {
      id: randomUUID(),
      variantId: variantIds.laptopBrown,
      userId: userIds.admin,
      orderId: null,
      quantityChange: 5,
      reason: "Initial stock",
      createdAt: daysAgo(16),
    },

    {
      id: randomUUID(),
      variantId: variantIds.classicToteBrown,
      userId: null,
      orderId: orderIds.first,
      quantityChange: -1,
      reason: "Order sale",
      createdAt: daysAgo(13),
    },

    {
      id: randomUUID(),
      variantId: variantIds.crossbodyBlack,
      userId: null,
      orderId: orderIds.second,
      quantityChange: -1,
      reason: "Order sale",
      createdAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      variantId: variantIds.laptopBrown,
      userId: null,
      orderId: orderIds.second,
      quantityChange: -1,
      reason: "Order sale",
      createdAt: daysAgo(4),
    },

    {
      id: randomUUID(),
      variantId: variantIds.everydayBrown,
      userId: userIds.admin,
      orderId: null,
      quantityChange: 7,
      reason: "Initial stock",
      createdAt: daysAgo(5),
    },
  ]);

  // ==========================================================
  // ANNOUNCEMENTS
  // ==========================================================

  console.log("📢 Creating announcements...");

  await db.insert(announcements).values([
    {
      id: randomUUID(),
      type: "general",
      title: "Handcrafted With Love",
      description:
        "Every SHOPPFD bag is carefully handcrafted with attention to detail.",
      imageUrl:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      imagePublicId: "shoppfd/announcements/handcrafted",
      ctaText: "Shop Collection",
      ctaUrl: "/shop",
      eventAt: null,
      expiresAt: null,
      isPublished: true,
      publishedAt: daysAgo(5),
      createdAt: daysAgo(5),
      updatedAt: now,
    },

    {
      id: randomUUID(),
      type: "sale",
      title: "New Collection Is Here",
      description:
        "Discover our latest handcrafted bags designed for modern everyday living.",
      imageUrl:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      imagePublicId: "shoppfd/announcements/new-collection",
      ctaText: "Explore Collection",
      ctaUrl: "/shop",
      eventAt: null,
      expiresAt: daysFromNow(30),
      isPublished: true,
      publishedAt: daysAgo(2),
      createdAt: daysAgo(2),
      updatedAt: now,
    },
  ]);

  // ==========================================================
  // CONTACT MESSAGES
  // ==========================================================

  console.log("📩 Creating contact messages...");

  await db.insert(contactMessages).values([
    {
      id: randomUUID(),
      userId: userIds.customer1,
      name: "Amara Okafor",
      email: "amara@example.com",
      phone: "+2348031234567",
      subject: "Order Question",
      message:
        "Hello, I would like to know if the Classic Tote is available in black.",
      isRead: false,
      createdAt: daysAgo(2),
    },

    {
      id: randomUUID(),
      userId: null,
      name: "David Johnson",
      email: "david@example.com",
      phone: "+2348011112222",
      subject: "Custom Bag",
      message:
        "I would like to ask if you accept custom bag orders.",
      isRead: true,
      createdAt: daysAgo(6),
    },
  ]);

  // ==========================================================
  // NEWSLETTER SUBSCRIBERS
  // ==========================================================

  console.log("📧 Creating newsletter subscribers...");

  await db.insert(newsletterSubscribers).values([
    {
      id: randomUUID(),
      email: "amara@example.com",
      isSubscribed: true,
      subscribedAt: daysAgo(15),
      unsubscribedAt: null,
    },

    {
      id: randomUUID(),
      email: "chidi@example.com",
      isSubscribed: true,
      subscribedAt: daysAgo(10),
      unsubscribedAt: null,
    },

    {
      id: randomUUID(),
      email: "hello@example.com",
      isSubscribed: false,
      subscribedAt: daysAgo(20),
      unsubscribedAt: daysAgo(3),
    },
  ]);

  // ==========================================================
  // COMPLETE
  // ==========================================================

  console.log("\n========================================");
  console.log("🎉 SHOPPFD SEED COMPLETE!");
  console.log("========================================");
  console.log("");
  console.log("Users:                  4");
  console.log("Categories:             5");
  console.log("Colors:                 7");
  console.log("Products:              12");
  console.log("Product variants:      29");
  console.log("Product images:        24");
  console.log("Ratings:                 5");
  console.log("Wishlist items:          4");
  console.log("Addresses:               3");
  console.log("Carts:                   2");
  console.log("Cart items:              3");
  console.log("Orders:                  3");
  console.log("Order items:             4");
  console.log("Payments:                3");
  console.log("Inventory movements:     8");
  console.log("Announcements:           2");
  console.log("Contact messages:        2");
  console.log("Newsletter subscribers:  3");
  console.log("");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });