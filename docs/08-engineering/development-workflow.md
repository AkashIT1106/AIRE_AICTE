# Development Workflow and Agent Rules

| Metadata             | Value                                                           |
| -------------------- | --------------------------------------------------------------- |
| Document             | `docs/08-engineering/development-workflow.md`                   |
| Authoritative For    | Task Protocol, Branching, Git Hygiene, Migration Rules          |
| Status               | `CONFIRMED`                                                     |
| Source               | PROJECT_PLAN.md §36.4, §38.4, AGENTS.md §5, §13                 |
| Related Requirements | [`AIRE-REQ-234`](../00-governance/requirements-traceability.md) |

---

## 1. Task-Driven Engineering Protocol

Every engineering change must follow this structured workflow:

1. **Understand:** Read relevant modular specifications in `docs/` and inspect existing code.
2. **Research:** Verify version compatibility against installed dependencies; consult official docs.
3. **Plan:** Draft a task prompt under `prompts/` outlining goal, affected files, tests, and rollback considerations.
4. **Approval:** Obtain explicit approval before modifying source code.
5. **Implement:** Execute the smallest complete, securely isolated change. Do not add unrequested features.
6. **Verify:** Execute `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and verify git diff.
7. **Report:** Provide concise report with What I Did, Test Results, and Needs Your Attention.

---

## 2. Git & Repository Hygiene

- Work on feature branches branched from `main`.
- Never commit secrets, `.env` files, or generated test artifacts.
- Run `git status` and `git diff` before concluding tasks to ensure clean working trees.
