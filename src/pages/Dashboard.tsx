import {
  Briefcase,
  CalendarCheck,
  ChevronRight,
  CircleX,
  Plus,
  Send,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getStats,
  listApplications,
  type Application,
  type ApplicationStats,
} from "../api/applications";
import { ErrorState, EmptyState, Loader } from "../components/AsyncState";
import { StatCard, StatusBadge } from "../components/ApplicationUI";

function formatDate(value: string | null) {
  if (!value) return "No applied date";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getStats(),
      listApplications({ ordering: "-created_at" }),
    ])
      .then(([statsData, applicationsData]) => {
        if (cancelled) return;
        setStats(statsData);
        setRecent(applicationsData.results.slice(0, 5));
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

  function retry() {
    setLoading(true);
    setFailed(false);
    setRequestKey((current) => current + 1);
  }

  if (loading) {
    return <Loader label="Loading dashboard..." />;
  }

  if (failed || !stats) {
    return (
      <ErrorState
        message="Could not load your dashboard."
        onRetry={retry}
      />
    );
  }

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: <Briefcase size={18} aria-hidden="true" />,
      accent: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    },
    {
      label: "Applied",
      value: stats.applied,
      icon: <Send size={18} aria-hidden="true" />,
      accent: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      label: "Interviews",
      value: stats.interview,
      icon: <CalendarCheck size={18} aria-hidden="true" />,
      accent: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      label: "Offers",
      value: stats.offer,
      icon: <Trophy size={18} aria-hidden="true" />,
      accent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <CircleX size={18} aria-hidden="true" />,
      accent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#17211d] dark:text-[#edf3f0]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#66716c] dark:text-[#aab5af]">
            A quick view of your current job search.
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
        aria-label="Application statistics"
        className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5"
      >
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={card.icon}
            accentClass={card.accent}
          />
        ))}
      </section>

      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#17211d] dark:text-[#edf3f0]">
              Recent applications
            </h2>

            <p className="text-sm text-[#66716c] dark:text-[#aab5af]">
              Your five latest opportunities.
            </p>
          </div>

          <Link
            to="/applications"
            className="shrink-0 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="No applications yet"
            message="Add your first opportunity to start tracking your progress."
            actionLabel="Add application"
            actionTo="/applications/new"
          />
        ) : (
          <ul className="divide-y divide-[#e6ebe8] overflow-hidden rounded-lg border border-[#dce3df] bg-white dark:divide-[#2d3933] dark:border-[#34413b] dark:bg-[#18201d]">
            {recent.map((application) => (
              <li key={application.id}>
                <Link
                  to={`/applications/${application.id}/edit`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-[#f8faf9] dark:hover:bg-[#222c27] sm:grid-cols-[minmax(0,1fr)_auto_160px_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#202b26] dark:text-[#edf3f0]">
                      {application.position}
                    </p>
                    <p className="truncate text-sm text-[#66716c] dark:text-[#aab5af]">
                      {application.company}
                    </p>
                  </div>

                  <StatusBadge status={application.status} />

                  <span className="hidden text-sm text-[#66716c] dark:text-[#aab5af] sm:block">
                    {formatDate(application.applied_on)}
                  </span>

                  <ChevronRight
                    size={18}
                    className="hidden text-[#8a958f] dark:text-[#829088] sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}