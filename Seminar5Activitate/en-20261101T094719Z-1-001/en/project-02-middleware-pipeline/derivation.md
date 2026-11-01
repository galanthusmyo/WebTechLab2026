# Derivation Record — Middleware Pipeline

## Source

The student tree was copied from the validated reference after clean install, all six checks, startup, and a live request/response inspection passed. Installed `node_modules` was excluded; manifest and lock file are identical.

## Intentional difference

Only `src/report-pipeline.js` differs. The three ordered middleware functions for identity/timing/completion observation, JSON media validation, and report normalization were removed. The exported factory signature remains and returns an empty middleware array with one non-solution TODO.

## Objective represented by the removal

Students must implement ordered Express control flow: establish request identity, capture deterministic response time at header commit, log one finish/abort outcome, short-circuit media/field errors, freeze normalized input, and delegate correctly.

## Expected student state

- Install, app startup, health, malformed-JSON handling, unknown routes, and the supplied report handler remain healthy.
- Baseline and regression checks pass because they exercise a passthrough pipeline or supplied infrastructure.
- Objective checks fail because headers/logs/validation are absent and the aborted-response observer does not exist.

No removed middleware implementation is duplicated in student prose, fixtures, or generated output.
