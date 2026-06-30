import type { CriterionStatus, RiskLevel, TaskStatus } from "../types";

const statusStyles: Record<TaskStatus | CriterionStatus, string> = {
  Todo: "bg-slate-100 text-slate-700 border-slate-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Passed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-rose-50 text-rose-700 border-rose-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  Blocked: "bg-orange-50 text-orange-700 border-orange-200",
  Pending: "bg-slate-50 text-slate-600 border-slate-200",
};

const riskStyles: Record<RiskLevel, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-rose-50 text-rose-700 border-rose-200",
};

interface StatusBadgeProps {
  label: TaskStatus | CriterionStatus | RiskLevel;
  kind?: "status" | "risk";
}

export function StatusBadge({ label, kind = "status" }: StatusBadgeProps) {
  const className =
    kind === "risk"
      ? riskStyles[label as RiskLevel]
      : statusStyles[label as TaskStatus | CriterionStatus];

  return (
    <span
      className={`inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
