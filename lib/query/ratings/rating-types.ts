// ============================================================
// RATING USER
// ============================================================

export interface RatingUser {
  id: string;

  firstName: string | null;

  lastName: string | null;

  imageUrl: string | null;
}

// ============================================================
// PRODUCT RATING
// ============================================================

export interface Rating {
  id: string;

  rating: number;

  createdAt: string;

  updatedAt: string;

  user: RatingUser;
}

// ============================================================
// CREATE RATING INPUT
// ============================================================

export interface CreateRatingInput {
  productId: string;

  rating: number;
}

// ============================================================
// UPDATE RATING INPUT
// ============================================================

export interface UpdateRatingInput {
  rating: number;
}
