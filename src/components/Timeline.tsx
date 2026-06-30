import { Clock3 } from "lucide-react";
import type { TimelineEvent } from "../types";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <section className="timeline-panel h-[180px] shrink-0 border-t border-slate-200 bg-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Clock3 className="h-4 w-4 text-slate-500" />
            Timeline / Trace Log
          </div>
          <span className="text-xs text-slate-500">{events.length} events</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-3">
          <div className="space-y-2">
            {[...events].reverse().map((event) => (
              <div
                className="grid grid-cols-[132px_120px_110px_1fr_150px] items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                key={event.id}
              >
                <span className="font-mono text-slate-500">
                  {new Date(event.timestamp).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="font-medium text-slate-700">
                  {event.actor}
                </span>
                <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-center font-medium text-slate-600">
                  {event.type}
                </span>
                <span className="truncate text-slate-600">
                  {event.description}
                </span>
                <span className="truncate text-right font-medium text-slate-500">
                  {event.relatedNode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
