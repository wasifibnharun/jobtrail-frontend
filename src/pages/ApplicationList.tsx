import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#17211d]">
            Applications
          </h1>
          <p className="mt-1 text-sm text-[#66716c]">
            Search and manage your job opportunities.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus size={17} aria-hidden="true" />
          Add application
        </Link>
      </header>

      <section
        aria-label="Application filters"
        className="mt-7 grid gap-3 border-y border-[#dce3df] py-4 sm:grid-cols-[minmax(0,1fr)_220px]"
      >
        <label className="relative">
          <span className="sr-only">Search applications</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8781]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search company or position"
            className="w-full rounded-md border border-[#cfd8d3] bg-white py-2.5 pl-10 pr-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label>
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              changeStatus(event.target.value as ApplicationStatus | "")
            }
            className="w-full rounded-md border border-[#cfd8d3] bg-white px-3 py-2.5 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
            <ul className="divide-y divide-[#e6ebe8] overflow-hidden rounded-lg border border-[#dce3df] bg-white">
              {data.results.map((application) => (
                <li
                  key={application.id}
                  className="flex flex-wrap items-center gap-3 px-4 py-4"
                >
                  <div className="min-w-0 flex-1 basis-52">
                    <p className="truncate font-medium text-[#202b26]">
                      {application.position}
                    </p>
                    <p className="truncate text-sm text-[#66716c]">
                      {application.company}
                    </p>
                  </div>

                  <StatusBadge status={application.status} />

                  <div className="w-full text-sm text-[#66716c] sm:w-36">
                    <span className="mr-1 text-xs uppercase text-[#87918c]">
                      Applied
                    </span>
                    {formatDate(application.applied_on)}
                  </div>

                  <Link
                    to={`/applications/${application.id}/edit`}
                    className="flex items-center gap-1.5 rounded-md border border-[#cfd8d3] px-3 py-2 text-sm font-medium text-[#36413c] hover:bg-[#f4f6f5]"
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(application)}
                    className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#66716c]">
                Page {page} of {totalPages} · {data.count} total
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="flex items-center gap-1 rounded-md border border-[#cfd8d3] bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  className="flex items-center gap-1 rounded-md border border-[#cfd8d3] bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
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