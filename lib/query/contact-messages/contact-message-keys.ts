export const contactMessageKeys = {
  all: ["contact-messages"] as const,

  admin: () =>
    [
      ...contactMessageKeys.all,
      "admin",
    ] as const,

  adminList: (
    page: number,
    limit: number,
    search?: string,
    isRead?: boolean,
    sort: "newest" | "oldest" = "newest",
  ) =>
    [
      ...contactMessageKeys.admin(),
      "list",
      {
        page,
        limit,
        search: search || undefined,
        isRead,
        sort,
      },
    ] as const,

  adminDetail: (id: string) =>
    [
      ...contactMessageKeys.admin(),
      "detail",
      id,
    ] as const,

  unreadCount: () =>
    [
      ...contactMessageKeys.admin(),
      "unread-count",
    ] as const,
};