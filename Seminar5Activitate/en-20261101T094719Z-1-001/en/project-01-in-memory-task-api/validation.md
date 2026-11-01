# Validation Record — In-memory Task API

## Reference validation

- [x] Clean dependency install succeeds.
- [x] Documented start command succeeds.
- [x] Baseline checks pass.
- [x] Objective checks pass.
- [x] Regression checks pass.
- [x] Observable completion criteria are satisfied.

### Commands / results

`npm install` added the locked Express dependency tree with no reported vulnerabilities. Focused baseline (2/2), objective (3/3), and regression (2/2) checks passed; the aggregate suite passed 7/7. The server started on loopback at port 4185. A live JSON `POST /api/tasks` returned `201 Created`, `Location: /api/tasks/task-3`, JSON content type, and the normalized task representation.

## Student validation

- [x] Student version was copied/derived from the validated reference.
- [x] Clean dependency install succeeds.
- [x] Required baseline behavior works.
- [x] Unrelated regression checks pass.
- [x] Objective checks fail or remain incomplete exactly as documented.
- [x] No accidental solution leakage was found.
- [x] Reference/student delta matches `derivation.md`.

### Commands / results

`npm install` reproduced the 67-package locked dependency tree. Outside the socket-restricted sandbox, baseline passed 2/2 and regression passed 2/2. All three objective tests failed with the documented `404` fallthrough instead of task-resource statuses. `diff -qr --exclude node_modules` reported only `src/task-router.js`; a targeted implementation-symbol search outside tests found no removed router logic.

## Exceptions

Loopback-binding tests require execution outside the restricted filesystem/network sandbox. The test-category review changed the recovery regression's final probe from the objective task list to the supplied `/health` baseline in both trees; the repaired reference aggregate suite still passes 7/7.
