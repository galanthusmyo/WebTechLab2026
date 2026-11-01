# Derivation Record — In-memory Task API

## Source

The student tree was copied from the validated reference after its clean install, categorized checks, server startup, and live creation exchange passed. Installed `node_modules` was intentionally excluded; dependencies remain reproducible from the identical manifest and lock file.

## Intentional difference

Only `src/task-router.js` differs. The complete route registration, request validation, repository calls, success responses, and task-specific errors were removed. The exported `createTaskRouter` signature and an empty Express router remain, with one non-solution TODO.

## Objective represented by the removal

Students implement the HTTP boundary for the task resource: method/path routing, JSON/body validation, repository coordination, deliberate statuses and headers, success/error envelopes, `204` semantics, and forwarding of unexpected errors.

## Expected student state

- Dependency installation, server startup, the static landing page, `/health`, repository behavior, malformed-JSON handling, and unknown-route fallback remain healthy.
- Every `/api/tasks` objective request falls through to the supplied `404 not_found` response until routes are implemented.
- The router-independent regression checks pass; the method-matching regression also continues to return the supplied `404`.

No completed router logic is duplicated in student prose, tests, fixtures, or generated output.
