// ============================================================
// ANNOUNCEMENT TYPES
// ============================================================

export type AnnouncementType =
  | "general"
  | "sale"
  | "event"
  | "class";

// ============================================================
// ANNOUNCEMENT
// ============================================================

export type Announcement = {
  id: string;
  type: AnnouncementType;
  title: string | null;
  imageUrl: string;
  imagePublicId: string;
  ctaText: string | null;
  ctaUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// ============================================================
// PUBLIC ANNOUNCEMENT
// ============================================================
//
// imagePublicId and updatedAt are intentionally not exposed
// to the storefront.
// ============================================================

export type PublicAnnouncement = {
  id: string;
  type: AnnouncementType;
  title: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaUrl: string | null;
  createdAt: string;
};

// ============================================================
// ADMIN ANNOUNCEMENT
// ============================================================

export type AdminAnnouncement =
  Announcement;

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
  type?: AnnouncementType;
  sort?: "newest" | "oldest";
};

// ============================================================
// CREATE INPUT
// ============================================================

export type CreateAnnouncementInput = {
  image: File;
  type?: AnnouncementType;
  title?: string;
  ctaText?: string;
  ctaUrl?: string;
};

// ============================================================
// UPDATE INPUT
// ============================================================

export type UpdateAnnouncementInput = {
  id: string;
  image?: File;
  type?: AnnouncementType;
  title?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
};

// ============================================================
// PUBLIC RESPONSE
// ============================================================

export type PublicAnnouncementResponse = {
  success: true;

  data: {
    announcement:
      | PublicAnnouncement
      | null;
  };
};

// ============================================================
// ADMIN CURRENT RESPONSE
// ============================================================

export type AdminAnnouncementListResponse = {
  success: true;

  data: {
    announcement:
      | AdminAnnouncement
      | null;
  };
};

// ============================================================
// ADMIN DETAIL RESPONSE
// ============================================================

export type AdminAnnouncementResponse = {
  success: true;

  data: {
    announcement: AdminAnnouncement;
  };
};

// ============================================================
// CREATE RESPONSE
// ============================================================

export type AdminCreateAnnouncementResponse = {
  success: true;

  data: {
    announcement: AdminAnnouncement;
  };

  message: string;
};

// ============================================================
// UPDATE RESPONSE
// ============================================================

export type AdminUpdateAnnouncementResponse = {
  success: true;

  data: {
    announcement: AdminAnnouncement;
  };

  message: string;
};

// ============================================================
// DELETE RESPONSE
// ============================================================

export type AdminDeleteAnnouncementResponse = {
  success: true;

  message: string;

  data: {
    id: string;
  };
};