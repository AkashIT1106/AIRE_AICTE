# AIRE + Antigravity Implementation Starter v1

This starter combines the AIRE Design Governance v1.0 documents with Google Antigravity-native Agent Skills and phased implementation prompts.

## Important Antigravity compatibility note

Use workspace `AGENTS.md` rules and Agent Skills in `.agents/skills/<skill-name>/SKILL.md`.
Do not create new legacy `.agents/workflows/*.md` workflows. Google's Antigravity documentation states that legacy Workflows stopped being indexed/executable after 19 October 2026.

Official references:

- Rules: https://antigravity.google/docs/rules/
- Agent Skills: https://antigravity.google/docs/skills
- Workflows-to-skills migration: https://antigravity.google/docs/migration/workflows-to-skills
- Artifact review and settings: https://www.antigravity.google/docs/settings
- UX4G 3.0: https://www.ux4g.gov.in/

## Installation

1. Start from the existing AIRE repository root.
2. Check `git status --short`. Commit or stash existing work before applying changes.
3. Merge `AGENTS.md.append.md` into the existing root `AGENTS.md`. Do not replace existing repository instructions blindly. If no `AGENTS.md` exists, copy the snippet to `AGENTS.md`.
4. Copy `.agents/skills/` into the repository root, preserving existing skills. Resolve same-name collisions manually.
5. Copy `docs/design/` into the repository's `docs/design/`. If that directory already exists, merge; never overwrite newer approved project decisions without comparing them.
6. Use Antigravity Planning Mode and set the permission preset / artifact review to Request Review. Keep terminal and browser actions approval-gated. Do not use Always Proceed for the redesign.
7. Run the prompts in `prompts/` one at a time, in numeric order. Stop at each approval gate.

## Recommended initial Git preparation

```bash
git status --short
git branch --show-current
# Commit or stash current work before continuing.
git switch -c chore/aire-design-governance
```

If the branch already exists, choose a new descriptive branch name. Do not discard uncommitted work.

## Recommended Antigravity setup

- Start a new conversation scoped to the AIRE repository.
- Choose Planning Mode for audit, planning and multi-file design tasks.
- Keep Request Review enabled for plans, terminal commands and file changes.
- Prefer an isolated worktree if available and your repository is Git-backed.
- Use the skills `/aire-frontend-audit`, `/aire-design-system`, `/aire-screen-implementation`, and `/aire-ux-qa` when appropriate. If slash invocation is unavailable, mention the skill by name and ask the agent to read its `SKILL.md`.

## Execution discipline

- Do not run all prompts in one conversation as one autonomous task.
- Do not let the agent redesign all pages in one pass.
- Audit first. Approve a plan. Implement one scope. Verify it. Then continue.
- Preserve existing APIs, routes, RBAC, database contracts and working workflows unless a separately approved task changes them.
- Treat the palette and tokens in this package as proposed. Verify contrast and reconcile them against the actual app and applicable UX4G guidance before adoption.
- Demo fixtures must be labelled as demo data; never fabricate production statuses, capacity or compliance counts.
