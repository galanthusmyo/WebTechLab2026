# Derivation — Meeting API Repair

The starter was copied from the validated reference on 2026-10-11. Only `src/meeting-router.js` differs.

1. Removed the missing-detail response branch. Requests for absent meetings remain pending.
2. Removed the explicit conflict status. The conflict body now uses the default success status.
3. Removed the successful detail’s `data` wrapper. That endpoint returns a bare record.
4. Removed selection of direction from the requested order. Ascending behavior remains, while descending requests return the wrong representation.

App assembly, store, fixtures, dependencies, startup, tests, and instructions are copied unchanged. These are intentionally observable defects rather than broad TODO shells. Baseline and unrelated regressions must pass; each of the four objective tests must fail independently. No duplicate repaired router belongs in the student tree.
