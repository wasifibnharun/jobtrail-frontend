import {
  CalendarClock,
  MapPin,
  Phone,
  Video,
} from "lucide-react";

import type { Interview } from "../api/interviews";

interface Props {
  interviews: Interview[];
}

const resultStyles = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  PASSED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  FAILED:
    "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ModeIcon({ mode }: Pick<Interview, "mode">) {
  if (mode === "VIDEO") {
    return <Video size={16} aria-hidden="true" />;
  }

  if (mode === "PHONE") {
    return <Phone size={16} aria-hidden="true" />;
  }

  return <MapPin size={16} aria-hidden="true" />;
}

export default function InterviewTimeline({ interviews }: Props) {
  if (interviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <CalendarClock
          size={30}
          className="mx-auto text-[#8b9690]"
          aria-hidden="true"
        />
        <p className="mt-3 font-medium text-[#35413b] dark:text-[#dce5e0]">
          No interviews scheduled
        </p>
        <p className="mt-1 text-sm text-[#718079] dark:text-[#98a69f]">
          Interview rounds will appear here chronologically.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative ml-2 border-l border-[#d8e0dc] dark:border-[#35423b]">
      {interviews.map((interview) => (
        <li key={interview.id} className="relative pb-7 pl-7 last:pb-0">
          <span className="absolute -left-2 top-1 size-4 rounded-full border-4 border-white bg-emerald-600 dark:border-[#151d19]" />

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#202b26] dark:text-[#edf3f0]">
                {interview.round_name}
              </h3>
              <p className="mt-1 text-sm text-[#66716c] dark:text-[#aab5af]">
                {formatDate(interview.scheduled_at)}
              </p>
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                resultStyles[interview.result]
              }`}
            >
              {interview.result.toLowerCase()}
            </span>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#53615a] dark:text-[#b4c0ba]">
            <ModeIcon mode={interview.mode} />
            {interview.mode.toLowerCase()}
          </p>

          {interview.notes && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#66716c] dark:text-[#aab5af]">
              {interview.notes}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}