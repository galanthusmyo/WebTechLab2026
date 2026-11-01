import { Router } from "express";

const sendError = (response, status, code, message) =>
  response.status(status).json({ error: { code, message } });

function validationMessage(body, creating) {
  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.getPrototypeOf(body) !== Object.prototype
  ) {
    return "Request body must be a JSON object";
  }

  const keys = Object.keys(body);
  const allowed = creating ? ["title"] : ["title", "completed"];
  if (keys.some((key) => !allowed.includes(key))) {
    return "Request body contains unsupported fields";
  }
  if (!keys.length || (creating && !Object.hasOwn(body, "title"))) {
    return creating ? "title is required" : "At least one update field is required";
  }
  if (
    Object.hasOwn(body, "title") &&
    (typeof body.title !== "string" || !body.title.trim())
  ) {
    return "title must be a non-empty string";
  }
  if (Object.hasOwn(body, "completed") && typeof body.completed !== "boolean") {
    return "completed must be a boolean";
  }
  return null;
}

export function createTaskRouter({ repository }) {
  const router = Router();
  const requireJson = (request, response, next) => {
    const contentType = request.get("content-type")?.split(";")[0].trim().toLowerCase();
    return contentType === "application/json"
      ? next()
      : sendError(response, 415, "json_required", "Content-Type must be application/json");
  };

  router.get("/", async (_request, response) =>
    response.json({ data: await repository.list() }),
  );
  router.get("/:taskId", async (request, response) => {
    const task = await repository.findById(request.params.taskId);
    if (!task) return sendError(response, 404, "task_not_found", "Task not found");
    return response.json({ data: task });
  });
  router.post("/", requireJson, async (request, response) => {
    const message = validationMessage(request.body, true);
    if (message) return sendError(response, 400, "validation_failed", message);
    const task = await repository.create({
      title: request.body.title.trim(),
      completed: false,
    });
    return response
      .status(201)
      .location(`/api/tasks/${encodeURIComponent(task.id)}`)
      .json({ data: task });
  });
  router.patch("/:taskId", requireJson, async (request, response) => {
    const message = validationMessage(request.body, false);
    if (message) return sendError(response, 400, "validation_failed", message);
    const changes = {};
    if (Object.hasOwn(request.body, "title")) changes.title = request.body.title.trim();
    if (Object.hasOwn(request.body, "completed")) changes.completed = request.body.completed;
    const task = await repository.update(request.params.taskId, changes);
    if (!task) return sendError(response, 404, "task_not_found", "Task not found");
    return response.json({ data: task });
  });
  router.delete("/:taskId", async (request, response) => {
    const removed = await repository.remove(request.params.taskId);
    if (!removed) return sendError(response, 404, "task_not_found", "Task not found");
    return response.status(204).end();
  });

  return router;
}
