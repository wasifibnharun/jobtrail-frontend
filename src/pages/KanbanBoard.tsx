import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Columns3 } from "lucide-react";
import toast from "react-hot-toast";

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
  const queryClient = useQueryClient();
  const boardQuery = useQuery({
    queryKey: ["board"],
    queryFn: getBoardApplications,
  });
  const applications = boardQuery.data ?? [];
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: ApplicationStatus;
    }) => updateApplication(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["board"] });
      const previous = queryClient.getQueryData<Application[]>(["board"]);

      queryClient.setQueryData<Application[]>(["board"], (current = []) =>
        current.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["board"], context?.previous ?? []);
      toast.error("Could not update the status. The move was undone.");
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Application[]>(["board"], (current = []) =>
        current.map((item) => item.id === updated.id ? updated : item),
      );
      toast.success("Application status updated.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["board"] });
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    const application = active.data.current?.application as
      | Application
      | undefined;
    const nextStatus = String(over?.id ?? "") as ApplicationStatus;

    if (!application || !STATUSES.has(nextStatus)) return;
    if (application.status === nextStatus) return;

    statusMutation.mutate({ id: application.id, status: nextStatus });
  }

  if (boardQuery.isPending) return <Loader label="Loading board..." />;
  if (boardQuery.isError) {
    return (
      <ErrorState
        message="Could not load the Kanban board."
        onRetry={() => void boardQuery.refetch()}
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
                disabled={statusMutation.isPending}
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
