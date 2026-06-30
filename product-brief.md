# Loop Canvas MVP Product Brief

## Overview

Loop Canvas is a lightweight frontend MVP for vibecoding agents. It provides a visual loop control workspace for managing the full flow from Goal to Task, Agent, Evaluation Criteria, Execution Status, Failure, and Replan.

This MVP is intentionally frontend-only. It does not connect to a real backend, real Codex API, or database. The product should be implemented with mock data and local state so we can validate the core interaction model first.

## Product Goal

The MVP exists to verify that users can:

1. See the highest-level Goal clearly.
2. See how the Goal is decomposed into Tasks.
3. See which Agent owns each Task.
4. Inspect and edit fine-grained Evaluation Criteria for each Task.
5. Add, delete, modify, reorder, and change the status and weight of each Evaluation Criterion.
6. Use natural language to propose criteria revisions, preview the change, and apply it explicitly.
7. Create fix tasks or trigger mock replan when a task fails evaluation.
8. Track Goal, Task, Criteria, Evaluation, and Replan changes in a bottom Timeline.

The most important part of the product is the task-level evaluation criteria editor.

## Technical Requirements

- Use React.
- Use TypeScript.
- Use Tailwind CSS.
- Use shadcn/ui-style components where possible.
- Use lucide-react icons.
- Use local front-end state management.
- Optionally persist the workspace state in localStorage.
- No real backend.
- No database.
- No authentication.
- No real LLM API calls.

If the current project already has a stack, keep it. If the project is empty, use the stack above.

For task graph display, React Flow or a similar approach is acceptable. If that is inconvenient, a custom vertical task flow with cards and connectors is fine.

## Visual Direction

The design should feel close to Codex, Linear, and Vercel:

- Professional
- Clean
- Slightly futuristic
- Restrained
- Not playful
- Not game-like

Style guidance:

- Neutral colors with small accent colors such as blue, green, and orange.
- System sans-serif typography such as Inter or system-ui.
- Moderate corner radius, around 8px.
- Light shadows only.
- Thin, low-contrast borders.
- Balanced density and whitespace.
- Light theme only is acceptable.

## Page Layout

The workspace is a single-page application with five main regions:

1. Top Goal Bar
2. Left Agent Panel
3. Center Loop Canvas / Task Graph
4. Right Node Inspector
5. Bottom Timeline / Trace Log

Recommended proportions:

- Left panel: about 260px wide.
- Center area: fluid width.
- Right inspector: about 420px wide.
- Bottom timeline: about 180px tall.

## Top Goal Bar

The Goal Bar should show:

- Goal Title
- Goal Description
- Version, for example `v1.2`
- Current phase, such as planning, executing, evaluating, or replanning
- Progress percentage
- Current status
- Actions:
  - Edit Goal
  - Replan Tasks
  - Run Evaluation
  - Export JSON

Mock goal content:

- Title: `Build a feedback-driven Loopi homepage evolution MVP`
- Description: `Create a lightweight homepage feedback system where users can rate Loopi candidate images, and the system can use evaluation criteria to guide future iteration.`
- Definition of Done: `The MVP should allow users to view tasks, inspect agents, edit evaluation criteria, simulate evaluation results, and create fix tasks when criteria fail.`

## Left Agent Panel

Display 4 mock agents:

1. Planner Agent
   - Role: Task decomposition and replanning
   - Skills: Task Graph, Scope Control, Dependency Planning
   - Persona: Structured, cautious, product-minded
   - Active Tasks: 2
2. Builder Agent
   - Role: Frontend implementation
   - Skills: React, UI Components, State Management
   - Persona: Efficient, pragmatic, execution-oriented
   - Active Tasks: 3
3. Evaluator Agent
   - Role: Evaluation criteria design and acceptance
   - Skills: Rubric Design, UI Review, Test Case Design
   - Persona: Strict, detailed, skeptical
   - Active Tasks: 4
4. Debugger Agent
   - Role: Issue diagnosis and fix suggestions
   - Skills: Log Analysis, Root Cause Analysis, Patch Planning
   - Persona: Calm, analytical, diagnosis-driven
   - Active Tasks: 1

Each agent card should show:

- Agent name
- Role
- Skill tags
- Persona
- Active task count

Clicking an agent card should switch the right inspector to Agent details, including:

- Prompt Summary
- Tool Package
- Permission Level

## Center Task Graph

Use a vertical task flow for the MVP if needed.

Mock tasks:

1. Define Loop Canvas information architecture
   - Description: Organize the core information structure of Loop Canvas, including Goal, Task, Agent, Criteria, Timeline, and data flow.
   - Owner: Planner Agent
   - Status: Passed
   - Risk: Low
2. Build task graph layout
   - Description: Implement the task flow display in the center canvas, including task cards, status tags, progress bars, and basic node selection interaction.
   - Owner: Builder Agent
   - Status: In Progress
   - Risk: Medium
3. Create evaluation criteria editor
   - Description: Implement the task-level evaluation criteria editor with field-level editing, sorting, duplication, deletion, and status updates.
   - Owner: Evaluator Agent
   - Status: In Progress
   - Risk: Medium
4. Add natural language revision box
   - Description: Add a natural language revision area below the criteria editor and implement mock parsing plus preview logic.
   - Owner: Evaluator Agent
   - Status: Todo
   - Risk: Medium
