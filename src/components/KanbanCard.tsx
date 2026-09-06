import { useDraggable } from "@dnd-kit/core";
import { BellRing, CalendarDays, GripVertical } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import type { Application } from "../api/applications";

interface Props {
  application: Application;
  disabled?: boolean;
}

function formatDate(value: string | null) {
  if (!value) return "No applied date";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function KanbanCard({ application, disabled = false }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: application.id,
    data: { application },
    disabled,
  });

  const style: CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 20 : undefined,
      }
    : {};

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-[#dce3df] bg-white p-3 shadow-sm transition-shadow dark:border-[#344039] dark:bg-[#18211d] ${
        isDragging ? "opacity-80 shadow-xl" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <Link
          to={`/applications/${application.id}`}
          className="min-w-0 flex-1"
        >
          <h3 className="truncate text-sm font-semibold text-[#202b26] hover:text-emerald-700 dark:text-[#edf3f0] dark:hover:text-emerald-300">
            {application.position}
          </h3>
          <p className="mt-0.5 truncate text-xs text-[#66716c] dark:text-[#aab5af]">
            {application.company}
          </p>
        </Link>

        <button
          type="button"
          disabled={disabled}
          title="Drag to change status"
          aria-label={`Move ${application.position}`}
          className="cursor-grab touch-none rounded p-1 text-[#87928c] hover:bg-[#eef2f0] active:cursor-grabbing disabled:cursor-wait disabled:opacity-40 dark:hover:bg-[#25312b]"
          {...listeners}
          {...attributes}
        >
          <GripVertical size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-[#718079] dark:text-[#98a69f]">
        <span className="flex items-center gap-1">
          <CalendarDays size={13} aria-hidden="true" />
          {formatDate(application.applied_on)}
        </span>

        {application.needs_follow_up && (
          <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-300">
            <BellRing size={13} aria-hidden="true" />
            Follow up
          </span>
        )}
      </div>
    </article>
  );
}
