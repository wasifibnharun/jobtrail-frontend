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
      accent: "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 dark:from-slate-700/50 dark:to-slate-800/50 dark:text-slate-200",
    },
    {
      label: "Applied",
      value: stats.applied,
      icon: <Send size={18} aria-hidden="true" />,
      accent: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/50 dark:to-blue-950/50 dark:text-blue-300",
    },
    {
      label: "Interviews",
      value: stats.interview,
      icon: <CalendarCheck size={18} aria-hidden="true" />,
      accent: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/50 dark:to-amber-950/50 dark:text-amber-300",
    },
    {
      label: "Offers",
      value: stats.offer,
      icon: <Trophy size={18} aria-hidden="true" />,
      accent: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900/50 dark:to-emerald-950/50 dark:text-emerald-300",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <CircleX size={18} aria-hidden="true" />,
      accent: "bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/50 dark:to-red-950/50 dark:text-red-300",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-[#66716c] dark:text-[#aab5af]">
            A quick view of your current job search.
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
        aria-label="Application statistics"
        className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-5"
      >
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <StatCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              accentClass={card.accent}
            />
          </div>
        ))}
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#17211d] dark:text-[#edf3f0]">
              Recent applications
            </h2>

            <p className="text-sm text-[#66716c] dark:text-[#aab5af]">
              Your five latest opportunities.
            </p>
          </div>

          <Link
            to="/applications"
            className="shrink-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
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
          <ul className="glass-card dark:glass-card-dark divide-y divide-[#e6ebe8]/50 overflow-hidden rounded-2xl dark:divide-[#2d3933]/50">
            {recent.map((application, index) => (
              <li
                key={application.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 5) * 60}ms` }}
              >
                <Link
                  to={`/applications/${application.id}/edit`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 transition-all hover:bg-white/40 dark:hover:bg-white/5 sm:grid-cols-[minmax(0,1fr)_auto_160px_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#202b26] dark:text-[#edf3f0]">
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
                    className="hidden text-[#8a958f] transition-transform group-hover:translate-x-0.5 dark:text-[#829088] sm:block"
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