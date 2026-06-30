import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  ListRestart,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { Agent, Criterion, RiskLevel, TaskNode, TaskStatus } from "../types";
import type { RevisionPreview } from "../types";
import {
  calculateTaskProgress,
  criterionMethods,
  criterionPhases,
  criterionStatuses,
  getCriteriaSummary,
  taskStatuses,
} from "../lib/criteria";
import { StatusBadge } from "./StatusBadge";

const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];

interface CriteriaEditorProps {
  task: TaskNode;
  agents: Agent[];
  expandedCriterionIds: string[];
  onToggleCriterion: (criterionId: string) => void;
  onTaskChange: (patch: Partial<TaskNode>, eventDescription?: string) => void;
  onCriterionChange: (
    criterionId: string,
    patch: Partial<Criterion>,
    eventDescription?: string,
  ) => void;
  onCriterionEditEvent: (criterion: Criterion, fieldName: string) => void;
  onAddCriterion: () => void;
  onDeleteCriterion: (criterionId: string) => void;
  onDuplicateCriterion: (criterionId: string) => void;
  onMoveCriterion: (criterionId: string, direction: "up" | "down") => void;
  onNormalizeWeights: () => void;
  onMarkAllPending: () => void;
  onMarkRequiredPassed: () => void;
  onResetSuggested: () => void;
  revisionText: string;
  revisionPreview: RevisionPreview | null;
  onRevisionTextChange: (value: string) => void;
  onGenerateRevisionPreview: () => void;
  onApplyRevision: () => void;
  onCancelRevision: () => void;
  onCreateFixTask: () => void;
  onReplan: () => void;
  onAcceptedRisk: () => void;
}

