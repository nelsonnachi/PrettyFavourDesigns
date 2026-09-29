"use client";

import {
  ArrowLeft,
  Mail,
} from "lucide-react";

import { useRouter } from "next/navigation";

interface NewsletterDetailHeaderProps {
  email: string;
}

export function NewsletterDetailHeader({
  email,
}: NewsletterDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to newsletter
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Mail size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Subscriber details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}