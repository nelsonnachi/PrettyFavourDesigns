// ============================================================
// CONTACT MESSAGE USER
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
// CONTACT MESSAGE
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

  user?: ContactMessageUser | null;
}

// ============================================================
// CREATE CONTACT MESSAGE INPUT
// ============================================================

export interface CreateContactMessageInput {
  name: string;

  email: string;

  phone?: string;

  subject?: string;

  message: string;
}

// ============================================================
// CREATE CONTACT MESSAGE RESPONSE
// ============================================================

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
// ADMIN CONTACT MESSAGE LIST PARAMS
// ============================================================

export interface AdminContactMessageParams {
  page?: number;

  limit?: number;

  search?: string;

  isRead?: boolean;

  sort?: "newest" | "oldest";
}

// ============================================================
// ADMIN CONTACT MESSAGE LIST RESPONSE
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
// ADMIN SINGLE CONTACT MESSAGE RESPONSE
// ============================================================

export interface AdminContactMessageResponse {
  success: boolean;

  data: ContactMessage;

  message?: string;
}

// ============================================================
// UPDATE CONTACT MESSAGE INPUT
// ============================================================

export interface UpdateContactMessageInput {
  isRead: boolean;
}

// ============================================================
// UPDATE CONTACT MESSAGE RESPONSE
// ============================================================

export interface UpdateContactMessageResponse {
  success: boolean;

  data: ContactMessage;

  message: string;
}

// ============================================================
// DELETE CONTACT MESSAGE RESPONSE
// ============================================================

export interface DeleteContactMessageResponse {
  success: boolean;

  message: string;
}