import {
  CalendarClock,
  FilePenLine,
  Send,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Application } from "../api/applications";
import type { Interview } from "../api/interviews";

interface Props {
  application: Application;
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

interface Activity {
  id: string;
  title: string;
  detail: string;
  date: Date;
  icon: ReactNode;
  result?: Interview["result"];
}

export default function InterviewTimeline({ application, interviews }: Props) {
  const activities: Activity[] = [
    {
      id: "created",
      title: "Record created",
      detail: `${application.position} added to JobTrail`,
      date: new Date(application.created_at),
      icon: <Sparkles size={15} aria-hidden="true" />,
    },
  ];

  if (application.applied_on) {
    activities.push({
      id: "applied",
      title: "Application submitted",
      detail: `Applied to ${application.company}`,
      date: new Date(`${application.applied_on}T12:00:00`),
      icon: <Send size={15} aria-hidden="true" />,
    });
  }

  interviews.forEach((interview) => activities.push({
    id: `interview-${interview.id}`,
    title: interview.round_name,
    detail: `${interview.mode.toLowerCase()} interview${interview.notes ? `: ${interview.notes}` : ""}`,
    date: new Date(interview.scheduled_at),
    icon: <CalendarClock size={15} aria-hidden="true" />,
    result: interview.result,
  }));

  if (application.updated_at !== application.created_at) {
    activities.push({
      id: "updated",
      title: "Record updated",
      detail: `Current status: ${application.status.toLowerCase()}`,
      date: new Date(application.updated_at),
      icon: <FilePenLine size={15} aria-hidden="true" />,
    });
  }

  activities.sort((first, second) => first.date.getTime() - second.date.getTime());

  return (
    <ol className="relative ml-2 border-l border-[#d8e0dc] dark:border-[#35423b]">
      {activities.map((activity) => (
        <li key={activity.id} className="relative pb-7 pl-7 last:pb-0">
          <span className="absolute -left-3 top-0 flex size-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white dark:border-[#151d19]">
            {activity.icon}
          </span>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#202b26] dark:text-[#edf3f0]">
                {activity.title}
              </h3>
              <p className="mt-1 text-sm text-[#66716c] dark:text-[#aab5af]">
                {formatDate(activity.date.toISOString())}
              </p>
            </div>

            {activity.result && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resultStyles[activity.result]}`}>
                {activity.result.toLowerCase()}
              </span>
            )}
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-[#53615a] dark:text-[#b4c0ba]">
            {activity.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
