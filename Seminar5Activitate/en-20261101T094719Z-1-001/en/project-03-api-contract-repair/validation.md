# Validation — Meeting API Repair

Validated on 2026-10-11.

## Reference

Clean `npm ci` succeeds. `npm test`: 12/12 pass (3 baseline, 4 objective, 5 regression). `npm start` prints a loopback URL; a live descending-list request returns m1, m3, m2. Loopback tests run outside the restricted sandbox.

## Student

Clean `npm ci` succeeds. Baseline: 3/3 pass. Regression: 5/5 pass. Objective: all four tests fail independently for the specified defects (timeout, success-class conflict, bare detail, ignored descending order). Timeout probes finish in about one second; server teardown closes outstanding connections. Subsequent health requests succeed.

## Delta and leakage

Only `src/meeting-router.js` differs, as documented in derivation.md. File sets, dependencies, tests, and supporting files match. Obsolete legacy adapters are removed from both trees. The starter contains no duplicate complete router. Prose and tests state observable requirements without reproducing repaired handler code.
