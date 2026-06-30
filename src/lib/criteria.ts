import type {
  Criterion,
  CriterionDraft,
  TaskNode,
  TaskStatus,
  TimelineEvent,
} from "../types";

export const taskStatuses: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Passed",
  "Failed",
  "Needs Review",
  "Blocked",
];

export const criterionStatuses: Criterion["status"][] = [
  "Pending",
  "Passed",
  "Failed",
  "Needs Review",
];

export const criterionMethods: Criterion["method"][] = [
  "Manual UI Check",
  "Automated Test",
  "Browser Interaction",
  "Visual Review",
  "LLM Review",
  "Build Check",
];

export const criterionPhases: Criterion["phase"][] = [
  "Before Implementation",
  "During Implementation",
  "After Implementation",
  "Before Final Acceptance",
];

export const calculateTaskProgress = (criteria: Criterion[]) => {
  if (criteria.length === 0) return 0;

  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0) || 1;
  const passedWeight = criteria.reduce(
    (sum, item) => sum + (item.status === "Passed" ? item.weight : 0),
    0,
  );

  return Math.round((passedWeight / totalWeight) * 100);
};

export const getCriteriaSummary = (criteria: Criterion[]) => {
  const passed = criteria.filter((item) => item.status === "Passed").length;
  const failed = criteria.filter((item) => item.status === "Failed").length;
  const pending = criteria.filter((item) => item.status === "Pending").length;
  const review = criteria.filter(
    (item) => item.status === "Needs Review",
  ).length;

  return {
    total: criteria.length,
    passed,
    failed,
    pending,
    review,
    text: `${criteria.length} 条标准 / ${passed} 通过 / ${failed} 失败 / ${pending} 待评测`,
  };
};

export const deriveTaskStatus = (
  criteria: Criterion[],
  currentStatus: TaskStatus,
): TaskStatus => {
  if (criteria.length === 0) return currentStatus;

  const requiredCriteria = criteria.filter((item) => item.required);
  const hasFailedRequired = requiredCriteria.some(
    (item) => item.status === "Failed",
  );
  const hasReviewRequired = requiredCriteria.some(
    (item) => item.status === "Needs Review",
  );
  const allRequiredPassed =
    requiredCriteria.length > 0 &&
    requiredCriteria.every((item) => item.status === "Passed");
  const hasPending = criteria.some((item) => item.status === "Pending");

  if (hasFailedRequired) return "Failed";
  if (hasReviewRequired) return "Needs Review";
  if (allRequiredPassed) return "Passed";
  if (currentStatus === "Todo" && hasPending) return "Todo";
  return "In Progress";
};

export const normalizeWeights = (criteria: Criterion[]) => {
  if (criteria.length === 0) return criteria;

  const base = Math.floor(100 / criteria.length);
  let remainder = 100 - base * criteria.length;

  return criteria.map((item) => {
    const bump = remainder > 0 ? 1 : 0;
    remainder -= bump;
    return { ...item, weight: base + bump };
  });
};

export const buildCriterionDraft = (): CriterionDraft => ({
  title: "新增评测项",
  description: "描述该标准要验证的具体行为、边界或质量要求。",
  method: "Manual UI Check",
  passCondition: "用户可以清楚验证该标准，并且结果符合预期。",
  weight: 10,
  phase: "After Implementation",
  required: true,
  status: "Pending",
  evidence: "",
});

export const createCriterion = (seed?: Partial<CriterionDraft>): Criterion => ({
  id: `criterion-${crypto.randomUUID()}`,
  ...buildCriterionDraft(),
  ...seed,
});

export const updateTaskCriteria = (
  task: TaskNode,
  criteria: Criterion[],
): TaskNode => {
  const nextStatus = task.manualStatusOverride
    ? task.status
    : deriveTaskStatus(criteria, task.status);

  return {
    ...task,
    criteria,
    status: nextStatus,
  };
};

export const createTimelineEvent = (
  actor: string,
  type: string,
  description: string,
  relatedNode: string,
): TimelineEvent => ({
  id: `event-${crypto.randomUUID()}`,
  timestamp: new Date().toISOString(),
  actor,
  type,
  description,
  relatedNode,
});
