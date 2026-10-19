const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const statusElement = document.querySelector("#task-status");

// The model is the source of truth. The DOM is a rendered view of this array.
let nextId = 3;
let tasks = [
  { id: 1, text: "Read the lesson", completed: false },
  { id: 2, text: "Practice DOM events", completed: true }
];

function renderTasks() {
  const fragment = document.createDocumentFragment();

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = task.completed ? "task completed" : "task";
    li.dataset.taskId = String(task.id);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.dataset.action = "toggle";
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.setAttribute("aria-label", `${completeButton.textContent}: ${task.text}`);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove: ${task.text}`);

    li.append(text, completeButton, removeButton);
    fragment.append(li);
  }

  list.replaceChildren(fragment);
}

function handleSubmit(event) {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    statusElement.textContent = "Please enter a task.";
    return;
  }

  tasks.push({ id: nextId++, text, completed: false });
  input.value = "";
  renderTasks();
  statusElement.textContent = "Task added.";
  input.focus();
}

// One listener on the parent handles clicks on all current and future task buttons.
function handleListClick(event) {
  const button = event.target.closest("button[data-action]");

  // Ignore clicks outside a task button.
  if (!button || !list.contains(button)) return;

  const taskElement = button.closest("[data-task-id]");
  if (!taskElement) return;

  const taskId = Number(taskElement.dataset.taskId);
  const action = button.dataset.action;

  if (action === "toggle") {
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  } else if (action === "remove") {
    tasks = tasks.filter((task) => task.id !== taskId);
  }

  renderTasks();
  statusElement.textContent = action === "remove" ? "Task removed." : "Task updated.";
}

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleListClick);
renderTasks();

// Cleanup example: if this UI were mounted/unmounted by a larger app,
// call this function when it is removed.
function cleanup() {
  form.removeEventListener("submit", handleSubmit);
  list.removeEventListener("click", handleListClick);
}

// This standalone page stays mounted, so cleanup() is intentionally not called.
// It is exposed for experimentation in the browser console.
window.taskListCleanup = cleanup;
