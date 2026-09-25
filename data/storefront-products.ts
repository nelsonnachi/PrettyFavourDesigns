import type { ProductCardProduct } from "@/components/(storefront)/products/product-card";

// ============================================================
// PRODUCT IMAGE
// ============================================================

export type StorefrontProductImage = {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
};

// ============================================================
// COLOR
// ============================================================

export type StorefrontColor = {
  id: string;
  name: string;
  hexCode: string | null;
};

// ============================================================
// PRODUCT VARIANT
// ============================================================

export type StorefrontProductVariant = {
  id: string;
  color: StorefrontColor;
  sku: string;
  stock: number;
  reservedStock: number;
};

// ============================================================
// STOREFRONT PRODUCT
// ============================================================

export type StorefrontProduct = ProductCardProduct & {
  categoryId: string;

  colorIds: string[];

  images: StorefrontProductImage[];

  variants: StorefrontProductVariant[];

  stock: number;

  reservedStock: number;

  soldCount: number;

  isBestSeller: boolean;

  averageRating: number;

  ratingCount: number;

  createdAt: string;

  updatedAt: string;
};

// ============================================================
// DUMMY PRODUCTS
// ============================================================

export const storefrontProducts: StorefrontProduct[] = [
  // ==========================================================
  // PRODUCT 1
  // ==========================================================

  {
    id: "product-1",

    name: "The Nomad Hobo",

    slug: "the-nomad-hobo",

    description:
      "A spacious everyday hobo bag designed for effortless style, comfort, and versatility.",

    categoryId: "category-handbags",

    colorIds: ["color-black", "color-brown", "color-tan"],

    price: 95000,

    compareAtPrice: null,

    status: "active",

    isFeatured: true,

    isNewArrival: true,

    isBestSeller: true,

    averageRating: 4.8,

    ratingCount: 24,

    image: "/images/products/blackhand.png",

    images: [
      {
        id: "product-1-image-1",
        url: "/images/products/blackhand.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-1-image-2",
        url: "/images/products/brownhand.png",
        position: 1,
        isPrimary: false,
      },
      {
        id: "product-1-image-3",
        url: "/images/products/brownxyz.png",
        position: 2,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-1-variant-1",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "NOMAD-HOBO-BLK",

        stock: 10,

        reservedStock: 1,
      },

      {
        id: "product-1-variant-2",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "NOMAD-HOBO-BRN",

        stock: 8,

        reservedStock: 1,
      },

      {
        id: "product-1-variant-3",

        color: {
          id: "color-tan",
          name: "Tan",
          hexCode: "#C19A6B",
        },

        sku: "NOMAD-HOBO-TAN",

        stock: 6,

        reservedStock: 0,
      },
    ],

    stock: 24,

    reservedStock: 2,

    soldCount: 86,

    createdAt: "2026-09-20T10:00:00.000Z",

    updatedAt: "2026-09-23T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 2
  // ==========================================================

  {
    id: "product-2",

    name: "Helixeot Bag",

    slug: "helixeot-bag",

    description:
      "A refined crossbody bag crafted for hands-free elegance and everyday convenience.",

    categoryId: "category-crossbody",

    colorIds: ["color-brown", "color-black"],

    price: 85000,

    compareAtPrice: 95000,

    status: "active",

    isFeatured: true,

    isNewArrival: true,

    isBestSeller: false,

    averageRating: 4.6,

    ratingCount: 18,

    image: "/images/products/brownfre.png",

    images: [
      {
        id: "product-2-image-1",
        url: "/images/products/brownfre.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-2-image-2",
        url: "/images/products/brownxyz.png",
        position: 1,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-2-variant-1",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "HELIXEOT-BRN",

        stock: 9,

        reservedStock: 1,
      },

      {
        id: "product-2-variant-2",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "HELIXEOT-BLK",

        stock: 6,

        reservedStock: 0,
      },
    ],

    stock: 15,

    reservedStock: 1,

    soldCount: 42,

    createdAt: "2026-09-18T10:00:00.000Z",

    updatedAt: "2026-09-23T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 3
  // ==========================================================

  {
    id: "product-3",

    name: "Solene Bagette",

    slug: "solene-bagette",

    description:
      "A timeless baguette bag combining a comfortable silhouette with refined everyday style.",

    categoryId: "category-shoulder-bags",

    colorIds: ["color-brown", "color-black", "color-tan"],

    price: 87500,

    compareAtPrice: null,

    status: "active",

    isFeatured: true,

    isNewArrival: false,

    isBestSeller: true,

    averageRating: 4.9,

    ratingCount: 31,

    image: "/images/products/brownhand.png",

    images: [
      {
        id: "product-3-image-1",
        url: "/images/products/brownhand.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-3-image-2",
        url: "/images/products/blackhand.png",
        position: 1,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-3-variant-1",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "SOLENE-BRN",

        stock: 8,

        reservedStock: 0,
      },

      {
        id: "product-3-variant-2",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "SOLENE-BLK",

        stock: 6,

        reservedStock: 0,
      },

      {
        id: "product-3-variant-3",

        color: {
          id: "color-tan",
          name: "Tan",
          hexCode: "#C19A6B",
        },

        sku: "SOLENE-TAN",

        stock: 4,

        reservedStock: 0,
      },
    ],

    stock: 18,

    reservedStock: 0,

    soldCount: 73,

    createdAt: "2026-09-15T10:00:00.000Z",

    updatedAt: "2026-09-22T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 4
  // ==========================================================

  {
    id: "product-4",

    name: "Classic Clutch",

    slug: "classic-clutch",

    description:
      "A compact and elegant clutch designed to add a polished finish to special occasions.",

    categoryId: "category-clutches",

    colorIds: ["color-black", "color-red"],

    price: 45000,

    compareAtPrice: null,

    status: "active",

    isFeatured: false,

    isNewArrival: true,

    isBestSeller: false,

    averageRating: 4.3,

    ratingCount: 12,

    image: "/images/products/blackhand.png",

    images: [
      {
        id: "product-4-image-1",
        url: "/images/products/blackhand.png",
        position: 0,
        isPrimary: true,
      },
    ],

    variants: [
      {
        id: "product-4-variant-1",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "CLASSIC-CLUTCH-BLK",

        stock: 7,

        reservedStock: 0,
      },

      {
        id: "product-4-variant-2",

        color: {
          id: "color-red",
          name: "Red",
          hexCode: "#B91C1C",
        },

        sku: "CLASSIC-CLUTCH-RED",

        stock: 3,

        reservedStock: 0,
      },
    ],

    stock: 10,

    reservedStock: 0,

    soldCount: 25,

    createdAt: "2026-09-17T10:00:00.000Z",

    updatedAt: "2026-09-22T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 5
  // ==========================================================

  {
    id: "product-5",

    name: "Monoli Satchel",

    slug: "monoli-satchel",

    description:
      "A beautifully structured satchel that brings practical storage and timeless style together.",

    categoryId: "category-satchels",

    colorIds: ["color-brown", "color-tan"],

    price: 68000,

    compareAtPrice: null,

    status: "active",

    isFeatured: true,

    isNewArrival: false,

    isBestSeller: false,

    averageRating: 4.5,

    ratingCount: 15,

    image: "/images/products/brownxyz.png",

    images: [
      {
        id: "product-5-image-1",
        url: "/images/products/brownxyz.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-5-image-2",
        url: "/images/products/brownhand.png",
        position: 1,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-5-variant-1",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "MONOLI-BRN",

        stock: 7,

        reservedStock: 1,
      },

      {
        id: "product-5-variant-2",

        color: {
          id: "color-tan",
          name: "Tan",
          hexCode: "#C19A6B",
        },

        sku: "MONOLI-TAN",

        stock: 5,

        reservedStock: 0,
      },
    ],

    stock: 12,

    reservedStock: 1,

    soldCount: 31,

    createdAt: "2026-09-12T10:00:00.000Z",

    updatedAt: "2026-09-21T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 6
  // ==========================================================

  {
    id: "product-6",

    name: "Nexus Messenger",

    slug: "nexus-messenger",

    description:
      "A practical messenger bag designed for work, travel, and everyday movement without sacrificing style.",

    categoryId: "category-crossbody",

    colorIds: ["color-brown", "color-black", "color-green"],

    price: 105000,

    compareAtPrice: 115000,

    status: "active",

    isFeatured: false,

    isNewArrival: true,

    isBestSeller: true,

    averageRating: 4.7,

    ratingCount: 22,

    image: "/images/products/brownfre.png",

    images: [
      {
        id: "product-6-image-1",
        url: "/images/products/brownfre.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-6-image-2",
        url: "/images/products/brownxyz.png",
        position: 1,
        isPrimary: false,
      },
      {
        id: "product-6-image-3",
        url: "/images/products/blackhand.png",
        position: 2,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-6-variant-1",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "NEXUS-BRN",

        stock: 3,

        reservedStock: 1,
      },

      {
        id: "product-6-variant-2",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "NEXUS-BLK",

        stock: 2,

        reservedStock: 1,
      },

      {
        id: "product-6-variant-3",

        color: {
          id: "color-green",
          name: "Green",
          hexCode: "#166534",
        },

        sku: "NEXUS-GRN",

        stock: 2,

        reservedStock: 0,
      },
    ],

    stock: 7,

    reservedStock: 2,

    soldCount: 58,

    createdAt: "2026-09-19T10:00:00.000Z",

    updatedAt: "2026-09-23T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 7
  // ==========================================================

  {
    id: "product-7",

    name: "The Everyday Bag",

    slug: "the-everyday-bag",

    description:
      "A versatile everyday essential with a clean silhouette made for effortless daily styling.",

    categoryId: "category-handbags",

    colorIds: ["color-black", "color-brown", "color-tan"],

    price: 79000,

    compareAtPrice: null,

    status: "active",

    isFeatured: true,

    isNewArrival: false,

    isBestSeller: true,

    averageRating: 4.9,

    ratingCount: 37,

    image: "/images/products/brownxyz.png",

    images: [
      {
        id: "product-7-image-1",
        url: "/images/products/brownxyz.png",
        position: 0,
        isPrimary: true,
      },
    ],

    variants: [
      {
        id: "product-7-variant-1",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "EVERYDAY-BLK",

        stock: 8,

        reservedStock: 1,
      },

      {
        id: "product-7-variant-2",

        color: {
          id: "color-brown",
          name: "Brown",
          hexCode: "#6B4226",
        },

        sku: "EVERYDAY-BRN",

        stock: 7,

        reservedStock: 1,
      },

      {
        id: "product-7-variant-3",

        color: {
          id: "color-tan",
          name: "Tan",
          hexCode: "#C19A6B",
        },

        sku: "EVERYDAY-TAN",

        stock: 5,

        reservedStock: 1,
      },
    ],

    stock: 20,

    reservedStock: 3,

    soldCount: 91,

    createdAt: "2026-09-10T10:00:00.000Z",

    updatedAt: "2026-09-23T10:00:00.000Z",
  },

  // ==========================================================
  // PRODUCT 8
  // ==========================================================

  {
    id: "product-8",

    name: "Evening Clutch",

    slug: "evening-clutch",

    description:
      "An elegant evening clutch with refined details designed for dinners, celebrations, and special occasions.",

    categoryId: "category-clutches",

    colorIds: ["color-black", "color-red"],

    price: 52000,

    compareAtPrice: null,

    status: "active",

    isFeatured: false,

    isNewArrival: false,

    isBestSeller: false,

    averageRating: 4.4,

    ratingCount: 9,

    image: "/images/products/blackhand.png",

    images: [
      {
        id: "product-8-image-1",
        url: "/images/products/blackhand.png",
        position: 0,
        isPrimary: true,
      },
      {
        id: "product-8-image-2",
        url: "/images/products/brownhand.png",
        position: 1,
        isPrimary: false,
      },
    ],

    variants: [
      {
        id: "product-8-variant-1",

        color: {
          id: "color-black",
          name: "Black",
          hexCode: "#000000",
        },

        sku: "EVENING-CLUTCH-BLK",

        stock: 3,

        reservedStock: 0,
      },

      {
        id: "product-8-variant-2",

        color: {
          id: "color-red",
          name: "Red",
          hexCode: "#B91C1C",
        },

        sku: "EVENING-CLUTCH-RED",

        stock: 2,

        reservedStock: 0,
      },
    ],

    stock: 5,

    reservedStock: 0,

    soldCount: 47,

    createdAt: "2026-09-08T10:00:00.000Z",

    updatedAt: "2026-09-20T10:00:00.000Z",
  },
];
