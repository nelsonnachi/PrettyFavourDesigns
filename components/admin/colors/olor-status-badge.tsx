interface ColorStatusBadgeProps {
  isActive: boolean;
}

export function ColorStatusBadge({
  isActive,
}: ColorStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-[#f1ebe2] text-[#211b17]/60"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-600" : "bg-[#211b17]/30"
        }`}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}