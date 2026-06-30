# Loop Canvas MVP Acceptance Checklist

## Layout

- [ ] Top Goal Bar exists.
- [ ] Left Agent Panel exists.
- [ ] Center Task Canvas exists.
- [ ] Right Inspector exists.
- [ ] Bottom Timeline exists.

## Task Canvas

- [ ] Shows 6 mock tasks.
- [ ] Each task shows owner, status, risk, criteria summary, progress.
- [ ] Clicking task opens Task Inspector.
- [ ] Task summary updates when criteria status changes.

## Agent Panel

- [ ] Shows 4 mock agents.
- [ ] Clicking agent opens Agent Inspector.
- [ ] Agent Inspector shows role, skills, persona, prompt summary, tool package, permission level.

## Criteria Editor

- [ ] Each task has 3-6 criteria.
- [ ] Criterion can expand/collapse.
- [ ] Criterion supports field-level editing.
- [ ] Criterion can be added.
- [ ] Criterion can be deleted.
- [ ] Criterion can be duplicated.
- [ ] Criterion can move up/down.
- [ ] Criterion status can be changed.
- [ ] Required failed criterion affects task status.
- [ ] Normalize Weights makes total weight 100%.

## Natural Language Revision

- [ ] User can type revision request.
- [ ] Generate Preview does not directly modify data.
- [ ] Preview shows change type and summary.
- [ ] Apply Changes updates criteria.
- [ ] Cancel clears preview.

## Failure and Replan

- [ ] Failed required criterion shows Failure Summary.
- [ ] Create Fix Task adds new task.
- [ ] Ask Planner to Replan writes timeline event.
- [ ] Mark as Accepted Risk works.

## Timeline

- [ ] Add criterion writes event.
- [ ] Delete criterion writes event.
- [ ] Update criterion writes event.
- [ ] Natural language apply writes event.
- [ ] Create fix task writes event.
- [ ] Export JSON writes event.

## Final

- [ ] App runs without errors.
- [ ] README includes startup instructions.
- [ ] No backend or API dependency.
