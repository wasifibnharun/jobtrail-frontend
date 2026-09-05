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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !deleting) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="flex size-10 items-center justify-center rounded-md bg-red-100 text-red-700">
          <Trash2 size={20} aria-hidden="true" />
        </div>

        <h2
          id="delete-title"
          className="mt-4 text-lg font-semibold text-[#202b26]"
        >
          Delete application?
        </h2>

        <p id="delete-description" className="mt-2 text-sm text-[#66716c]">
          Delete{" "}
          <strong className="font-semibold text-[#303b36]">
            {application.position} at {application.company}
          </strong>
          ? This action cannot be undone.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
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
            className="rounded-md border border-[#cfd8d3] px-4 py-2 text-sm font-medium text-[#36413c] hover:bg-[#f4f6f5] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}