import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedApplications | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const successMessage = (
    location.state as { message?: string } | null
  )?.message;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextSearch = searchInput.trim();

      if (nextSearch !== search) {
        setLoading(true);
        setPage(1);
        setSearch(nextSearch);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search, searchInput]);

  useEffect(() => {
    let cancelled = false;

    listApplications({
      search: search || undefined,
      status: statusFilter || undefined,
      ordering: "-created_at",
      page,
    })
      .then((response) => {
        if (!cancelled) {
          setData(response);
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
  }, [page, requestKey, search, statusFilter]);

  function changeStatus(value: ApplicationStatus | "") {
    setLoading(true);
    setStatusFilter(value);
    setPage(1);
  }

  function changePage(nextPage: number) {
    setLoading(true);
    setPage(nextPage);
  }

  function retry() {
    setLoading(true);
    setFailed(false);
    setRequestKey((current) => current + 1);
  }

  function openDeleteModal(application: Application) {
    setDeleteError("");
    setSelectedApplication(application);
  }

  function closeDeleteModal() {
    if (deleting) return;
    setDeleteError("");
    setSelectedApplication(null);
  }

  async function handleDelete() {
    if (!selectedApplication || !data) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteApplication(selectedApplication.id);

      const deletedLastRow = data.results.length === 1;
      setSelectedApplication(null);
      setLoading(true);

      if (deletedLastRow && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRequestKey((current) => current + 1);
      }
    } catch {
      setDeleteError("Could not delete this application. Please try again.");
    } finally {
      setDeleting(false);
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

      {successMessage && (
        <p
          role="status"
          className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-2.5 text-sm text-emerald-800 backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2 size={17} aria-hidden="true" />
          {successMessage}
        </p>
      )}

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
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
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
        {loading ? (
          <Loader label="Loading applications..." />
        ) : failed || !data ? (
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
        deleting={deleting}
        error={deleteError}
        onCancel={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