export function CriteriaEditor({
  task,
  agents,
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
}: CriteriaEditorProps) {
  const summary = getCriteriaSummary(task.criteria);
  const progress = calculateTaskProgress(task.criteria);
  const totalWeight = task.criteria.reduce((sum, item) => sum + item.weight, 0);
  const failedRequired = task.criteria.filter(
    (criterion) => criterion.required && criterion.status === "Failed",
  );

  return (
    <div className="space-y-5">
      <section className="inspector-section">
        <div className="section-heading">Task Details</div>
        <div className="space-y-3">
          <label className="field">
            <span>任务标题</span>
            <input
              className="text-input"
              value={task.title}
              onBlur={() => onTaskChange({}, "更新任务标题")}
              onChange={(event) => onTaskChange({ title: event.target.value })}
            />
          </label>

          <label className="field">
            <span>描述</span>
            <textarea
              className="text-area"
              rows={3}
              value={task.description}
              onBlur={() => onTaskChange({}, "更新任务描述")}
              onChange={(event) =>
                onTaskChange({ description: event.target.value })
              }
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="field">
              <span>负责人 Agent</span>
              <select
                className="select-input"
                value={task.ownerId}
                onChange={(event) =>
                  onTaskChange(
                    { ownerId: event.target.value },
                    "切换任务负责人",
                  )
                }
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>状态</span>
            <select
                className="select-input"
                data-testid="task-status-select"
                value={task.status}
                onChange={(event) =>
                  onTaskChange(
                    {
                      status: event.target.value as TaskStatus,
                      manualStatusOverride: true,
                    },
                    "手动覆盖任务状态",
                  )
                }
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>风险等级</span>
              <select
                className="select-input"
                value={task.risk}
                onChange={(event) =>
                  onTaskChange(
                    { risk: event.target.value as RiskLevel },
                    "更新任务风险等级",
                  )
                }
              >
                {riskLevels.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <span>依赖任务</span>
              <div className="flex min-h-10 flex-wrap gap-1.5 rounded-md border border-slate-200 bg-slate-50 p-2">
                {task.dependencies.length ? (
                  task.dependencies.map((dependency) => (
                    <span
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                      key={dependency}
                    >
                      {dependency}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">无依赖</span>
                )}
              </div>
            </div>

            <label className="field">
              <span>预期输出</span>
              <textarea
                className="text-area"
                rows={3}
                value={task.expectedOutput}
                onBlur={() => onTaskChange({}, "更新预期输出")}
                onChange={(event) =>
                  onTaskChange({ expectedOutput: event.target.value })
                }
              />
            </label>
          </div>

          {task.manualStatusOverride ? (
            <button
              className="mini-button"
              type="button"
              onClick={() =>
                onTaskChange(
                  { manualStatusOverride: false },
                  "恢复 Criteria 自动状态联动",
                )
              }
            >
              恢复 Criteria 自动状态联动
            </button>
          ) : null}
        </div>
      </section>

      <section className="inspector-section">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="section-heading">Evaluation Criteria Editor</div>
            <p className="mt-1 text-xs text-slate-500">
              {summary.text} / 总权重 {totalWeight}%
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge label={task.status} />
            <span className="text-xs font-medium text-slate-500">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            className="mini-button"
            data-testid="add-criterion"
            type="button"
            onClick={onAddCriterion}
          >
            <Plus className="h-3.5 w-3.5" />
            新增评测项
          </button>
          <button
            className="mini-button"
            type="button"
            onClick={onNormalizeWeights}
          >
            <ListRestart className="h-3.5 w-3.5" />
            权重归一化
          </button>
          <button
            className="mini-button"
            type="button"
            onClick={onMarkAllPending}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            全部 Pending
          </button>
          <button
            className="mini-button"
            type="button"
            onClick={onMarkRequiredPassed}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Required 通过
          </button>
          <button
            className="mini-button col-span-2"
            type="button"
            onClick={onResetSuggested}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置为建议标准
          </button>
        </div>

        <div className="space-y-3">
          {task.criteria.map((criterion, index) => {
            const expanded = expandedCriterionIds.includes(criterion.id);

            return (
              <article
                className="rounded-lg border border-slate-200 bg-white shadow-sm"
                key={criterion.id}
              >
                <div className="flex items-start gap-2 border-b border-slate-100 p-3">
                  <button
                    className="mt-0.5 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                    type="button"
                    title={expanded ? "收起" : "展开"}
                    onClick={() => onToggleCriterion(criterion.id)}
                  >
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-950">
                        {criterion.title}
                      </h3>
                      <StatusBadge label={criterion.status} />
                      {criterion.required ? (
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                          Required
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {criterion.passCondition}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      className="square-button"
                      type="button"
                      title="上移"
                      disabled={index === 0}
                      onClick={() => onMoveCriterion(criterion.id, "up")}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="square-button"
                      type="button"
                      title="下移"
                      disabled={index === task.criteria.length - 1}
                      onClick={() => onMoveCriterion(criterion.id, "down")}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="square-button"
                      type="button"
                      title="复制"
                      onClick={() => onDuplicateCriterion(criterion.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="square-button danger"
                      type="button"
                      title="删除"
                      onClick={() => {
                        if (window.confirm("确认删除这条评测标准吗？")) {
                          onDeleteCriterion(criterion.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {expanded ? (
                  <div className="grid gap-3 p-3">
                    <label className="field">
                      <span>title</span>
                      <input
                        className="text-input"
                        value={criterion.title}
                        onBlur={() =>
                          onCriterionEditEvent(criterion, "title")
                        }
                        onChange={(event) =>
                          onCriterionChange(criterion.id, {
                            title: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="field">
                      <span>description</span>
                      <textarea
                        className="text-area"
                        rows={3}
                        value={criterion.description}
                        onBlur={() =>
                          onCriterionEditEvent(criterion, "description")
                        }
                        onChange={(event) =>
                          onCriterionChange(criterion.id, {
                            description: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label className="field">
                      <span>passCondition</span>
                      <textarea
                        className="text-area"
                        rows={2}
                        value={criterion.passCondition}
                        onBlur={() =>
                          onCriterionEditEvent(criterion, "passCondition")
                        }
                        onChange={(event) =>
                          onCriterionChange(criterion.id, {
                            passCondition: event.target.value,
                          })
                        }
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="field">
                        <span>method</span>
                        <select
                          className="select-input"
                          value={criterion.method}
                          onChange={(event) =>
                            onCriterionChange(
                              criterion.id,
                              {
                                method: event.target
                                  .value as Criterion["method"],
                              },
                              "更新 criterion method",
                            )
                          }
                        >
                          {criterionMethods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="field">
                        <span>phase</span>
                        <select
                          className="select-input"
                          value={criterion.phase}
                          onChange={(event) =>
                            onCriterionChange(
                              criterion.id,
                              {
                                phase: event.target.value as Criterion["phase"],
                              },
                              "更新 criterion phase",
                            )
                          }
                        >
                          {criterionPhases.map((phase) => (
                            <option key={phase} value={phase}>
                              {phase}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="field">
                        <span>weight (%)</span>
                        <input
                          className="text-input"
                          min={0}
                          max={100}
                          type="number"
                          value={criterion.weight}
                          onBlur={() =>
                            onCriterionEditEvent(criterion, "weight")
                          }
                          onChange={(event) =>
                            onCriterionChange(criterion.id, {
                              weight: Number(event.target.value),
                            })
                          }
                        />
                      </label>

                      <label className="field">
                        <span>status</span>
                        <select
                          className="select-input"
                          data-testid={`criterion-status-${criterion.id}`}
                          value={criterion.status}
                          onChange={(event) =>
                            onCriterionChange(
                              criterion.id,
                              {
                                status: event.target
                                  .value as Criterion["status"],
                              },
                              "更新 criterion status",
                            )
                          }
                        >
                          {criterionStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                      <span className="font-medium text-slate-700">
                        required
                      </span>
                      <input
                        checked={criterion.required}
                        className="h-4 w-4 accent-slate-950"
                        type="checkbox"
                        onChange={(event) =>
                          onCriterionChange(
                            criterion.id,
                            { required: event.target.checked },
                            "切换 criterion required",
                          )
                        }
                      />
                    </label>

                    <label className="field">
                      <span>evidence</span>
                      <textarea
                        className="text-area"
                        rows={3}
                        value={criterion.evidence}
                        onBlur={() =>
                          onCriterionEditEvent(criterion, "evidence")
                        }
                        onChange={(event) =>
                          onCriterionChange(criterion.id, {
                            evidence: event.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      {failedRequired.length > 0 ? (
        <section className="inspector-section border-rose-200 bg-rose-50/60">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="section-heading text-rose-950">
                Failure Summary
              </div>
              <p className="mt-1 text-xs leading-5 text-rose-700">
                {failedRequired.length} 条 required criterion 失败。主要原因：
                {failedRequired[0].title}
              </p>
            </div>
            <StatusBadge label="Failed" />
          </div>

          <div className="rounded-md border border-rose-200 bg-white p-3 text-xs leading-5 text-slate-700">
            建议先创建修复任务交给 Debugger Agent，或请求 Planner 基于失败标准重规划。
            若失败项已被产品接受，可以标记为可接受风险。
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              className="mini-button"
              data-testid="create-fix-task"
              type="button"
              onClick={onCreateFixTask}
            >
              创建修复任务
            </button>
            <button
              className="mini-button"
              data-testid="mock-replan"
              type="button"
              onClick={onReplan}
            >
              请求重规划
            </button>
            <button
              className="mini-button"
              data-testid="accepted-risk"
              type="button"
              onClick={onAcceptedRisk}
            >
              接受风险
            </button>
          </div>
        </section>
      ) : null}

      <section className="inspector-section">
        <div className="section-heading">使用自然语言修订评测标准</div>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Generate Preview 只生成草稿；只有 Apply Changes 会修改 Criteria。
        </p>

        <textarea
          className="text-area mt-3"
          data-testid="revision-textarea"
          placeholder="例如：增加一个移动端适配的验收标准，要求 iPhone 屏幕下不横向溢出，权重 15%，并设为必须通过。"
          rows={4}
          value={revisionText}
          onChange={(event) => onRevisionTextChange(event.target.value)}
        />

        <div className="mt-3 flex gap-2">
          <button
            className="mini-button"
            data-testid="generate-preview"
            disabled={!revisionText.trim()}
            type="button"
            onClick={onGenerateRevisionPreview}
          >
            Generate Preview
          </button>
          <button
            className="mini-button"
            data-testid="cancel-preview"
            disabled={!revisionPreview}
            type="button"
            onClick={onCancelRevision}
          >
            取消
          </button>
        </div>

        {revisionPreview ? (
          <div
            className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3"
            data-testid="revision-preview"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="rounded-md border border-blue-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700">
                Change Type: {revisionPreview.changeType}
              </span>
              <button
                className="mini-button"
                data-testid="apply-preview"
                type="button"
                onClick={onApplyRevision}
              >
                Apply Changes
              </button>
            </div>
            <p className="text-xs leading-5 text-slate-700">
              {revisionPreview.summary}
            </p>

            {revisionPreview.draftCriterion ? (
              <div className="mt-3 rounded-md border border-blue-100 bg-white p-3 text-xs leading-5 text-slate-700">
                <div className="font-semibold text-slate-950">
                  Draft: {revisionPreview.draftCriterion.title}
                </div>
                <div>{revisionPreview.draftCriterion.passCondition}</div>
                <div className="mt-1 text-slate-500">
                  Method {revisionPreview.draftCriterion.method} / Weight{" "}
                  {revisionPreview.draftCriterion.weight}% / Required{" "}
                  {revisionPreview.draftCriterion.required ? "true" : "false"}
                </div>
              </div>
            ) : null}

            {revisionPreview.targetTitle ? (
              <div className="mt-3 rounded-md border border-blue-100 bg-white p-3 text-xs text-slate-700">
                Target: {revisionPreview.targetTitle}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
