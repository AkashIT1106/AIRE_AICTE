# Prompt 00 — Prepare AIRE repository for governed UI work

Read the existing repository instructions first. Inspect Git status and the current project structure. I have provided `docs/design/` and `.agents/skills/` in this repository.

Task:

1. Compare the provided AIRE design governance documents with the existing repository's docs and instructions.
2. Merge the contents of `AGENTS.md.append.md` into the existing root `AGENTS.md` without deleting or weakening existing project-specific rules. If no root `AGENTS.md` exists, create it from the snippet.
3. Merge the provided `.agents/skills/` into the workspace skill directory without overwriting unrelated existing skills.
4. Preserve existing docs and resolve conflicting paths by reporting them; do not overwrite an existing approved decision silently.
5. Confirm Antigravity can discover the workspace skills. Do not create legacy `.agents/workflows/` files.
6. Do not modify application source, package manifests, lockfiles, routes, styles, tests, APIs or business logic.

Deliver a list of created/merged files, conflicts, skill names and remaining manual setup steps. Stop for approval.
