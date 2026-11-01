# Validation Record — Middleware Pipeline

## Reference validation

- [x] Clean dependency install succeeds.
- [x] Documented start command succeeds.
- [x] Baseline checks pass.
- [x] Objective checks pass.
- [x] Regression checks pass.
- [x] Observable completion criteria are satisfied.

### Commands / results

`npm install` reproduced Express 5.1.0 and its locked dependency tree with no reported vulnerabilities. Baseline passed 1/1, objective passed 4/4, regression passed 1/1, and the aggregate suite passed 6/6 after classifying the close-before-finish behavior as objective-specific. The server started on loopback at port 4186. A live report request returned `201`, echoed `X-Request-Id: live-42`, emitted `X-Response-Time-Ms`, and returned normalized JSON.

## Student validation

- [x] Student version was copied/derived from the validated reference.
- [x] Clean dependency install succeeds.
- [x] Required baseline behavior works.
- [x] Unrelated regression checks pass.
- [x] Objective checks fail or remain incomplete exactly as documented.
- [x] No accidental solution leakage was found.
- [x] Reference/student delta matches `derivation.md`.

### Commands / results

The locked install completed with no reported vulnerabilities. Baseline passed 1/1 and regression passed 1/1. All four objective checks failed for the intended missing pipeline: identity/timing headers were absent, invalid input reached the supplied `201` handler, and no abort observer existed. `diff -qr --exclude node_modules` reported only `src/report-pipeline.js`. A targeted search found no removed middleware functions; the README names observable headers but contains no implementation.

## Exceptions

Loopback tests and the live check require execution outside the socket-restricted sandbox.
