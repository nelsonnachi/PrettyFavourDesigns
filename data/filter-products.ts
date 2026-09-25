
import type { ShopFiltersState } from "@/components/(storefront)/shop/shop-filters";

import type { StorefrontProduct } from "./storefront-products";

export function filterStorefrontProducts(
  products: StorefrontProduct[],
  filters: ShopFiltersState
) {
  let result = [...products];

  // ============================================================
  // SEARCH
  // ============================================================

  if (filters.search.trim()) {
    const search =
      filters.search.toLowerCase().trim();

    result = result.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(search) ||
        product.description
          .toLowerCase()
          .includes(search)
      );
    });
  }

  // ============================================================
  // CATEGORY
  // ============================================================

  if (filters.categoryId) {
    result = result.filter(
      (product) =>
        product.categoryId ===
        filters.categoryId
    );
  }

  // ============================================================
  // COLOR
  // ============================================================

  if (filters.colorIds.length > 0) {
    result = result.filter((product) => {
      return filters.colorIds.some(
        (colorId) =>
          product.colorIds.includes(colorId)
      );
    });
  }

  // ============================================================
  // PRICE
  // ============================================================

  if (filters.minPrice !== undefined) {
    result = result.filter(
      (product) =>
        product.price >= filters.minPrice!
    );
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter(
      (product) =>
        product.price <= filters.maxPrice!
    );
  }

  // ============================================================
  // STATUS
  // ============================================================

  result = result.filter(
    (product) => product.status === "active"
  );

  // ============================================================
  // AVAILABILITY
  // ============================================================

  if (filters.inStock === true) {
    result = result.filter((product) => {
      const availableStock =
        product.stock -
        product.reservedStock;

      return availableStock > 0;
    });
  }

  // ============================================================
  // FEATURED
  // ============================================================

  if (filters.isFeatured === true) {
    result = result.filter(
      (product) => product.isFeatured
    );
  }

  // ============================================================
  // NEW ARRIVALS
  // ============================================================

  if (filters.isNewArrival === true) {
    result = result.filter(
      (product) => product.isNewArrival
    );
  }

  // ============================================================
  // BEST SELLERS
  // ============================================================

  if (filters.isBestSeller === true) {
    result = result.filter(
      (product) => product.isBestSeller
    );
  }

  // ============================================================
  // SORT
  // ============================================================

  switch (filters.sort) {
    case "oldest":
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
      break;

    case "price_asc":
      result.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price_desc":
      result.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name_asc":
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "name_desc":
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
      break;

    case "rating":
      result.sort(
        (a, b) =>
          b.averageRating -
          a.averageRating
      );
      break;

    case "best_selling":
      result.sort(
        (a, b) =>
          b.soldCount - a.soldCount
      );
      break;

    case "newest":
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
      break;
  }

  return result;
}