# Lesson 1 — Multi-source Dashboard

**Estimated time:** 45–60 minutes  
**Goal:** Load two API sources in parallel and render the results safely.

## 1. What you are building
A small dashboard showing users and posts from JSONPlaceholder. The page has three UI states:
- **Loading:** a request is in progress.
- **Success:** both sources loaded and their data is rendered.
- **Error:** a request failed or the server returned an unsuccessful HTTP status.

## 2. Key ideas

### Starting requests in parallel
```js
const [usersResponse, postsResponse] = await Promise.all([
  fetch(usersUrl),
  fetch(postsUrl)
]);
```
Both `fetch()` calls are started before `Promise.all()` waits for both promises. `Promise.all()` rejects if one of its promises rejects.

### Network errors versus HTTP errors
A network failure (for example, no connection or a blocked request) rejects `fetch()`. An HTTP response such as 404 or 500 normally still fulfills the fetch promise. Check `response.ok` or `response.status` to handle those responses.

### Parsing JSON
`response.json()` is asynchronous too. The example parses both responses in parallel with another `Promise.all()`.

### Rendering into the DOM
`textContent` inserts text, while `document.createElement()` creates actual elements. This is a safe basic pattern for displaying API data.

### Cleanup with `finally`
The `finally` block runs after success or failure, so the Reload button is enabled again.

## 3. Guided experiments
1. Change the list to show 8 users instead of 5.
2. Add a third endpoint: `https://jsonplaceholder.typicode.com/comments`. Show the number of comments.
3. Change one URL to `/users/invalid-route`. Observe that the request can return an HTTP error without throwing automatically; add an `response.ok` check for the new source.
4. Disconnect from the internet and reload. Observe the network error state.
5. Use DevTools → Network to compare the requests and verify that they are started in parallel.

## Completion checklist
- [ ] I can explain `async` and `await`.
- [ ] I can start multiple requests in parallel.
- [ ] I can distinguish a network failure from an HTTP 404/500 response.
- [ ] I can display loading, success, and error states.
- [ ] I can render API data into DOM elements safely.
