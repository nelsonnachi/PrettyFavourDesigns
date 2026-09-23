// ============================================================
// CATEGORY TYPES
// ============================================================

export type Category = {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  position: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
};

// ============================================================
// API RESPONSE
// ============================================================

export type CategoriesResponse = {
  success: boolean;

  data: Category[];
};

// ============================================================
// SINGLE CATEGORY RESPONSE
// ============================================================

export type CategoryResponse = {
  success: boolean;

  data: Category;
};

// ============================================================
// CREATE CATEGORY INPUT
// ============================================================

export type CreateCategoryInput = {
  name: string;

  slug: string;

  description?: string;

  position?: number;

  isActive?: boolean;
};

// ============================================================
// UPDATE CATEGORY INPUT
// ============================================================

export type UpdateCategoryInput = {
  name?: string;

  slug?: string;

  description?: string;

  position?: number;

  isActive?: boolean;
};

// ============================================================
// MUTATION RESPONSE
// ============================================================

export type CategoryMutationResponse = {
  success: boolean;

  message: string;

  data: Category;
};

// ============================================================
// DELETE CATEGORY RESPONSE
// ============================================================

export type DeleteCategoryResponse = {
  success: boolean;

  message: string;
};