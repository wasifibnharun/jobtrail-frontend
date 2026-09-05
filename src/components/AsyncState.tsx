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
      className="flex min-h-48 items-center justify-center gap-2.5 text-sm text-[#66716c] dark:text-[#aab5af]"
    >
      <LoaderCircle
        className="animate-spin text-emerald-500"
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
    <div className="glass-card dark:glass-card-dark flex min-h-52 flex-col items-center justify-center rounded-2xl border-dashed px-5 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-[#edf0ee]/80 dark:bg-[#1e2924]/80">
        <Inbox size={24} className="text-[#7b8781] dark:text-[#97a49d]" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-bold text-[#27322d] dark:text-[#edf3f0]">
        {title}
      </h2>
      <p className="mt-1.5 max-w-md text-sm text-[#66716c] dark:text-[#aab5af]">{message}</p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white btn-glow transition-all hover:from-emerald-500 hover:to-teal-500 hover:btn-glow-hover active:scale-[0.97]"
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
      className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-red-200/50 bg-red-50/60 px-5 py-8 text-center backdrop-blur-sm dark:border-red-900/30 dark:bg-red-950/20"
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-red-100/80 dark:bg-red-950/50">
        <AlertCircle size={24} className="text-red-600 dark:text-red-400" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-red-800 dark:text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex items-center gap-1.5 rounded-xl border border-red-300/60 bg-white/60 px-3.5 py-2 text-sm font-medium text-red-700 backdrop-blur-sm transition-all hover:bg-white/80 active:scale-[0.97] dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
