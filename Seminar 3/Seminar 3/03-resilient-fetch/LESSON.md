# Lesson 3 — Resilient Fetch

**Estimated time:** 60–75 minutes  
**Goal:** Add cancellation, timeouts, retry, exponential backoff, and protection against stale results.

## 1. Try the demo
Choose each endpoint and click **Run request**:
- Success: a normal JSON response.
- Server error: HTTP 500, which is considered retryable in this example.
- Not found: HTTP 404, which is not retried.
- Slow response: may exceed the three-second timeout.

Public test services may be blocked or unavailable on some networks. If so, use the code as a learning exercise and try the success endpoint.

## 2. Key ideas

### AbortController
`AbortController` creates a signal that can be passed to `fetch()`. Calling `controller.abort()` cancels the request. The same signal is checked during retry delays so the user can cancel the entire operation.

### Timeout
The example races the request against a timeout promise. When the timeout fires, it aborts the request and reports a timeout error. The timer is cleared in `finally`.

Note: `Promise.race()` by itself does not cancel the losing promise. That is why the timeout also aborts the request.

### Retry and exponential backoff
A retry repeats a failed operation. Exponential backoff increases the delay after each failed attempt:
- After attempt 1: 500 ms
- After attempt 2: 1,000 ms
- After attempt 3: stop

Retry only errors that are likely to be temporary. The example retries network errors, timeouts, and HTTP 5xx responses, but not ordinary 4xx responses such as 404.

### Avoiding stale results
Each run receives a version number. Before updating the UI, the code checks whether that run is still the latest. It also aborts the previous run when a new request starts.

### Handling rejected promises
The asynchronous request is awaited inside `try/catch`, so errors are handled. The retry delay is also awaited inside the same error-handling flow.

## 3. Guided experiments
1. Change `timeoutMs` from 3000 to 1000. Does the slow endpoint time out more often?
2. Change `maxAttempts` from 3 to 2.
3. Change the initial delay from 500 ms to 250 ms.
4. Select the 404 endpoint and verify that the code does not retry.
5. Start the slow request and press Cancel.
6. Start a request, then immediately start another by clicking Run after enabling it temporarily. Check that the older run cannot update the UI.

## 4. Important production notes
This is an educational example, not a universal networking library. In production:
- Consider `Retry-After` headers, jitter, and a total time budget.
- Do not automatically retry every HTTP method. Retrying a non-idempotent operation (such as a payment POST) can duplicate side effects.
- Treat timeout and cancellation as distinct concepts if your UI needs to report them differently.
- Consider validating the shape of JSON responses.
- If a request body or response stream is involved, design retries carefully.

## Completion checklist
- [ ] I can cancel a fetch request.
- [ ] I can set a timeout and clean up its timer.
- [ ] I can implement a limited retry loop.
- [ ] I can explain exponential backoff.
- [ ] I can distinguish retryable server/network errors from permanent client errors.
- [ ] I can prevent stale requests from updating the UI.
