// ============================================================
// COLOR TYPES
// ============================================================

export interface Color {
  id: string;
  name: string;
  hexCode: string | null;
  isActive: boolean;
  createdAt: string;
}

// ============================================================
// CREATE COLOR INPUT
// ============================================================

export interface CreateColorInput {
  name: string;
  hexCode?: string;
  isActive?: boolean;
}

// ============================================================
// UPDATE COLOR INPUT
// ============================================================

export interface UpdateColorInput {
  name?: string;
  hexCode?: string;
  isActive?: boolean;
}