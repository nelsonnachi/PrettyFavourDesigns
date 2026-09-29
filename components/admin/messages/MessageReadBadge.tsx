"use client";

interface MessageReadBadgeProps {
  isRead: boolean;
}

export function MessageReadBadge({
  isRead,
}: MessageReadBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isRead
          ? "bg-muted text-muted-foreground"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isRead
            ? "bg-muted-foreground/50"
            : "bg-orange-500"
        }`}
      />

      {isRead ? "Read" : "Unread"}
    </span>
  );
}