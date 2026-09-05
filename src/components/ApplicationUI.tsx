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
    <article className="glass-card dark:glass-card-dark group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#66716c] dark:text-[#aab5af]">
          {label}
        </span>
        <span
          className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${accentClass}`}
        >
          {icon}
        </span>
      </div>
      <strong className="mt-3 block text-2xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
        {value}
      </strong>
    </article>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  WISHLIST:
    "bg-slate-100/80 text-slate-700 dark:bg-slate-700/30 dark:text-slate-200",
  APPLIED:
    "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  INTERVIEW:
    "bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  OFFER:
    "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  REJECTED:
    "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm ${statusStyles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}