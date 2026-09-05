import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Application } from "../api/applications";

interface ConfirmModalProps {
  application: Application | null;
  deleting: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  application,
  deleting,
  error,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!application) return;

    cancelButton.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [application, deleting, onCancel]);

  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="glass-card dark:glass-card-dark w-full max-w-md rounded-2xl p-6 animate-slide-up"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-red-100/80 text-red-700 dark:bg-red-950/50 dark:text-red-300">
          <Trash2 size={20} aria-hidden="true" />
        </div>

        <h2
          id="delete-title"
          className="mt-4 text-lg font-bold text-[#202b26] dark:text-[#edf3f0]"
        >
          Delete application?
        </h2>

        <p id="delete-description" className="mt-2 text-sm text-[#66716c] dark:text-[#aab5af]">
          Delete{" "}
          <strong className="font-semibold text-[#303b36] dark:text-[#dce5e0]">
            {application.position} at {application.company}
          </strong>
          ? This action cannot be undone.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-red-50/80 px-3.5 py-2.5 text-sm text-red-700 backdrop-blur-sm dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButton}
            type="button"
            disabled={deleting}
            onClick={onCancel}
            className="glass dark:glass-dark rounded-xl px-4 py-2.5 text-sm font-medium text-[#36413c] transition-all hover:bg-white/80 active:scale-[0.97] disabled:opacity-50 dark:text-[#dce5e0] dark:hover:bg-white/8"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:from-red-500 hover:to-red-600 hover:shadow-red-500/30 active:scale-[0.97] disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}
