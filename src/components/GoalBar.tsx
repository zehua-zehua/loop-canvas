import {
  Download,
  GitBranch,
  Pencil,
  PlayCircle,
  Target,
} from "lucide-react";
import type { Goal } from "../types";

interface GoalBarProps {
  goal: Goal;
  onReplan?: () => void;
  onExport?: () => void;
}

export function GoalBar({ goal, onReplan, onExport }: GoalBarProps) {
  return (
    <header className="flex min-h-[112px] items-center gap-5 border-b border-slate-200 bg-white px-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-950 text-white shadow-soft">
        <Target className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-slate-950">
            {goal.title}
          </h1>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
            {goal.version}
          </span>
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {goal.phase}
          </span>
          <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            {goal.status}
          </span>
        </div>
        <p className="line-clamp-2 max-w-5xl text-sm leading-5 text-slate-600">
          {goal.description}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 w-64 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-950"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            进度 {goal.progress}%
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <button className="icon-button" type="button" title="编辑目标">
          <Pencil className="h-4 w-4" />
          <span>编辑目标</span>
        </button>
        <button
          className="icon-button"
          data-testid="goal-replan"
          type="button"
          title="重新规划任务"
          onClick={onReplan}
        >
          <GitBranch className="h-4 w-4" />
          <span>重新规划任务</span>
        </button>
        <button className="icon-button" type="button" title="运行评测">
          <PlayCircle className="h-4 w-4" />
          <span>运行评测</span>
        </button>
        <button
          className="icon-button primary-button"
          data-testid="export-json"
          type="button"
          title="导出 JSON"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span>导出 JSON</span>
        </button>
      </div>
    </header>
  );
}
