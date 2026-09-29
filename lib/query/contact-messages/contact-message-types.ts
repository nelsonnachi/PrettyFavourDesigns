// ============================================================
// USER
// ============================================================

export interface ContactMessageUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phone: string | null;
}

// ============================================================
// MESSAGE
// ============================================================

export interface ContactMessage {
  id: string;
  userId: string | null;

  name: string;
  email: string;
  phone: string | null;

  subject: string | null;
  message: string;

  isRead: boolean;
  createdAt: string;

  user: ContactMessageUser | null;
}

// ============================================================
// CREATE
// ============================================================

export interface CreateContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface CreateContactMessageResponse {
  success: boolean;

  data: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    createdAt: string;
  };

  message: string;
}

// ============================================================
// ADMIN FILTERS
// ============================================================

export interface AdminContactMessageParams {
  page?: number;
  limit?: number;
  search?: string;
  isRead?: boolean;
  sort?: "newest" | "oldest";
}

// ============================================================
// LIST RESPONSE
// ============================================================

export interface AdminContactMessagesResponse {
  success: boolean;

  data: ContactMessage[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================
// DETAIL
// ============================================================

export interface AdminContactMessageResponse {
  success: boolean;
  data: ContactMessage;
  message?: string;
}

// ============================================================
// UPDATE
// ============================================================

export interface UpdateContactMessageInput {
  isRead: boolean;
}

export interface UpdateContactMessageResponse {
  success: boolean;
  data: ContactMessage;
  message: string;
}

// ============================================================
// DELETE
// ============================================================

export interface DeleteContactMessageResponse {
  success: boolean;
  message: string;
}