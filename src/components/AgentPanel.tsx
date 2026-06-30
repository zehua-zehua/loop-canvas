import { Bot, ChevronRight } from "lucide-react";
import type { Agent, Selection } from "../types";

interface AgentPanelProps {
  agents: Agent[];
  selection: Selection;
  onSelectAgent: (agentId: string) => void;
}

export function AgentPanel({
  agents,
  selection,
  onSelectAgent,
}: AgentPanelProps) {
  return (
    <aside className="agent-panel flex min-h-0 w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Bot className="h-4 w-4 text-slate-500" />
          Agent Panel
        </div>
        <p className="mt-1 text-xs text-slate-500">4 个 mock agents</p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
        {agents.map((agent) => {
          const selected =
            selection.type === "agent" && selection.id === agent.id;

          return (
            <button
              className={`w-full rounded-lg border p-3 text-left transition hover:border-slate-300 hover:bg-slate-50 ${
                selected
                  ? "border-slate-950 bg-slate-50 shadow-soft"
                  : "border-slate-200 bg-white"
              }`}
              data-testid={`agent-card-${agent.id}`}
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-950">
                    {agent.name}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {agent.role}
                  </p>
                </div>
                <ChevronRight className="mt-0.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.skills.map((skill) => (
                  <span
                    className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] font-medium text-slate-600"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 text-xs">
                <span className="leading-5 text-slate-500">
                  {agent.persona}
                </span>
                <span className="rounded-md bg-slate-950 px-2 py-1 font-semibold text-white">
                  {agent.activeTasks}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
