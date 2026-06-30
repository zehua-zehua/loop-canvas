# Loop Canvas MVP - Agent Instructions

## Product Goal

Build a lightweight frontend-only MVP called Loop Canvas.

Loop Canvas is a visual control workspace for vibecoding / web coding agents. It helps users observe and edit the full loop from Goal → Task → Agent → Evaluation Criteria → Execution Status → Failure → Replan.

## Core Principle

This is not a normal todo app.

The most important feature is the fine-grained Evaluation Criteria Editor for each task node.

Every task must have editable, structured, high-precision evaluation criteria.

## Hard Constraints

- Frontend-only MVP.
- No real backend.
- No real Codex API.
- No database.
- Use mock data.
- Use React + TypeScript + Tailwind CSS.
- Use shadcn/ui style components if possible.
- Use lucide-react icons.
- UI labels should mostly be Chinese, but keep key concepts like Goal, Task, Agent, Criteria, Timeline recognizable.
- Keep visual style close to Codex / Linear / Vercel: clean, professional, restrained, not playful.

## Must-have Interactions

1. Click task node → show task inspector.
2. Click agent card → show agent inspector.
3. Add / edit / delete / duplicate / reorder evaluation criteria.
4. Edit criterion fields:
   - title
   - description
   - method
   - passCondition
   - weight
   - phase
   - required
   - status
   - evidence
5. Criterion status changes should update task summary and task status.
6. Natural language revision must generate preview first.
7. Apply Changes updates criteria and writes to timeline.
8. Create Fix Task when required criterion fails.
9. Timeline records all important user actions.
10. Export JSON exports full current state.

## Implementation Strategy

Build in this order:

1. Static layout.
2. Mock data models.
3. Task selection and Agent selection.
4. Criteria editor.
5. Criteria state linkage.
6. Natural language mock revision.
7. Failure summary and fix task creation.
8. Timeline.
9. Export JSON.
10. Polish UI.

## Definition of Done

The project is done only if:

- The app starts successfully.
- The page shows Goal Bar, Agent Panel, Task Canvas, Inspector, and Timeline.
- Task and Agent cards are clickable.
- Criteria can be added, edited, deleted, duplicated, reordered.
- Criteria status updates task progress and summary.
- Natural language revision has preview and apply flow.
- Failed required criteria trigger Failure Summary.
- Create Fix Task works.
- Timeline updates after user actions.
- Export JSON works.
- README explains how to run the project.

## Do Not

- Do not implement authentication.
- Do not implement a real database.
- Do not call real LLM APIs.
- Do not make it look like a generic task management app.
- Do not hide the evaluation criteria editor behind too many clicks.
