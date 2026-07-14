import { load as yamlLoad } from "js-yaml";
import type {
  HttpMethod,
  OpenAPIDocument,
  OpenAPIOperation,
  OpenAPIParameter,
  OpenAPIPathItem,
  OpenAPISchema,
  ResolvedOperation,
  TagGroup,
} from "./types";

const HTTP_METHODS: HttpMethod[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
];

export function parseOpenAPI(input: string): OpenAPIDocument {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("OpenAPI document is empty.");
  }

  let raw: unknown;
  try {
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      raw = JSON.parse(trimmed);
    } else {
      raw = yamlLoad(trimmed);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown parse error";
    throw new Error(`Failed to parse OpenAPI document: ${message}`);
  }

  if (!raw || typeof raw !== "object") {
    throw new Error("OpenAPI document must be a JSON or YAML object.");
  }

  const doc = raw as OpenAPIDocument;
  if (!doc.info?.title) {
    throw new Error("OpenAPI document is missing info.title.");
  }
  if (!doc.openapi && !doc.swagger) {
    throw new Error("Document must include openapi or swagger version.");
  }

  return resolveRefs(doc, doc) as OpenAPIDocument;
}

export function resolveRefs<T>(node: T, root: OpenAPIDocument, seen = new Set<string>()): T {
  if (node === null || typeof node !== "object") return node;

  if (Array.isArray(node)) {
    return node.map((item) => resolveRefs(item, root, seen)) as T;
  }

  const obj = node as Record<string, unknown>;
  if (typeof obj.$ref === "string") {
    const ref = obj.$ref as string;
    if (seen.has(ref)) return {} as T;
    seen.add(ref);
    const resolved = getByPointer(root, ref);
    if (resolved === undefined) return node;
    const merged = { ...(resolveRefs(resolved, root, new Set(seen)) as object) };
    for (const [k, v] of Object.entries(obj)) {
      if (k !== "$ref") (merged as Record<string, unknown>)[k] = v;
    }
    return merged as T;
  }

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = resolveRefs(v, root, seen);
  }
  return out as T;
}

function getByPointer(root: OpenAPIDocument, ref: string): unknown {
  if (!ref.startsWith("#/")) return undefined;
  const parts = ref
    .slice(2)
    .split("/")
    .map((p) => p.replace(/~1/g, "/").replace(/~0/g, "~"));
  let cur: unknown = root;
  for (const part of parts) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export function listOperations(doc: OpenAPIDocument): ResolvedOperation[] {
  const ops: ResolvedOperation[] = [];
  const paths = doc.paths ?? {};

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem) continue;
    const item = pathItem as OpenAPIPathItem;
    const pathParams = item.parameters ?? [];

    for (const method of HTTP_METHODS) {
      const operation = item[method] as OpenAPIOperation | undefined;
      if (!operation) continue;

      const parameters = mergeParameters(pathParams, operation.parameters ?? []);
      const tags = operation.tags?.length ? operation.tags : ["default"];
      const id =
        operation.operationId ||
        `${method}-${path}`.replace(/[^a-zA-Z0-9_-]/g, "-");

      ops.push({
        id,
        method,
        path,
        operation,
        parameters,
        tags,
      });
    }
  }

  return ops;
}

function mergeParameters(
  pathParams: OpenAPIParameter[],
  opParams: OpenAPIParameter[]
): OpenAPIParameter[] {
  const map = new Map<string, OpenAPIParameter>();
  for (const p of pathParams) map.set(`${p.in}:${p.name}`, p);
  for (const p of opParams) map.set(`${p.in}:${p.name}`, p);
  return Array.from(map.values());
}

export function groupByTag(doc: OpenAPIDocument): TagGroup[] {
  const ops = listOperations(doc);
  const tagMeta = new Map(
    (doc.tags ?? []).map((t) => [t.name, t.description] as const)
  );
  const groups = new Map<string, ResolvedOperation[]>();

  for (const op of ops) {
    for (const tag of op.tags) {
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag)!.push(op);
    }
  }

  const ordered: TagGroup[] = [];
  for (const tag of doc.tags ?? []) {
    if (groups.has(tag.name)) {
      ordered.push({
        name: tag.name,
        description: tag.description,
        operations: groups.get(tag.name)!,
      });
      groups.delete(tag.name);
    }
  }

  for (const [name, operations] of groups) {
    ordered.push({
      name,
      description: tagMeta.get(name),
      operations,
    });
  }

  return ordered;
}

