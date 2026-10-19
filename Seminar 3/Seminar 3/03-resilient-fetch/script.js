const endpointSelect = document.querySelector("#endpoint");
const runButton = document.querySelector("#run-button");
const cancelButton = document.querySelector("#cancel-button");
const statusElement = document.querySelector("#status");
const resultElement = document.querySelector("#result");

let activeController = null;
let requestVersion = 0;

const endpoints = {
  success: "https://jsonplaceholder.typicode.com/todos/1",
  "server-error": "https://httpstat.us/500",
  "not-found": "https://httpstat.us/404",
  slow: "https://httpbin.org/delay/8"
};

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("The operation was aborted.", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      reject(new DOMException("The operation was aborted.", "AbortError"));
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function isRetryable(error) {
  // Retry network errors and selected server errors; do not retry ordinary 4xx.
  return error.name === "TypeError" ||
    (error instanceof Error && error.retryable === true);
}

async function fetchWithRetry(url, { signal, timeoutMs = 3000, maxAttempts = 3 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (signal.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }

    const timeoutController = new AbortController();
    const abortFromParent = () => timeoutController.abort();
    signal.addEventListener("abort", abortFromParent, { once: true });

    let timeoutId;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          timeoutController.abort();
          const error = new Error(`Timed out after ${timeoutMs} ms.`);
          error.retryable = true;
          reject(error);
        }, timeoutMs);
      });

      const requestPromise = fetch(url, { signal: timeoutController.signal }).then((response) => {
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}`);
          error.status = response.status;
          error.retryable = response.status >= 500;
          throw error;
        }
        return response.json();
      });

      return await Promise.race([requestPromise, timeoutPromise]);
    } catch (error) {
      if (signal.aborted) {
        throw new DOMException("The operation was aborted.", "AbortError");
      }

      lastError = error;
      const canRetry = isRetryable(error) && attempt < maxAttempts;
      if (!canRetry) throw error;

      const delay = 500 * (2 ** (attempt - 1));
      statusElement.textContent = `Attempt ${attempt} failed. Retrying in ${delay} ms…`;
      await sleep(delay, signal);
    } finally {
      clearTimeout(timeoutId);
      signal.removeEventListener("abort", abortFromParent);
    }
  }

  throw lastError;
}

async function runRequest() {
  // Abort the previous run so that an older response cannot overwrite a newer one.
  if (activeController) activeController.abort();

  const controller = new AbortController();
  activeController = controller;
  const myVersion = ++requestVersion;

  runButton.disabled = true;
  cancelButton.disabled = false;
  resultElement.textContent = "";
  statusElement.textContent = "Request started…";

  try {
    const data = await fetchWithRetry(endpoints[endpointSelect.value], {
      signal: controller.signal,
      timeoutMs: 3000,
      maxAttempts: 3
    });

    if (myVersion !== requestVersion) return;
    resultElement.textContent = JSON.stringify(data, null, 2);
    statusElement.textContent = "Success.";
  } catch (error) {
    if (myVersion !== requestVersion) return;

    if (error.name === "AbortError") {
      statusElement.textContent = "Request cancelled.";
    } else {
      statusElement.textContent = `Request failed: ${error.message}`;
    }
  } finally {
    if (myVersion === requestVersion) {
      runButton.disabled = false;
      cancelButton.disabled = true;
      activeController = null;
    }
  }
}

runButton.addEventListener("click", runRequest);
cancelButton.addEventListener("click", () => activeController?.abort());
