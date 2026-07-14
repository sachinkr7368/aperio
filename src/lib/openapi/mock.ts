import type { OpenAPIDocument, OpenAPIOperation } from "./types";
import { getResponseExample, listOperations, schemaExample } from "./parse";

export interface MockMatch {
  status: number;
  body: unknown;
  contentType: string;
  operationId?: string;
  path: string;
  method: string;
}

function pathToRegex(path: string): { re: RegExp; keys: string[] } {
  const keys: string[] = [];
  const pattern = path.replace(/\{([^}]+)\}/g, (_m, key) => {
    keys.push(key);
    return "([^/]+)";
  });
  return { re: new RegExp(`^${pattern}$`), keys };
}

export function matchMockOperation(
  doc: OpenAPIDocument,
  method: string,
  requestPath: string
): MockMatch | null {
  const m = method.toLowerCase();
  const ops = listOperations(doc);

  for (const op of ops) {
    if (op.method !== m) continue;
    const { re } = pathToRegex(op.path);
    // strip query
    const pathOnly = requestPath.split("?")[0];
    if (!re.test(pathOnly)) continue;

    const responses = op.operation.responses ?? {};
    const successKey =
      Object.keys(responses).find(
        (c) => parseInt(c, 10) >= 200 && parseInt(c, 10) < 300
      ) ||
      (responses["default"] ? "default" : Object.keys(responses)[0]);

    if (!successKey) {
      return {
        status: 204,
        body: null,
        contentType: "application/json",
        operationId: op.operation.operationId,
        path: op.path,
        method: op.method,
      };
    }

    const res = responses[successKey];
    const status =
      successKey === "default" ? 200 : parseInt(successKey, 10) || 200;

    let body: unknown = null;
    let contentType = "application/json";
    if (res?.content) {
      const jsonMedia = res.content["application/json"];
      const firstEntry = Object.entries(res.content)[0];
      const media = jsonMedia ?? firstEntry?.[1];
      if (firstEntry && !jsonMedia) contentType = firstEntry[0];
      if (media) {
        if (media.example !== undefined) body = media.example;
        else if (media.examples) {
          const firstEx = Object.values(media.examples)[0] as
            | { value?: unknown }
            | undefined;
          body = firstEx?.value ?? null;
        } else if (media.schema) body = schemaExample(media.schema);
      }
    }

    // fallback to string example helper
    if (body === null) {
      const raw = getResponseExample(op.operation, successKey);
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = raw;
        }
      }
    }

    return {
      status,
      body,
      contentType,
      operationId: op.operation.operationId,
      path: op.path,
      method: op.method,
    };
  }

  return null;
}

export function listMockRoutes(doc: OpenAPIDocument) {
  return listOperations(doc).map((op) => ({
    method: op.method.toUpperCase(),
    path: op.path,
    summary: op.operation.summary,
    operationId: op.operation.operationId,
  }));
}

export function pickExampleBody(operation: OpenAPIOperation): unknown {
  const raw = getResponseExample(operation);
  if (!raw) return { message: "ok" };
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
