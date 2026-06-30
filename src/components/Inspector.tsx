import { Bot, ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import type { Agent, Selection, TaskNode } from "../types";
import { CriteriaEditor } from "./CriteriaEditor";

interface InspectorProps {
  selection: Selection;
  agents: Agent[];
  tasks: TaskNode[];
  expandedCriterionIds: string[];
  onToggleCriterion: (criterionId: string) => void;
  onTaskChange: CriteriaEditorHandlers["onTaskChange"];
  onCriterionChange: CriteriaEditorHandlers["onCriterionChange"];
  onCriterionEditEvent: CriteriaEditorHandlers["onCriterionEditEvent"];
  onAddCriterion: CriteriaEditorHandlers["onAddCriterion"];
  onDeleteCriterion: CriteriaEditorHandlers["onDeleteCriterion"];
  onDuplicateCriterion: CriteriaEditorHandlers["onDuplicateCriterion"];
  onMoveCriterion: CriteriaEditorHandlers["onMoveCriterion"];
  onNormalizeWeights: CriteriaEditorHandlers["onNormalizeWeights"];
  onMarkAllPending: CriteriaEditorHandlers["onMarkAllPending"];
  onMarkRequiredPassed: CriteriaEditorHandlers["onMarkRequiredPassed"];
  onResetSuggested: CriteriaEditorHandlers["onResetSuggested"];
  revisionText: CriteriaEditorHandlers["revisionText"];
  revisionPreview: CriteriaEditorHandlers["revisionPreview"];
  onRevisionTextChange: CriteriaEditorHandlers["onRevisionTextChange"];
  onGenerateRevisionPreview: CriteriaEditorHandlers["onGenerateRevisionPreview"];
  onApplyRevision: CriteriaEditorHandlers["onApplyRevision"];
  onCancelRevision: CriteriaEditorHandlers["onCancelRevision"];
  onCreateFixTask: CriteriaEditorHandlers["onCreateFixTask"];
  onReplan: CriteriaEditorHandlers["onReplan"];
  onAcceptedRisk: CriteriaEditorHandlers["onAcceptedRisk"];
}

type CriteriaEditorHandlers = Omit<
  Parameters<typeof CriteriaEditor>[0],
  "task" | "agents" | "expandedCriterionIds" | "onToggleCriterion"
>;

export function Inspector({
  selection,
  agents,
  tasks,
  expandedCriterionIds,
  onToggleCriterion,
  onTaskChange,
  onCriterionChange,
  onCriterionEditEvent,
  onAddCriterion,
  onDeleteCriterion,
  onDuplicateCriterion,
  onMoveCriterion,
  onNormalizeWeights,
  onMarkAllPending,
  onMarkRequiredPassed,
  onResetSuggested,
  revisionText,
  revisionPreview,
  onRevisionTextChange,
  onGenerateRevisionPreview,
  onApplyRevision,
  onCancelRevision,
  onCreateFixTask,
  onReplan,
  onAcceptedRisk,
}: InspectorProps) {
  const selectedTask =
    selection.type === "task"
      ? tasks.find((task) => task.id === selection.id)
      : undefined;
  const selectedAgent =
    selection.type === "agent"
      ? agents.find((agent) => agent.id === selection.id)
      : undefined;

  return (
    <aside className="inspector-panel flex min-h-0 w-[420px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <ClipboardCheck className="h-4 w-4 text-slate-500" />
          Node Inspector
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {selection.type === "task"
            ? "Task 详情与 Evaluation Criteria"
            : "Agent 角色、提示词与权限"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {selectedTask ? (
          <CriteriaEditor
            agents={agents}
            expandedCriterionIds={expandedCriterionIds}
            task={selectedTask}
            onAddCriterion={onAddCriterion}
            onCriterionChange={onCriterionChange}
            onCriterionEditEvent={onCriterionEditEvent}
            onDeleteCriterion={onDeleteCriterion}
            onDuplicateCriterion={onDuplicateCriterion}
            onMarkAllPending={onMarkAllPending}
            onMarkRequiredPassed={onMarkRequiredPassed}
            onMoveCriterion={onMoveCriterion}
            onNormalizeWeights={onNormalizeWeights}
            onAcceptedRisk={onAcceptedRisk}
            onApplyRevision={onApplyRevision}
            onCancelRevision={onCancelRevision}
            onCreateFixTask={onCreateFixTask}
            onGenerateRevisionPreview={onGenerateRevisionPreview}
            onReplan={onReplan}
            onResetSuggested={onResetSuggested}
            onTaskChange={onTaskChange}
            onToggleCriterion={onToggleCriterion}
            revisionPreview={revisionPreview}
            revisionText={revisionText}
            onRevisionTextChange={onRevisionTextChange}
          />
        ) : null}

        {selectedAgent ? <AgentInspector agent={selectedAgent} /> : null}
      </div>
    </aside>
  );
}

function AgentInspector({ agent }: { agent: Agent }) {
  return (
    <div className="space-y-4">
      <section className="inspector-section">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-950 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {agent.name}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {agent.role}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <InfoBlock icon={<ShieldCheck className="h-4 w-4" />} label="Persona">
            {agent.persona}
          </InfoBlock>

          <InfoBlock icon={<ClipboardCheck className="h-4 w-4" />} label="Prompt Summary">
            {agent.promptSummary}
          </InfoBlock>

          <InfoBlock icon={<Wrench className="h-4 w-4" />} label="Tool Package">
            <div className="flex flex-wrap gap-1.5">
              {agent.toolPackage.map((tool) => (
                <span
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600"
                  key={tool}
                >
                  {tool}
                </span>
              ))}
            </div>
          </InfoBlock>

          <InfoBlock icon={<ShieldCheck className="h-4 w-4" />} label="Permission Level">
            {agent.permissionLevel}
          </InfoBlock>

          <InfoBlock icon={<Bot className="h-4 w-4" />} label="Skills">
            <div className="flex flex-wrap gap-1.5">
              {agent.skills.map((skill) => (
                <span
                  className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </InfoBlock>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}
