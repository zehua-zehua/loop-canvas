export type TaskStatus =
  | "Todo"
  | "In Progress"
  | "Passed"
  | "Failed"
  | "Needs Review"
  | "Blocked";

export type RiskLevel = "Low" | "Medium" | "High";

export type CriterionStatus =
  | "Pending"
  | "Passed"
  | "Failed"
  | "Needs Review";

export type CriterionMethod =
  | "Manual UI Check"
  | "Automated Test"
  | "Browser Interaction"
  | "Visual Review"
  | "LLM Review"
  | "Build Check";

export type CriterionPhase =
  | "Before Implementation"
  | "During Implementation"
  | "After Implementation"
  | "Before Final Acceptance";

export type Selection =
  | { type: "task"; id: string }
  | { type: "agent"; id: string };

export interface Goal {
  title: string;
  description: string;
  definitionOfDone: string;
  version: string;
  phase: string;
  progress: number;
  status: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  skills: string[];
  persona: string;
  activeTasks: number;
  promptSummary: string;
  toolPackage: string[];
  permissionLevel: string;
}

export interface Criterion {
  id: string;
  title: string;
  description: string;
  method: CriterionMethod;
  passCondition: string;
  weight: number;
  phase: CriterionPhase;
  required: boolean;
  status: CriterionStatus;
  evidence: string;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  status: TaskStatus;
  risk: RiskLevel;
  dependencies: string[];
  expectedOutput: string;
  criteria: Criterion[];
  manualStatusOverride?: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  type: string;
  description: string;
  relatedNode: string;
}

export interface WorkspaceState {
  goal: Goal;
  agents: Agent[];
  tasks: TaskNode[];
  timeline: TimelineEvent[];
}

export type CriterionDraft = Omit<Criterion, "id">;

export type RevisionChangeType = "Add" | "Update" | "Delete" | "Ambiguous";

export interface RevisionPreview {
  changeType: RevisionChangeType;
  summary: string;
  draftCriterion?: Criterion;
  targetCriterionId?: string;
  targetTitle?: string;
  requestedWeight?: number;
}
