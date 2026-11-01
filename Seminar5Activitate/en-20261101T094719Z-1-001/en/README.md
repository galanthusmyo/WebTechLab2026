# Tutorial 05 — Server-Side JavaScript and REST APIs

**Expected duration:** 95 minutes

## AI workflow

Use the Codex IDE extension in VS Code when available. Otherwise, use Codex CLI signed in with ChatGPT, including with a free account. The app and web interfaces are optional. Ask for a small change, inspect the diff, and run the checks locally. Follow [the shared workflow](../../../ai-assisted-workflow.md).

## Objectives

- Implement Express routes using a supplied data store.
- Reject invalid requests and choose the required status, headers, and body.
- Find and repair API errors without rewriting working code.

## Prerequisites

- Units 1–4, Node.js LTS, npm, `curl`, and native `fetch` familiarity.
- Experience inspecting HTTP requests/responses and reviewing a small diff.
- Dependencies for Projects 1 and 3 installed before the timed session.

## Concepts

Node server lifecycle, Express applications and routers, middleware order, route/path parameters, CRUD resource design, request validation, response completion, status/header/body semantics, structured errors, and centralized failure handling.

You first implement task routes using a supplied in-memory repository. You then inspect a meeting API that runs but has four endpoint defects, reproducing each problem before repairing its handler.

## Prepared starting state

Before class, run `npm install` in the `student/` directories for Projects 1 and 3. No database or external service is required.

Run this preflight:

```bash
cd project-01-in-memory-task-api/student
npm run test:baseline
npm run test:regression

cd ../../project-03-api-contract-repair/student
npm run test:baseline
npm run test:regression
```

The baseline and regression checks should pass. Task routes in Project 1 are incomplete. Project 3 runs with four deliberate endpoint defects, so its objective tests fail until repaired.

## Session map

| Time | Activity |
| --- | --- |
| 0–8 min | Run preflight checks and map app assembly, router, repository, error middleware, tests, and the allowed student file. |
| 8–18 min | Start In-memory Task API, inspect the supplied health/fallback behavior, and turn the task contract into a method/path/outcome table. |
| 18–55 min | Implement and review `task-router.js`; verify creation plus one validation or missing-resource path with live HTTP. |
| 55–59 min | **Checkpoint 1:** use questions with the `T05-CP1-` prefix from `checkpoints.gift`. |
| 59–66 min | Run Meeting API Repair; probe missing retrieval, repeated acceptance, detail shape, and ascending/descending lists with bounded requests. |
| 66–79 min | Build a diagnosis table with each request, observed symptom, required response, and responsible handler branch. |
| 79–83 min | **Checkpoint 2:** use questions with the `T05-CP2-` prefix from `checkpoints.gift`. |
| 83–93 min | Run Project 1’s full suite, inspect its one-file diff, and explain a success and failure path through Express. |
| 93–95 min | Preserve the contract diagnosis and select middleware or contract repair as follow-up work. |

The safe stopping point is a completed In-memory Task API: every categorized check passes, live success and failure exchanges have been inspected, and only `src/task-router.js` differs. If that point is reached late, do not begin the second project; preserve a clean router result rather than mixing an unverified repair into another service.

## Projects

### Project 1 — In-memory Task API (core, 55–65 minutes)

- **Objective:** Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data.
- **Your task:** Change only `student/src/task-router.js`.
- **Expected outcome:** Deliberate list, create, fetch, update, delete, validation, media-type, and missing-resource behavior.
- **Codex role:** Propose changes in the allowed files, explain them, and run the documented checks. Inspect its diff before accepting the result.
- **Done when:** All checks pass, a live create and failure path match the public contract, `204` has no representation, and the final diff remains one file.

Build an outcome table before writing handlers. Review exact-field validation, preservation of unspecified update fields, returns after response completion, unexpected-error forwarding, and the separation between public HTTP shapes and repository operations.

### Project 2 — Middleware Pipeline (extension, 50–65 minutes)

- **Objective:** Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection.
- **Your task:** Change only `student/src/report-pipeline.js`.
- **Expected outcome:** Deterministic request/response headers, normalized frozen input, safe short-circuiting, and exactly one completion/abort log.
- **Codex role:** Propose changes in the allowed files, explain them, and run the documented checks. Inspect its diff before accepting the result.
- **Done when:** All checks pass and you can identify the owner and lifetime of every ID, timer reading, listener, header, normalized field, and log value.

This is follow-up work because Express middleware has before-delegation and after-completion phases that need controlled timing and abort-path verification, not a hurried sequence of `next` calls.

### Project 3 — Meeting API Repair (reinforcement, 35–50 minutes)

- **Objective:** Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store.
- **Your task:** Change only `student/src/meeting-router.js`.
- **Expected outcome:** Every branch responds, conflicts are client errors, success JSON uses `data`, and the list follows the requested direction.
- **Codex role:** Propose changes in the allowed files, explain them, and run the documented checks. Inspect its diff before accepting the result.
- **Done when:** All checks pass and your bounded HTTP probes confirm the four repairs.

The timed session completes the diagnosis table; implementation is follow-up work. Trace the ordinary handlers directly. No legacy service adapter is involved, and completing Project 2 is not a prerequisite for this investigation.


## Verification discipline

For every Express path, review:

1. **Match:** Which method and pathname own the request?
2. **Boundary validation:** Are media type, body shape, fields, and types rejected before domain work?
3. **Outcome:** Which repository or service result occurred?
4. **Public contract:** Which status, headers, and representation express that outcome?
5. **Completion:** Does control return after sending, or delegate exactly once on unexpected failure?
6. **Evidence:** Do focused checks, a live exchange, and the final diff agree?

Ask Codex for an outcome table or control-flow trace before code. Reject broad app rewrites, modified tests, truthiness validation, bare domain objects, success statuses for errors, bodies on `204`, swallowed exceptions, or leaked internal errors.

## What you should understand

After the required classroom path, you should be able to:

- locate request ownership across app, router, repository, and error boundaries;
- distinguish transport validation from domain operations;
- choose status, header, and body combinations from an observable outcome;
- explain why response completion is also a control-flow boundary;
- preserve centralized handling for malformed input and unexpected failures;
- audit generated API code across success, client-error, and server-error paths.

## Further experiments

- Repair Project 3 from the diagnosis table; independently verify missing retrieval, conflict status class, JSON shape, and ordering.
- Complete Project 2 and test both normal completion and close-before-finish behavior.
- Add task filtering without changing the repository contract, first specifying query validation and response shape.
- Reproduce the documented missing-return failure in Project 1, repair it, and verify a later health request.
