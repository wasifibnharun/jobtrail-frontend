import { useDroppable } from "@dnd-kit/core";

import type {
  Application,
  ApplicationStatus,
} from "../api/applications";
import KanbanCard from "./KanbanCard";

interface Props {
  applications: Application[];
  disabled: boolean;
  label: string;
  status: ApplicationStatus;
}

export default function KanbanColumn({
  applications,
  disabled,
  label,
  status,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${label} applications`}
      className={`min-h-[34rem] min-w-64 p-3 transition-colors ${
        isOver ? "bg-emerald-50/80 dark:bg-emerald-950/30" : ""
      }`}
    >
      <header className="mb-3 flex items-center justify-between gap-2 px-1">
        <h2 className="text-sm font-semibold text-[#334039] dark:text-[#dce5e0]">
          {label}
        </h2>
        <span className="flex size-6 items-center justify-center rounded-full bg-[#e8eeeb] text-xs font-semibold text-[#53615a] dark:bg-[#26322c] dark:text-[#bdc8c2]">
          {applications.length}
        </span>
      </header>

      <div className="space-y-2.5">
        {applications.map((application) => (
          <KanbanCard
            key={application.id}
            application={application}
            disabled={disabled}
          />
        ))}

        {applications.length === 0 && (
          <p className="rounded-lg border border-dashed border-[#ccd6d1] px-3 py-8 text-center text-xs text-[#7a8780] dark:border-[#3b4941] dark:text-[#91a097]">
            Drop an application here
          </p>
        )}
      </div>
    </section>
  );
}
