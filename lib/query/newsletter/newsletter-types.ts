// ============================================================
// NEWSLETTER TYPES
// ============================================================

// ------------------------------------------------------------
// NEWSLETTER SUBSCRIBER
// ------------------------------------------------------------

export type NewsletterSubscriber = {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
};

// ------------------------------------------------------------
// PAGINATION
// ------------------------------------------------------------

export type NewsletterPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ------------------------------------------------------------
// SORT
// ------------------------------------------------------------

export type NewsletterSort = "newest" | "oldest";

// ------------------------------------------------------------
// FILTERS
// ------------------------------------------------------------

export type NewsletterFilters = {
  search?: string;
  isSubscribed?: boolean;
  page?: number;
  limit?: number;
  sort?: NewsletterSort;
};

// ------------------------------------------------------------
// SUBSCRIBE RESPONSE
// ------------------------------------------------------------

export type SubscribeNewsletterResponse = {
  success: true;
  data: NewsletterSubscriber;
  message: string;
};

// ------------------------------------------------------------
// UNSUBSCRIBE RESPONSE
// ------------------------------------------------------------

export type UnsubscribeNewsletterResponse = {
  success: true;
  data: NewsletterSubscriber;
  message: string;
};

// ------------------------------------------------------------
// ADMIN LIST RESPONSE
// ------------------------------------------------------------

export type AdminNewsletterListResponse = {
  success: true;
  data: NewsletterSubscriber[];
  pagination: NewsletterPagination;
};

// ------------------------------------------------------------
// ADMIN DETAIL RESPONSE
// ------------------------------------------------------------

export type AdminNewsletterDetailResponse = {
  success: true;
  data: NewsletterSubscriber;
};

// ------------------------------------------------------------
// ADMIN UPDATE RESPONSE
// ------------------------------------------------------------

export type AdminNewsletterUpdateResponse = {
  success: true;
  data: NewsletterSubscriber;
  message: string;
};

// ------------------------------------------------------------
// ADMIN DELETE RESPONSE
// ------------------------------------------------------------

export type AdminNewsletterDeleteResponse = {
  success: true;
  message: string;
};