5. Implement timeline and replan events
   - Description: Implement the bottom Timeline event stream and support recording task edits, evaluation changes, and replanning events.
   - Owner: Planner Agent
   - Status: Todo
   - Risk: Low
6. Test MVP acceptance flow
   - Description: Simulate the complete task execution and evaluation flow, including failure scenarios, fix task generation, and final acceptance.
   - Owner: Evaluator Agent
   - Status: Todo
   - Risk: High

Each task card should show:

- Task title
- Owner agent
- Status tag
- Risk tag
- Criteria summary, for example `5 criteria / 3 passed / 1 failed / 1 pending`
- Progress bar

Task state rules:

- If all required criteria pass, the task can become Passed.
- If any required criterion fails, the task becomes Failed or Needs Review.
- If there are still pending criteria, the task remains In Progress or Todo.
- Manual override of task status is allowed.

## Right Inspector

When a task is selected, show:

### Task Details

- Task Title
- Description
- Owner Agent
- Status
- Risk Level
- Dependent Tasks
- Expected Output

### Evaluation Criteria Editor

Each task should have 3 to 6 evaluation criteria.

Criterion fields:

- id
- title
- description
- method
- passCondition
- weight
- phase
- required
- status
- evidence

Supported method values:

- Manual UI Check
- Automated Test
- Browser Interaction
- Visual Review
- LLM Review
- Build Check

Supported phase values:

- Before Implementation
- During Implementation
- After Implementation
- Before Final Acceptance

Supported status values:

- Pending
- Passed
- Failed
- Needs Review

Each criterion card should support:

- Expand / collapse
- Field-level editing
- Required toggle
- Status change
- Evidence input
- Duplicate
- Delete
- Move Up / Move Down

Criteria editor actions:

- Add Criterion
- Normalize Weights
- Mark All Pending
- Mark All Required Passed
- Reset to Suggested Standards

Normalize Weights should rebalance all criterion weights so the total equals 100%.

### Natural Language Revision

This area should let users revise criteria through plain language.

Example placeholder:

`例如：增加一个移动端适配的验收标准，要求 iPhone 屏幕下不横向溢出，权重 15%，并设为必须通过。`

Mock parsing rules:

- If the input includes add or 增加, generate a new criterion draft.
- If it includes delete or 删除, generate a deletion preview.
- If it includes weight or 权重, generate a weight adjustment preview.
- If parsing fails, treat the input as a new criterion draft.

Preview should show:

- Change Type
- Summary
- Draft Content
- Apply Changes button
- Cancel button

Applying changes should update the current task criteria and write a Timeline event.

## Failure and Replan

If a task has a failed required criterion, the inspector should show a Failure Summary with:

- Number of failed criteria
- Main failure reason
- Suggested next action

Actions:

- Create Fix Task
- Ask Planner to Replan
- Mark as Accepted Risk

Create Fix Task should insert a new task after the current one with:

- Owner: Debugger Agent
- Status: Todo
- Risk: Medium

This action should also write to the Timeline.

## Bottom Timeline

The Timeline should record:

- Time stamp
- Actor
- Type
- Description
- Related node

It should log:

- Criterion add, delete, and update
- Status changes
- Natural language revisions
- Fix task creation
- Replan triggers
- JSON export

## Mock Data Requirements

Each task should have 3 to 6 criteria with realistic product-development detail.

Example for `Create evaluation criteria editor`:

1. Support field-level editing
   - Method: Manual UI Check
   - Pass Condition: All fields can be edited without errors
   - Weight: 25
   - Phase: After Implementation
   - Required: true
   - Status: Pending
2. Support add and delete criteria
   - Method: Manual UI Check
   - Pass Condition: The list and statuses update correctly after add or delete
   - Weight: 20
   - Phase: After Implementation
   - Required: true
   - Status: Pending
3. Status changes affect task status
   - Method: Manual UI Check
   - Pass Condition: Failed required criteria affect the task state
   - Weight: 20
   - Phase: After Implementation
   - Required: true
   - Status: Pending
4. Weight normalization is correct
   - Method: Manual UI Check
   - Pass Condition: Total weight always equals 100%
   - Weight: 15
   - Phase: Before Final Acceptance
   - Required: false
   - Status: Pending
5. Natural language revision can generate a preview
   - Method: Manual UI Check
   - Pass Condition: A structured preview appears after input
   - Weight: 20
   - Phase: Before Final Acceptance
   - Required: true
   - Status: Pending

Other tasks should have criteria at a similar level of realism and detail.

## Interaction Requirements

1. Clicking a task node switches the right inspector to the Task view.
2. Clicking an agent card switches the right inspector to the Agent view.
3. Editing criteria updates the center summary automatically.
4. Changing criterion status automatically affects task status.
5. Adding a criterion should auto-expand it.
6. Deleting a criterion should require confirmation.
7. Duplication should be supported.
8. Sorting should be supported.
9. Natural language changes should preview first.
10. Apply should be the only action that commits changes.
11. All actions should write to the Timeline.
12. Export JSON should export the full current state.

## Status Colors

- Passed: Green
- Failed: Red
- Pending: Gray
- In Progress: Blue
- Needs Review: Yellow
- Blocked: Orange

## Delivery Requirements

The final product should:

1. Start successfully.
2. Use complete and realistic mock data.
3. Expose all core interactions.
4. Have a clear component structure.
5. Include real state linkage between task, criteria, and timeline.
6. Avoid any backend dependency.
7. Include README startup instructions.

