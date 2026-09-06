import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Columns3 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getBoardApplications,
  updateApplication,
  type Application,
  type ApplicationStatus,
} from "../api/applications";
import { ErrorState, Loader } from "../components/AsyncState";
import KanbanColumn from "../components/KanbanColumn";

const COLUMNS: Array<{ status: ApplicationStatus; label: string }> = [
  { status: "WISHLIST", label: "Wishlist" },
  { status: "APPLIED", label: "Applied" },
  { status: "INTERVIEW", label: "Interview" },
  { status: "OFFER", label: "Offer" },
  { status: "REJECTED", label: "Rejected" },
];

const STATUSES = new Set(COLUMNS.map(({ status }) => status));

export default function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    let cancelled = false;
    getBoardApplications()
      .then((data) => {
        if (!cancelled) {
          setApplications(data);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  async function handleDragEnd({ active, over }: DragEndEvent) {
    const application = active.data.current?.application as
      | Application
      | undefined;
    const nextStatus = String(over?.id ?? "") as ApplicationStatus;

    if (!application || !STATUSES.has(nextStatus)) return;
    if (application.status === nextStatus) return;

    const previous = applications;
    setMessage("");
    setSaving(true);
    setApplications((current) =>
      current.map((item) =>
        item.id === application.id
          ? { ...item, status: nextStatus }
          : item,
      ),
    );

    try {
      const updated = await updateApplication(application.id, {
        status: nextStatus,
      });
      setApplications((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );
      setMessage(`${application.position} moved to ${nextStatus.toLowerCase()}.`);
    } catch {
      setApplications(previous);
      setMessage("Could not update the application status. The move was undone.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading board..." />;
  if (failed) {
    return (
      <ErrorState
        message="Could not load the Kanban board."
        onRetry={() => {
          setLoading(true);
          setRequestKey((current) => current + 1);
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in-up">
      <header>
        <div className="flex items-center gap-2">
          <Columns3 size={22} className="text-emerald-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-[#17211d] dark:text-[#edf3f0]">
            Application board
          </h1>
        </div>
        <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
          Drag applications between columns to update their status.
        </p>
      </header>

      {message && (
        <p role="status" className="mt-4 text-sm text-[#53615a] dark:text-[#b4c0ba]">
          {message}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-5 overflow-x-auto rounded-lg border border-[#d7dfdb] bg-white/50 dark:border-[#34413b] dark:bg-[#111814]/60">
          <div className="grid min-w-[80rem] grid-cols-5 divide-x divide-[#dfe6e2] dark:divide-[#34413b]">
            {COLUMNS.map(({ status, label }) => (
              <KanbanColumn
                key={status}
                status={status}
                label={label}
                disabled={saving}
                applications={applications.filter(
                  (application) => application.status === status,
                )}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
