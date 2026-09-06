import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
  deleteApplication,
  listApplications,
  type Application,
  type ApplicationStatus,
  type PaginatedApplications,
} from "../api/applications";
import ConfirmModal from "../components/ConfirmModal";
import { EmptyState, ErrorState, Loader } from "../components/AsyncState";
import { StatusBadge } from "../components/ApplicationUI";

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function ApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const statusValue = searchParams.get("status") ?? "";
  const statusFilter = [
    "WISHLIST",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
  ].includes(statusValue)
    ? (statusValue as ApplicationStatus)
    : "";
  const requestedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const searchTimeout = useRef<number | undefined>(undefined);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const queryClient = useQueryClient();
  const queryKey = [
    "applications",
    { search, status: statusFilter, page },
  ] as const;
  const applicationsQuery = useQuery({
    queryKey,
    queryFn: () =>
      listApplications({
        search: search || undefined,
        status: statusFilter || undefined,
        ordering: "-created_at",
        page,
      }),
    placeholderData: (previous) => previous,
  });
  const data = applicationsQuery.data;
  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onMutate: async (applicationId) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const previous = queryClient.getQueryData<PaginatedApplications>(queryKey);

      queryClient.setQueryData<PaginatedApplications>(queryKey, (current) =>
        current
          ? {
              ...current,
              count: Math.max(0, current.count - 1),
              results: current.results.filter(
                (application) => application.id !== applicationId,
              ),
            }
          : current,
      );

      return { previous };
    },
    onError: (_error, _applicationId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error("Could not delete the application. The row was restored.");
    },
    onSuccess: () => toast.success("Application deleted."),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["board"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  useEffect(() => {
    return () => window.clearTimeout(searchTimeout.current);
  }, [search]);

  function scheduleSearch(value: string) {
    window.clearTimeout(searchTimeout.current);
    searchTimeout.current = window.setTimeout(() => {
      const nextSearch = value.trim();

      if (nextSearch === search) return;

      const nextParams = new URLSearchParams(searchParams);

      if (nextSearch) {
        nextParams.set("search", nextSearch);
      } else {
        nextParams.delete("search");
      }

      nextParams.delete("page");
      setSearchParams(nextParams, { replace: true });
    }, 400);
  }

  function changeStatus(value: ApplicationStatus | "") {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set("status", value);
    } else {
      nextParams.delete("status");
    }

    nextParams.delete("page");
    setSearchParams(nextParams);
  }

  function changePage(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  }

  function retry() {
    void applicationsQuery.refetch();
  }

  function openDeleteModal(application: Application) {
    setSelectedApplication(application);
  }

  function closeDeleteModal() {
    if (deleteMutation.isPending) return;
    setSelectedApplication(null);
  }

  async function handleDelete() {
    if (!selectedApplication || !data) return;

    const deletedLastRow = data.results.length === 1;

    try {
      await deleteMutation.mutateAsync(selectedApplication.id);
      setSelectedApplication(null);

      if (deletedLastRow && page > 1) {
        changePage(page - 1);
      }
    } catch {
      // The mutation restores cached data and displays the error toast.
    }
  }

  const totalPages = data
    ? Math.max(1, Math.ceil(data.count / 10))
    : 1;
  const hasFilters = Boolean(search || statusFilter);

  return (
    <div className="animate-fade-in-up">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
            Applications
          </h1>
          <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
            Search and manage your job opportunities.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white btn-glow transition-all hover:from-emerald-500 hover:to-teal-500 hover:btn-glow-hover active:scale-[0.97]"
        >
          <Plus size={17} aria-hidden="true" />
          Add application
        </Link>
      </header>

      <section
        aria-label="Application filters"
        className="mt-7 glass dark:glass-dark grid gap-3 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_220px]"
      >
        <label className="relative">
          <span className="sr-only">Search applications</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b8781] dark:text-[#97a49d]"
            aria-hidden="true"
          />
          <input
            key={search}
            type="search"
            defaultValue={search}
            onChange={(event) => scheduleSearch(event.target.value)}
            placeholder="Search company or position"
            className="w-full rounded-xl border border-[#d0d8d4]/70 bg-white/60 py-2.5 pl-10 pr-3 text-[#18201d] outline-none backdrop-blur-sm transition-all placeholder:text-[#9ca5a0] focus:border-emerald-500 focus:glow-ring dark:border-[#3a4840]/70 dark:bg-[#111815]/60 dark:text-[#edf3f0] dark:placeholder:text-[#6b7a73] dark:focus:border-emerald-500"
          />
        </label>

        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              changeStatus(event.target.value as ApplicationStatus | "")
            }
            className="w-full rounded-xl border border-[#d0d8d4]/70 bg-white/60 px-3 py-2.5 text-[#18201d] outline-none backdrop-blur-sm transition-all focus:border-emerald-500 focus:glow-ring dark:border-[#3a4840]/70 dark:bg-[#111815]/60 dark:text-[#edf3f0] dark:focus:border-emerald-500"
          >
            <option value="">All statuses</option>
            <option value="WISHLIST">Wishlist</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
      </section>

      <div className="mt-5">
        {applicationsQuery.isPending ? (
          <Loader label="Loading applications..." />
        ) : applicationsQuery.isError || !data ? (
          <ErrorState
            message="Could not load your applications."
            onRetry={retry}
          />
        ) : data.results.length === 0 ? (
          <EmptyState
            title={
              hasFilters
                ? "No applications match this filter"
                : "No applications yet"
            }
            message={
              hasFilters
                ? "Try changing your search text or status filter."
                : "Add your first opportunity to start tracking progress."
            }
            actionLabel={hasFilters ? undefined : "Add application"}
            actionTo={hasFilters ? undefined : "/applications/new"}
          />
        ) : (
          <>
            <ul className="glass-card dark:glass-card-dark divide-y divide-[#e6ebe8]/50 overflow-hidden rounded-2xl dark:divide-[#2d3933]/50">
              {data.results.map((application, index) => (
                <li
                  key={application.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 transition-all hover:bg-white/40 dark:hover:bg-white/5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="min-w-0 flex-1 basis-52">
                    <p className="truncate font-semibold text-[#202b26] dark:text-[#edf3f0]">
                      {application.position}
                    </p>
                    <p className="truncate text-sm text-[#66716c] dark:text-[#aab5af]">
                      {application.company}
                    </p>
                  </div>

                  <StatusBadge status={application.status} />

                  <div className="w-full text-sm text-[#66716c] dark:text-[#aab5af] sm:w-36">
                    <span className="mr-1 text-xs uppercase tracking-wider text-[#87918c] dark:text-[#87958e]">
                      Applied
                    </span>
                    {formatDate(application.applied_on)}
                  </div>

                  <Link
                    to={`/applications/${application.id}`}
                    title="View details"
                    aria-label={`View ${application.position} details`}
                    className="glass dark:glass-dark flex size-9 items-center justify-center rounded-lg text-[#36413c] transition-all hover:bg-white/80 dark:text-[#dce5e0] dark:hover:bg-white/8"
                  >
                    <Eye size={16} aria-hidden="true" />
                  </Link>

                  <Link
                    to={`/applications/${application.id}/edit`}
                    className="glass dark:glass-dark flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#36413c] transition-all hover:bg-white/80 active:scale-[0.97] dark:text-[#dce5e0] dark:hover:bg-white/8"
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(application)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200/60 bg-red-50/60 px-3 py-2 text-sm font-medium text-red-700 backdrop-blur-sm transition-all hover:bg-red-100/80 active:scale-[0.97] dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#66716c] dark:text-[#aab5af]">
                Page {page} of {totalPages} · {data.count} total
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="glass dark:glass-dark flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#dce5e0] dark:hover:bg-white/8"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  className="glass dark:glass-dark flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/80 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#dce5e0] dark:hover:bg-white/8"
                >
                  Next
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <ConfirmModal
        application={selectedApplication}
        deleting={deleteMutation.isPending}
        error=""
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
