import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ApplicationStats } from "../api/applications";

const STATUS_CONFIG = [
  { key: "wishlist", label: "Wishlist", color: "#64748b" },
  { key: "applied", label: "Applied", color: "#2563eb" },
  { key: "interview", label: "Interview", color: "#d97706" },
  { key: "offer", label: "Offer", color: "#059669" },
  { key: "rejected", label: "Rejected", color: "#dc2626" },
] as const;

function monthLabel(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(
    new Date(`${value}-01T00:00:00`),
  );
}

export default function DashboardCharts({ stats }: { stats: ApplicationStats }) {
  const monthly = stats.monthly.map((item) => ({
    ...item,
    label: monthLabel(item.month),
  }));
  const statuses = STATUS_CONFIG.map((item) => ({
    ...item,
    value: stats[item.key],
  }));

  return (
    <section aria-label="Application charts" className="mt-8 grid gap-4 lg:grid-cols-5">
      <article className="glass-card dark:glass-card-dark p-5 lg:col-span-3">
        <h2 className="font-bold text-[#25312b] dark:text-[#edf3f0]">
          Applications per month
        </h2>
        <p className="mt-1 text-xs text-[#718079] dark:text-[#98a69f]">
          Submitted during the last six months
        </p>
        <div className="mt-5 h-64" role="img" aria-label="Monthly applications bar chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: -24, right: 8 }}>
              <CartesianGrid stroke="#94a39b" strokeOpacity={0.22} vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#7b8982", fontSize: 12 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#7b8982", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#17211d", border: 0, borderRadius: 8, color: "#f4f8f6" }} cursor={{ fill: "#10b981", opacity: 0.08 }} />
              <Bar dataKey="count" name="Applications" fill="#059669" radius={[5, 5, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="glass-card dark:glass-card-dark p-5 lg:col-span-2">
        <h2 className="font-bold text-[#25312b] dark:text-[#edf3f0]">
          Status distribution
        </h2>
        <p className="mt-1 text-xs text-[#718079] dark:text-[#98a69f]">
          All current applications
        </p>
        <div className="mt-3 h-48" role="img" aria-label="Application status doughnut chart">
          {stats.total === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-[#718079] dark:text-[#98a69f]">
              No application data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statuses} dataKey="value" nameKey="label" innerRadius="56%" outerRadius="82%" paddingAngle={2} stroke="none">
                  {statuses.map((item) => <Cell key={item.key} fill={item.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#17211d", border: 0, borderRadius: 8, color: "#f4f8f6" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          {statuses.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-[#5f6c65] dark:text-[#afbbb5]">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
              <strong className="ml-auto text-[#25312b] dark:text-[#edf3f0]">{item.value}</strong>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
