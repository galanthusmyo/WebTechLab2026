export function createReportPipeline({
  clock: _clock,
  createRequestId: _createRequestId,
  logger: _logger,
}) {
  const identityAndTiming = (request, response, next) => {
    const incomingId = request.get("x-request-id");
    const requestId =
      typeof incomingId === "string" && incomingId.trim()
        ? incomingId.trim()
        : _createRequestId();
    request.requestId = requestId;
    response.setHeader("X-Request-Id", requestId);

    const startedAt = _clock.now();
    let durationMs;
    let completed = false;
    const captureDuration = (committingHeaders = false) => {
      if (durationMs === undefined) {
        durationMs = Math.max(0, _clock.now() - startedAt);
        if (committingHeaders) {
          response.setHeader("X-Response-Time-Ms", String(durationMs));
        }
      }
      return durationMs;
    };
    const logCompletion = (outcome) => {
      if (completed) return;
      completed = true;
      response.off("finish", onFinish);
      response.off("close", onClose);
      try {
        _logger.info({
          requestId,
          method: request.method,
          path: request.path,
          status: response.statusCode,
          durationMs: captureDuration(),
          outcome,
        });
      } catch (error) {
        next(error);
      }
    };
    const onFinish = () => logCompletion("completed");
    const onClose = () => logCompletion("aborted");

    response.once("finish", onFinish);
    response.once("close", onClose);

    const writeHead = response.writeHead;
    response.writeHead = function (...args) {
      captureDuration(true);
      return writeHead.apply(this, args);
    };
    next();
  };

  const requireJson = (request, response, next) => {
    const contentType = request.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (contentType === "application/json") return next();
    return response.status(415).json({
      error: {
        code: "json_required",
        message: "Content-Type must be application/json",
        requestId: request.requestId,
      },
    });
  };

  const validateReport = (request, response, next) => {
    const body = request.body;
    const plainObject =
      body !== null &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      Object.getPrototypeOf(body) === Object.prototype;
    const validFields =
      plainObject &&
      Object.keys(body).length === 2 &&
      Object.hasOwn(body, "summary") &&
      Object.hasOwn(body, "severity") &&
      typeof body.summary === "string" &&
      Boolean(body.summary.trim()) &&
      ["low", "medium", "high"].includes(body.severity);

    if (!validFields) {
      return response.status(400).json({
        error: {
          code: "validation_failed",
          message: "Report requires a nonblank summary and a valid severity",
          requestId: request.requestId,
        },
      });
    }

    request.body = Object.freeze({
      summary: body.summary.trim(),
      severity: body.severity,
    });
    return next();
  };

  return [identityAndTiming, requireJson, validateReport];
}
