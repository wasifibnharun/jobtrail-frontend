import {
  ArrowLeft,
  BellRing,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getApplication,
  type Application,
} from "../api/applications";
import {
  listApplicationInterviews,
  type Interview,
} from "../api/interviews";
import { StatusBadge } from "../components/ApplicationUI";
import { ErrorState, Loader } from "../components/AsyncState";
import InterviewTimeline from "../components/InterviewTimeline";

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatSalary(value: number | null) {
  if (value === null) return "Not set";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] =
    useState<Application | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (!id) {
      setFailed(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.all([
      getApplication(id),
      listApplicationInterviews(id),
    ])
      .then(([applicationData, interviewData]) => {
        if (cancelled) return;

        setApplication(applicationData);
        setInterviews(interviewData.results);
        setFailed(false);
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
  }, [id, requestKey]);

  if (loading) {
    return <Loader label="Loading application..." />;
  }

  if (failed || !application) {
    return (
      <ErrorState
        message="Could not load this application."
        onRetry={() => {
          setLoading(true);
          setRequestKey((current) => current + 1);
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in-up">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/applications"
          className="flex items-center gap-1.5 text-sm font-medium text-[#66716c] hover:text-emerald-700 dark:text-[#aab5af] dark:hover:text-emerald-300"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Applications
        </Link>

        <Link
          to={`/applications/${application.id}/edit`}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          <Pencil size={16} aria-hidden="true" />
          Edit
        </Link>
      </header>

      <section className="mt-5 glass-card dark:glass-card-dark rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#17211d] dark:text-[#edf3f0]">
              {application.position}
            </h1>
            <p className="mt-1 text-[#66716c] dark:text-[#aab5af]">
              {application.company}
            </p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        {application.needs_follow_up && (
          <p className="mt-5 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <BellRing size={17} aria-hidden="true" />
            This application may need a follow-up.
          </p>
        )}

        <dl className="mt-6 grid gap-5 border-y border-[#e1e7e4] py-5 sm:grid-cols-3 dark:border-[#344039]">
          {[
            ["Work mode", application.job_type.toLowerCase()],
            ["Applied on", formatDate(application.applied_on)],
            ["Expected salary", formatSalary(application.expected_salary)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase text-[#7a8780]">
                {label}
              </dt>
              <dd className="mt-1 capitalize text-[#26322c] dark:text-[#dce5e0]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {application.job_link && (
          <a
            href={application.job_link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300"
          >
            View job listing
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        )}

        <h2 className="mt-6 font-semibold dark:text-[#edf3f0]">Notes</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-[#66716c] dark:text-[#aab5af]">
          {application.notes || "No notes added."}
        </p>
      </section>

      <section className="mt-5 glass-card dark:glass-card-dark rounded-2xl p-5 sm:p-6">
        <h2 className="mb-6 text-lg font-bold dark:text-[#edf3f0]">
          Interview timeline
        </h2>
        <InterviewTimeline interviews={interviews} />
      </section>
    </div>
  );
}