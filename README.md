# Loop Canvas

Loop Canvas is a frontend-only MVP for managing an agentic coding loop. It turns the abstract flow of `Goal -> Task -> Agent -> Criteria -> Evaluation -> Failure -> Replan` into a visible workspace where a user can inspect tasks, edit evaluation criteria, simulate failure handling, and export the full loop state.

The project was built as a coding-agent workflow demo: it focuses on how product, engineering, and evaluation roles can share one structured operating surface instead of relying on scattered prompts, chat history, and vague acceptance standards.

## What It Demonstrates

- **Goal-first control surface**: a top-level Goal Bar keeps the objective, phase, progress, and export action visible.
- **Agent ownership model**: four mock agents carry different responsibilities: planning, building, evaluating, and debugging.
- **Task graph workspace**: tasks show owner, status, risk, progress, and criteria summary in a readable vertical flow.
- **Evaluation Criteria Editor**: every task has editable, weighted, required/non-required criteria with method, phase, status, pass condition, and evidence.
- **Criteria-status linkage**: failed required criteria can change task status and surface a failure summary.
- **Natural-language revision preview**: users can describe changes in plain language, preview the parsed change, and apply it explicitly.
- **Failure-to-fix loop**: failed criteria can generate a follow-up fix task assigned to the Debugger Agent.
- **Timeline trace log**: edits, replans, fix tasks, and exports are written into a bottom event stream.
- **JSON export**: the current Goal, Agents, Tasks, Criteria, and Timeline can be exported as structured data.

## Product Positioning

Loop Canvas is not a generic task board. It is an experiment in making AI-assisted development more inspectable:

- task decomposition stays tied to the original goal;
- agent responsibility is explicit;
- acceptance standards are structured before and after implementation;
- failure is routed into a replan or fix loop instead of becoming an untracked chat message.

This makes it useful as a demo for AI product thinking, agent workflow design, evaluation criteria design, and vibe-coding governance.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- localStorage persistence

No backend, database, authentication, or real LLM/API dependency is required.

## Run Locally

```bash
npm install --cache ./.npm-cache
npm run dev -- --port 5173
```

Open `http://127.0.0.1:5173/`.

To reset the saved workspace state:

```text
http://127.0.0.1:5173/?reset=1
```

## Checks

```bash
npm run build
```

## Live Prototype

Interactive prototype: https://zehua-zehua.github.io/loop-canvas/

## Project Structure

```text
src/
  App.tsx                    # workspace state, interactions, export flow
  components/
    GoalBar.tsx              # top goal and action bar
    AgentPanel.tsx           # agent ownership panel
    TaskCanvas.tsx           # vertical task graph
    Inspector.tsx            # task / agent detail surface
    CriteriaEditor.tsx       # core evaluation criteria editor
    Timeline.tsx             # trace log
    StatusBadge.tsx          # status and risk labels
  data/mockData.ts           # mock goal, agents, tasks, criteria, timeline
  lib/criteria.ts            # criteria summary, status, weighting helpers
  types.ts                   # product data model
  styles.css                 # shared UI styling
```

## Related Docs

- `product-brief.md`: product requirements and interaction model.
- `agent.md`: implementation instructions for a coding agent.
- `checklist.md`: MVP acceptance checklist.

## Repository

GitHub: https://github.com/zehua-zehua/loop-canvas
