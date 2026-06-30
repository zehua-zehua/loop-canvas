import { useEffect, useMemo, useState } from "react";
import { AgentPanel } from "./components/AgentPanel";
import { GoalBar } from "./components/GoalBar";
import { Inspector } from "./components/Inspector";
import { TaskCanvas } from "./components/TaskCanvas";
import { Timeline } from "./components/Timeline";
import { initialWorkspace, mockTasks } from "./data/mockData";
import {
  createCriterion,
  createTimelineEvent,
  normalizeWeights,
  updateTaskCriteria,
} from "./lib/criteria";
import type {
  Criterion,
  RevisionPreview,
  Selection,
  TaskNode,
  WorkspaceState,
} from "./types";

const STORAGE_KEY = "loop-canvas.workspace.v2";

const loadWorkspace = (): WorkspaceState => {
  try {
    if (new URLSearchParams(window.location.search).get("reset") === "1") {
      window.localStorage.removeItem(STORAGE_KEY);
      return initialWorkspace;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialWorkspace;
    const parsed = JSON.parse(saved) as WorkspaceState;
    if (!parsed.goal || !Array.isArray(parsed.tasks)) return initialWorkspace;
    return parsed;
  } catch {
    return initialWorkspace;
  }
};

function App() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadWorkspace);
  const [selection, setSelection] = useState<Selection>({
    type: "task",
    id: "task-criteria",
  });
  const [expandedCriterionIds, setExpandedCriterionIds] = useState<string[]>([
    "criteria-1",
  ]);
  const [revisionText, setRevisionText] = useState("");
  const [revisionPreview, setRevisionPreview] =
    useState<RevisionPreview | null>(null);

  const selectedTaskId = selection.type === "task" ? selection.id : undefined;

  const taskById = useMemo(
    () => new Map(workspace.tasks.map((task) => [task.id, task])),
    [workspace.tasks],
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  }, [workspace]);

  const addEvent = (
    state: WorkspaceState,
    actor: string,
    type: string,
    description: string,
    relatedNode: string,
  ): WorkspaceState => ({
    ...state,
    timeline: [
      ...state.timeline,
      createTimelineEvent(actor, type, description, relatedNode),
    ],
  });

  const updateSelectedTask = (
    updater: (task: TaskNode) => TaskNode,
    event?: {
      actor: string;
      type: string;
      description: string;
      relatedNode?: string;
    },
  ) => {
    if (!selectedTaskId) return;

    setWorkspace((current) => {
      let updatedTask: TaskNode | undefined;
      const tasks = current.tasks.map((task) => {
        if (task.id !== selectedTaskId) return task;
        updatedTask = updater(task);
        return updatedTask;
      });

      const next = { ...current, tasks };
      if (!event || !updatedTask) return next;

      return addEvent(
        next,
        event.actor,
        event.type,
        event.description,
        event.relatedNode ?? updatedTask.title,
      );
    });
  };

  const handleTaskChange = (
    patch: Partial<TaskNode>,
    eventDescription?: string,
  ) => {
    updateSelectedTask(
      (task) => ({ ...task, ...patch }),
      eventDescription
        ? {
            actor: "User",
            type: patch.status ? "Status" : "Task",
            description: eventDescription,
          }
        : undefined,
    );
  };

  const handleCriterionChange = (
    criterionId: string,
    patch: Partial<Criterion>,
    eventDescription?: string,
  ) => {
    updateSelectedTask(
      (task) => {
        const criteria = task.criteria.map((criterion) =>
          criterion.id === criterionId ? { ...criterion, ...patch } : criterion,
        );

        return updateTaskCriteria(
          { ...task, manualStatusOverride: patch.status ? false : task.manualStatusOverride },
          criteria,
        );
      },
      eventDescription
        ? {
            actor: "User",
            type: patch.status ? "Status" : "Criteria",
            description: eventDescription,
          }
        : undefined,
    );
  };

  const handleCriterionEditEvent = (
    criterion: Criterion,
    fieldName: string,
  ) => {
    updateSelectedTask(
      (task) => task,
      {
        actor: "User",
        type: "Criteria",
        description: `更新 criterion ${fieldName}: ${criterion.title}`,
      },
    );
  };

  const handleAddCriterion = () => {
    const nextCriterion = createCriterion();
    updateSelectedTask(
      (task) => updateTaskCriteria(task, [...task.criteria, nextCriterion]),
      {
        actor: "User",
        type: "Criteria",
        description: `新增 criterion: ${nextCriterion.title}`,
      },
    );
    setExpandedCriterionIds((current) => [...current, nextCriterion.id]);
  };

  const handleDeleteCriterion = (criterionId: string) => {
    const criterion = taskById
      .get(selectedTaskId ?? "")
      ?.criteria.find((item) => item.id === criterionId);

    updateSelectedTask(
      (task) =>
        updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          task.criteria.filter((item) => item.id !== criterionId),
        ),
      {
        actor: "User",
        type: "Criteria",
        description: `删除 criterion: ${criterion?.title ?? criterionId}`,
      },
    );
    setExpandedCriterionIds((current) =>
      current.filter((id) => id !== criterionId),
    );
  };

  const handleDuplicateCriterion = (criterionId: string) => {
    const source = taskById
      .get(selectedTaskId ?? "")
      ?.criteria.find((item) => item.id === criterionId);
    if (!source) return;

    const duplicated = {
      ...source,
      id: `criterion-${crypto.randomUUID()}`,
      title: `${source.title} Copy`,
      status: "Pending" as const,
      evidence: "",
    };

    updateSelectedTask(
      (task) => {
        const sourceIndex = task.criteria.findIndex(
          (item) => item.id === criterionId,
        );
        const criteria = [...task.criteria];
        criteria.splice(sourceIndex + 1, 0, duplicated);
        return updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          criteria,
        );
      },
      {
        actor: "User",
        type: "Criteria",
        description: `复制 criterion: ${source.title}`,
      },
    );
    setExpandedCriterionIds((current) => [...current, duplicated.id]);
  };

  const handleMoveCriterion = (
    criterionId: string,
    direction: "up" | "down",
  ) => {
    updateSelectedTask(
      (task) => {
        const currentIndex = task.criteria.findIndex(
          (item) => item.id === criterionId,
        );
        const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= task.criteria.length) {
          return task;
        }

        const criteria = [...task.criteria];
        const [moved] = criteria.splice(currentIndex, 1);
        criteria.splice(nextIndex, 0, moved);
        return updateTaskCriteria(task, criteria);
      },
      {
        actor: "User",
        type: "Criteria",
        description: `调整 criterion 顺序: ${direction === "up" ? "上移" : "下移"}`,
      },
    );
  };

  const handleNormalizeWeights = () => {
    updateSelectedTask(
      (task) => updateTaskCriteria(task, normalizeWeights(task.criteria)),
      {
        actor: "User",
        type: "Criteria",
        description: "Normalize Weights，使总权重为 100%",
      },
    );
  };

  const handleMarkAllPending = () => {
    updateSelectedTask(
      (task) =>
        updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          task.criteria.map((criterion) => ({
            ...criterion,
            status: "Pending",
          })),
        ),
      {
        actor: "User",
        type: "Status",
        description: "将所有 criteria 标记为 Pending",
      },
    );
  };

  const handleMarkRequiredPassed = () => {
    updateSelectedTask(
      (task) =>
        updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          task.criteria.map((criterion) =>
            criterion.required ? { ...criterion, status: "Passed" } : criterion,
          ),
        ),
      {
        actor: "User",
        type: "Status",
        description: "将所有 Required criteria 标记为 Passed",
      },
    );
  };

  const handleResetSuggested = () => {
    const seedTask = mockTasks.find((task) => task.id === selectedTaskId);
    if (!seedTask) return;

    updateSelectedTask(
      (task) =>
        updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          seedTask.criteria.map((criterion) => ({ ...criterion })),
        ),
      {
        actor: "User",
        type: "Criteria",
        description: "重置为建议标准",
      },
    );
    setExpandedCriterionIds(
      seedTask.criteria[0] ? [seedTask.criteria[0].id] : [],
    );
  };

  const buildRevisionPreview = () => {
    const task = selectedTaskId ? taskById.get(selectedTaskId) : undefined;
    const request = revisionText.trim();
    if (!task || !request) return;

    const lower = request.toLowerCase();
    const parsedWeight = request.match(/(\d{1,3})\s*%?/)?.[1];
    const requestedWeight = parsedWeight
      ? Math.min(100, Math.max(1, Number(parsedWeight)))
      : 15;

    if (lower.includes("delete") || request.includes("删除")) {
      const target = task.criteria[task.criteria.length - 1];
      setRevisionPreview({
        changeType: "Delete",
        summary: `将删除当前任务中的「${target.title}」。Apply 前不会修改数据。`,
        targetCriterionId: target.id,
        targetTitle: target.title,
      });
      return;
    }

    const mobileIntent =
      request.includes("移动端") ||
      request.includes("iPhone") ||
      lower.includes("mobile");
    const isAddRequest = lower.includes("add") || request.includes("增加");

    if (isAddRequest || (!lower.includes("weight") && !request.includes("权重"))) {
      const draftCriterion = createCriterion({
        title: mobileIntent ? "移动端适配验收" : "自然语言新增评测项",
        description: request,
        method: mobileIntent ? "Browser Interaction" : "Manual UI Check",
        passCondition: mobileIntent
          ? "在 iPhone 尺寸下页面无横向溢出，主要控件可点击且文本不重叠。"
          : "用户可以根据该自然语言要求完成清晰验收。",
        weight: requestedWeight,
        phase: "Before Final Acceptance",
        required: request.includes("必须") || lower.includes("required"),
        status: "Pending",
        evidence: "由自然语言修订预览生成，等待应用。",
      });

      setRevisionPreview({
        changeType: isAddRequest ? "Add" : "Ambiguous",
        summary: isAddRequest
          ? `将新增 criterion「${draftCriterion.title}」，权重 ${draftCriterion.weight}%。`
          : `无法明确解析操作类型，将作为新增 criterion 草稿处理。`,
        draftCriterion,
        requestedWeight,
      });
      return;
    }

    const target = task.criteria[0];
    setRevisionPreview({
      changeType: "Update",
      summary: `将「${target.title}」权重调整为 ${requestedWeight}%，其余标准重新均分剩余权重。`,
      targetCriterionId: target.id,
      targetTitle: target.title,
      requestedWeight,
    });
  };

  const applyRevisionPreview = () => {
    if (!revisionPreview || !selectedTaskId) return;

    updateSelectedTask(
      (task) => {
        if (
          revisionPreview.changeType === "Add" ||
          revisionPreview.changeType === "Ambiguous"
        ) {
          if (!revisionPreview.draftCriterion) return task;
          return updateTaskCriteria(
            { ...task, manualStatusOverride: false },
            [...task.criteria, revisionPreview.draftCriterion],
          );
        }

        if (revisionPreview.changeType === "Delete") {
          return updateTaskCriteria(
            { ...task, manualStatusOverride: false },
            task.criteria.filter(
              (criterion) => criterion.id !== revisionPreview.targetCriterionId,
            ),
          );
        }

        const targetWeight = revisionPreview.requestedWeight ?? 15;
        const remaining = Math.max(0, 100 - targetWeight);
        const otherCriteria = task.criteria.filter(
          (criterion) => criterion.id !== revisionPreview.targetCriterionId,
        );
        const base =
          otherCriteria.length > 0 ? Math.floor(remaining / otherCriteria.length) : 0;
        let remainder =
          otherCriteria.length > 0 ? remaining - base * otherCriteria.length : 0;
        const criteria = task.criteria.map((criterion) => {
          if (criterion.id === revisionPreview.targetCriterionId) {
            return { ...criterion, weight: targetWeight };
          }
          const bump = remainder > 0 ? 1 : 0;
          remainder -= bump;
          return { ...criterion, weight: base + bump };
        });

        return updateTaskCriteria(
          { ...task, manualStatusOverride: false },
          criteria,
        );
      },
      {
        actor: "User",
        type: "Natural Language",
        description: `应用自然语言修订: ${revisionPreview.changeType} - ${revisionPreview.summary}`,
      },
    );

    if (revisionPreview.draftCriterion) {
      setExpandedCriterionIds((current) => [
        ...current,
        revisionPreview.draftCriterion!.id,
      ]);
    }
    setRevisionPreview(null);
    setRevisionText("");
  };

  const handleCreateFixTask = () => {
    const sourceTask = selectedTaskId ? taskById.get(selectedTaskId) : undefined;
    const debuggerAgent = workspace.agents.find((agent) => agent.id === "debugger");
    if (!sourceTask || !debuggerAgent) return;

    const failedRequired = sourceTask.criteria.filter(
      (criterion) => criterion.required && criterion.status === "Failed",
    );
    const fixTaskId = `task-fix-${crypto.randomUUID().slice(0, 8)}`;
    const fixTask: TaskNode = {
      id: fixTaskId,
      title: `Fix failed criteria for ${sourceTask.title}`,
      description: `根据失败评测项生成修复任务：${failedRequired
        .map((criterion) => criterion.title)
        .join("、") || "待补充失败项"}。`,
      ownerId: debuggerAgent.id,
      status: "Todo",
      risk: "Medium",
      dependencies: [sourceTask.id],
      expectedOutput:
        "定位失败原因，提出最小修复方案，并更新对应 Evaluation Criteria 的 evidence。",
      criteria: [
        createCriterion({
          title: "复现失败条件",
          description: "明确失败 criterion 的触发条件、当前表现和期望表现。",
          method: "Manual UI Check",
          passCondition: "失败路径可稳定复现，且证据记录完整。",
          weight: 35,
          phase: "Before Implementation",
          required: true,
        }),
        createCriterion({
          title: "提出最小修复方案",
          description: "修复计划应聚焦失败标准，不扩大任务范围。",
          method: "LLM Review",
          passCondition: "修复方案说明改动范围、风险和验证方式。",
          weight: 35,
          phase: "During Implementation",
          required: true,
        }),
        createCriterion({
          title: "回归验证原任务",
          description: "修复完成后回到原任务，更新失败 criterion 的 status 与 evidence。",
          method: "Browser Interaction",
          passCondition: "原失败项通过，Timeline 可追踪修复闭环。",
          weight: 30,
          phase: "Before Final Acceptance",
          required: true,
        }),
      ],
    };

    setWorkspace((current) => {
      const sourceIndex = current.tasks.findIndex(
        (task) => task.id === sourceTask.id,
      );
      const tasks = [...current.tasks];
      tasks.splice(sourceIndex + 1, 0, fixTask);
      return addEvent(
        { ...current, tasks },
        "User",
        "Fix Task",
        `创建修复任务: ${fixTask.title}`,
        sourceTask.title,
      );
    });
    setSelection({ type: "task", id: fixTaskId });
    setExpandedCriterionIds([fixTask.criteria[0].id]);
  };

  const handleReplan = () => {
    setWorkspace((current) =>
      addEvent(
        {
          ...current,
          goal: { ...current.goal, phase: "重规划" },
        },
        "Planner Agent",
        "Replan",
        "Mock replan requested: Planner 将基于失败 criteria 调整后续任务顺序。",
        selectedTaskId ? taskById.get(selectedTaskId)?.title ?? "Goal" : "Goal",
      ),
    );
  };

  const handleAcceptedRisk = () => {
    updateSelectedTask(
      (task) => {
        const criteria = task.criteria.map((criterion) =>
          criterion.required && criterion.status === "Failed"
            ? {
                ...criterion,
                required: false,
                status: "Needs Review" as const,
                evidence: `${criterion.evidence ? `${criterion.evidence}\n` : ""}Accepted Risk: 用户已标记为可接受风险。`,
              }
            : criterion,
        );

        return {
          ...updateTaskCriteria(task, criteria),
          status: "Needs Review",
          manualStatusOverride: true,
        };
      },
      {
        actor: "User",
        type: "Risk",
        description: "将失败 required criterion 标记为可接受风险",
      },
    );
  };

  const handleExportJson = () => {
    setWorkspace((current) => {
      const event = createTimelineEvent(
        "User",
        "Export JSON",
        "导出当前 Loop Canvas workspace JSON",
        "Workspace",
      );
      const stateWithEvent = {
        ...current,
        timeline: [...current.timeline, event],
      };
      const blob = new Blob([JSON.stringify(stateWithEvent, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "loop-canvas-workspace.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      return stateWithEvent;
    });
  };

  const handleSelectTask = (taskId: string) => {
    setSelection({ type: "task", id: taskId });
    const task = taskById.get(taskId);
    setExpandedCriterionIds(task?.criteria[0] ? [task.criteria[0].id] : []);
    setRevisionPreview(null);
    setRevisionText("");
  };

  const handleSelectAgent = (agentId: string) => {
    setSelection({ type: "agent", id: agentId });
    setRevisionPreview(null);
    setRevisionText("");
  };

  const handleToggleCriterion = (criterionId: string) => {
    setExpandedCriterionIds((current) =>
      current.includes(criterionId)
        ? current.filter((id) => id !== criterionId)
        : [...current, criterionId],
    );
  };

  return (
    <div className="app-shell flex h-screen min-h-[760px] flex-col overflow-hidden bg-canvas text-slate-950">
      <GoalBar
        goal={workspace.goal}
        onExport={handleExportJson}
        onReplan={handleReplan}
      />
      <div className="workbench-body flex min-h-0 flex-1">
        <AgentPanel
          agents={workspace.agents}
          selection={selection}
          onSelectAgent={handleSelectAgent}
        />
        <TaskCanvas
          agents={workspace.agents}
          selection={selection}
          tasks={workspace.tasks}
          onSelectTask={handleSelectTask}
        />
        <Inspector
          agents={workspace.agents}
          expandedCriterionIds={expandedCriterionIds}
          selection={selection}
          tasks={workspace.tasks}
          onAddCriterion={handleAddCriterion}
          onCriterionChange={handleCriterionChange}
          onCriterionEditEvent={handleCriterionEditEvent}
          onDeleteCriterion={handleDeleteCriterion}
          onDuplicateCriterion={handleDuplicateCriterion}
          onMarkAllPending={handleMarkAllPending}
          onMarkRequiredPassed={handleMarkRequiredPassed}
          onMoveCriterion={handleMoveCriterion}
          onNormalizeWeights={handleNormalizeWeights}
          onAcceptedRisk={handleAcceptedRisk}
          onApplyRevision={applyRevisionPreview}
          onCancelRevision={() => setRevisionPreview(null)}
          onCreateFixTask={handleCreateFixTask}
          onGenerateRevisionPreview={buildRevisionPreview}
          onReplan={handleReplan}
          onResetSuggested={handleResetSuggested}
          onTaskChange={handleTaskChange}
          onToggleCriterion={handleToggleCriterion}
          revisionPreview={revisionPreview}
          revisionText={revisionText}
          onRevisionTextChange={setRevisionText}
        />
      </div>
      <Timeline events={workspace.timeline} />
    </div>
  );
}

export default App;
