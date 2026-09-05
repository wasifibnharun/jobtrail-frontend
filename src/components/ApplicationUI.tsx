import type { ReactNode } from "react";

import type { ApplicationStatus } from "../api/applications";

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accentClass: string;
}

export function StatCard({
  label,
  value,
  icon,
  accentClass,
}: StatCardProps) {
  return (
    <article className="rounded-lg border border-[#dce3df] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#66716c]">{label}</span>
        <span
          className={`flex size-9 items-center justify-center rounded-md ${accentClass}`}
        >
          {icon}
        </span>
      </div>
      <strong className="mt-3 block text-2xl font-semibold text-[#17211d]">
        {value}
      </strong>
    </article>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-slate-100 text-slate-700",
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-800",
  OFFER: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}