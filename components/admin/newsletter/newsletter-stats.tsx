import {
  Mail,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

interface NewsletterStatsProps {
  total: number;
  subscribed: number;
  unsubscribed: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({
  label,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function NewsletterStats({
  total,
  subscribed,
  unsubscribed,
}: NewsletterStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Total subscribers"
        value={total}
        icon={<Users size={18} />}
      />

      <StatCard
        label="Subscribed on page"
        value={subscribed}
        icon={<UserCheck size={18} />}
      />

      <StatCard
        label="Unsubscribed on page"
        value={unsubscribed}
        icon={<UserX size={18} />}
      />
    </div>
  );
}