// ============================================================
// ANNOUNCEMENT TYPES
// ============================================================

export type AnnouncementType =
  | "general"
  | "sale"
  | "event"
  | "class";

// ============================================================
// CAMPAIGN STATUS
// ============================================================

export type CampaignStatus =
  | "draft"
  | "upcoming"
  | "active"
  | "expired";

// ============================================================
// ANNOUNCEMENT
// ============================================================

export type Announcement = {
  id: string;

  type: AnnouncementType;

  title: string;

  description: string | null;

  imageUrl: string | null;

  imagePublicId: string | null;

  ctaText: string | null;

  ctaUrl: string | null;

  eventAt: string | null;

  expiresAt: string | null;

  isPublished: boolean;

  publishedAt: string | null;

  createdAt: string;

  updatedAt: string;
};

// ============================================================
// PUBLIC ANNOUNCEMENT
// ============================================================
//
// Public API does not return:
// - imagePublicId
// - isPublished
// - updatedAt
//
// ============================================================

export type PublicAnnouncement = {
  id: string;

  type: AnnouncementType;

  title: string;

  description: string | null;

  imageUrl: string | null;

  ctaText: string | null;

  ctaUrl: string | null;

  eventAt: string | null;

  expiresAt: string | null;

  publishedAt: string | null;

  createdAt: string;
};

// ============================================================
// ADMIN ANNOUNCEMENT
// ============================================================

export type AdminAnnouncement =
  Announcement & {
    campaignStatus: CampaignStatus;
  };

// ============================================================
// PUBLIC FILTERS
// ============================================================

export type PublicAnnouncementFilters = {
  type?: AnnouncementType;
};

// ============================================================
// ADMIN FILTERS
// ============================================================

export type AdminAnnouncementFilters = {
  search?: string;

  type?: AnnouncementType;

  isPublished?: boolean;

  page?: number;

  limit?: number;

  sort?: "newest" | "oldest";
};

// ============================================================
// PAGINATION
// ============================================================

export type AnnouncementPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
};

// ============================================================
// PUBLIC LIST RESPONSE
// ============================================================

export type PublicAnnouncementListResponse = {
  success: true;

  data: PublicAnnouncement[];
};

// ============================================================
// ADMIN LIST RESPONSE
// ============================================================

export type AdminAnnouncementListResponse = {
  success: true;

  data: AdminAnnouncement[];

  pagination: AnnouncementPagination;
};

// ============================================================
// ADMIN DETAIL RESPONSE
// ============================================================

export type AdminAnnouncementResponse = {
  success: true;

  data: AdminAnnouncement;
};

// ============================================================
// CREATE RESPONSE
// ============================================================

export type AdminCreateAnnouncementResponse = {
  success: true;

  data: AdminAnnouncement;

  message: string;
};

// ============================================================
// UPDATE RESPONSE
// ============================================================

export type AdminUpdateAnnouncementResponse = {
  success: true;

  data: AdminAnnouncement;

  message: string;
};

// ============================================================
// DELETE RESPONSE
// ============================================================

export type AdminDeleteAnnouncementResponse = {
  success: true;

  message: string;
};