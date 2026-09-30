export const announcementKeys = {
  all: ["announcements"] as const,

  public: () =>
    [
      ...announcementKeys.all,
      "public",
    ] as const,

  admin: () =>
    [
      ...announcementKeys.all,
      "admin",
    ] as const,

  adminCurrent: () =>
    [
      ...announcementKeys.admin(),
      "current",
    ] as const,

  adminDetail: (
    id: string,
  ) =>
    [
      ...announcementKeys.admin(),
      "detail",
      id,
    ] as const,
};