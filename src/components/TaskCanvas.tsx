import { CheckCircle2, GitCommitVertical, Layers3 } from "lucide-react";
import type { Agent, Selection, TaskNode } from "../types";
import { calculateTaskProgress, getCriteriaSummary } from "../lib/criteria";
import { StatusBadge } from "./StatusBadge";

interface TaskCanvasProps {
  tasks: TaskNode[];
  agents: Agent[];
  selection: Selection;
  onSelectTask: (taskId: string) => void;
}

export function TaskCanvas({
  tasks,
  agents,
  selection,
  onSelectTask,
}: TaskCanvasProps) {
  const agentById = new Map(agents.map((agent) => [agent.id, agent]));

  return (
    <main className="task-canvas flex min-h-0 flex-1 flex-col bg-canvas">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Layers3 className="h-4 w-4 text-slate-500" />
            Loop Canvas / Task Graph
          </div>
          <p className="mt-1 text-xs text-slate-500">
            纵向任务流，Criteria 状态会实时回写任务摘要。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {tasks.length} tasks
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-3xl">
          {tasks.map((task, index) => {
            const selected =
              selection.type === "task" && selection.id === task.id;
            const owner = agentById.get(task.ownerId);
            const summary = getCriteriaSummary(task.criteria);
            const progress = calculateTaskProgress(task.criteria);

            return (
              <div className="relative" key={task.id}>
                {index > 0 ? (
                  <div className="flex h-7 items-center justify-center text-slate-300">
                    <GitCommitVertical className="h-5 w-5" />
                  </div>
                ) : null}

                <button
                  className={`w-full rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-slate-300 ${
                    selected
                      ? "border-slate-950 ring-2 ring-slate-950/5"
                      : "border-slate-200"
                  }`}
                  data-testid={`task-card-${task.id}`}
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-slate-950">
                        {task.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <StatusBadge label={task.status} />
                      <StatusBadge kind="risk" label={task.risk} />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                        <span
                          className="font-medium text-slate-700"
                          data-testid={`task-summary-${task.id}`}
                        >
                          {summary.text}
                        </span>
                        <span className="text-slate-500">{progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-end text-xs text-slate-500">
                      Owner:{" "}
                      <span className="ml-1 font-medium text-slate-700">
                        {owner?.name ?? "Unassigned"}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
