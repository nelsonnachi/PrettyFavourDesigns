"use client";

interface DiscountStatusBadgeProps {
  isActive: boolean;
  startsAt?: string;
  endsAt?: string | null;
}

export function DiscountStatusBadge({
  isActive,
  startsAt,
  endsAt,
}: DiscountStatusBadgeProps) {
  const now = new Date();

  const startDate = startsAt ? new Date(startsAt) : null;
  const endDate = endsAt ? new Date(endsAt) : null;

  let label = "Inactive";
  let className = "bg-gray-100 text-gray-700";

  if (isActive) {
    if (startDate && startDate > now) {
      label = "Scheduled";
      className = "bg-blue-100 text-blue-700";
    } else if (endDate && endDate < now) {
      label = "Expired";
      className = "bg-red-100 text-red-700";
    } else {
      label = "Active";
      className = "bg-green-100 text-green-700";
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}