export function schemaExample(schema?: OpenAPISchema, depth = 0): unknown {
  if (!schema || depth > 6) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (schema.enum?.length) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;

  if (schema.allOf?.length) {
    return schema.allOf.reduce<Record<string, unknown>>((acc, s) => {
      const ex = schemaExample(s, depth + 1);
      if (ex && typeof ex === "object" && !Array.isArray(ex)) {
        return { ...acc, ...(ex as object) };
      }
      return acc;
    }, {});
  }

  if (schema.oneOf?.[0] || schema.anyOf?.[0]) {
    return schemaExample(schema.oneOf?.[0] ?? schema.anyOf?.[0], depth + 1);
  }

  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;

  switch (type) {
    case "object": {
      const obj: Record<string, unknown> = {};
      for (const [key, prop] of Object.entries(schema.properties ?? {})) {
        obj[key] = schemaExample(prop, depth + 1);
      }
      return obj;
    }
    case "array":
      return [schemaExample(schema.items, depth + 1)];
    case "integer":
    case "number":
      return schema.minimum ?? 0;
    case "boolean":
      return true;
    case "string":
      if (schema.format === "date-time") return new Date().toISOString();
      if (schema.format === "date") return new Date().toISOString().slice(0, 10);
      if (schema.format === "email") return "user@example.com";
      if (schema.format === "uuid") return "00000000-0000-0000-0000-000000000000";
      if (schema.format === "uri" || schema.format === "url")
        return "https://example.com";
      return schema.title || "string";
    default:
      if (schema.properties) {
        const obj: Record<string, unknown> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = schemaExample(prop, depth + 1);
        }
        return obj;
      }
      return null;
  }
}

export function getRequestBodyExample(operation: OpenAPIOperation): string {
  const content = operation.requestBody?.content;
  if (!content) return "";
  const json =
    content["application/json"] ||
    content["application/*+json"] ||
    Object.values(content)[0];
  if (!json) return "";
  if (json.example !== undefined) return JSON.stringify(json.example, null, 2);
  if (json.examples) {
    const first = Object.values(json.examples)[0];
    if (first?.value !== undefined) return JSON.stringify(first.value, null, 2);
  }
  if (json.schema) return JSON.stringify(schemaExample(json.schema), null, 2);
  return "";
}

export function getResponseExample(
  operation: OpenAPIOperation,
  status = "200"
): string {
  const responses = operation.responses ?? {};
  const response =
    responses[status] ||
    responses["201"] ||
    responses["default"] ||
    Object.values(responses)[0];
  if (!response?.content) return "";
  const json =
    response.content["application/json"] || Object.values(response.content)[0];
  if (!json) return "";
  if (json.example !== undefined) return JSON.stringify(json.example, null, 2);
  if (json.examples) {
    const first = Object.values(json.examples)[0];
    if (first?.value !== undefined) return JSON.stringify(first.value, null, 2);
  }
  if (json.schema) return JSON.stringify(schemaExample(json.schema), null, 2);
  return "";
}

export function methodColor(method: string): string {
  const m = method.toLowerCase();
  switch (m) {
    case "get":
      return "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30";
    case "post":
      return "bg-sky-500/15 text-sky-400 ring-sky-500/30";
    case "put":
      return "bg-amber-500/15 text-amber-400 ring-amber-500/30";
    case "patch":
      return "bg-orange-500/15 text-orange-400 ring-orange-500/30";
    case "delete":
      return "bg-rose-500/15 text-rose-400 ring-rose-500/30";
    default:
      return "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30";
  }
}

export async function fetchOpenAPI(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: "application/json, application/yaml, text/yaml, */*" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI (${res.status} ${res.statusText})`);
  }
  return res.text();
}
