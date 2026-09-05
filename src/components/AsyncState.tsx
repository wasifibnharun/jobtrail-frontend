import {
  AlertCircle,
  Inbox,
  LoaderCircle,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#66716c]"
    >
      <LoaderCircle
        className="animate-spin text-emerald-700"
        size={20}
        aria-hidden="true"
      />
      {label}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center border border-dashed border-[#cfd8d3] bg-white px-5 py-10 text-center">
      <Inbox size={28} className="text-[#7b8781]" aria-hidden="true" />
      <h2 className="mt-3 text-base font-semibold text-[#27322d]">
        {title}
      </h2>
      <p className="mt-1 max-w-md text-sm text-[#66716c]">{message}</p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus size={16} aria-hidden="true" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-48 flex-col items-center justify-center border border-red-200 bg-red-50 px-5 py-8 text-center"
    >
      <AlertCircle size={28} className="text-red-600" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}