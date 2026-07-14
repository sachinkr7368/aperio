import type { OpenAPIDocument } from "./types";
import { listOperations } from "./parse";

export interface DiffChange {
  kind: "added" | "removed" | "changed";
  area: "operation" | "schema" | "server" | "info";
  label: string;
  detail?: string;
}

export interface DiffReport {
  changes: DiffChange[];
  summary: {
    added: number;
    removed: number;
    changed: number;
  };
}

export function diffOpenAPI(
  before: OpenAPIDocument,
  after: OpenAPIDocument
): DiffReport {
  const changes: DiffChange[] = [];

  if (before.info.version !== after.info.version) {
    changes.push({
      kind: "changed",
      area: "info",
      label: "Version",
      detail: `${before.info.version} → ${after.info.version}`,
    });
  }
  if (before.info.title !== after.info.title) {
    changes.push({
      kind: "changed",
      area: "info",
      label: "Title",
      detail: `${before.info.title} → ${after.info.title}`,
    });
  }

  const beforeOps = new Map(
    listOperations(before).map((o) => [`${o.method} ${o.path}`, o])
  );
  const afterOps = new Map(
    listOperations(after).map((o) => [`${o.method} ${o.path}`, o])
  );

  for (const [key, op] of afterOps) {
    if (!beforeOps.has(key)) {
      changes.push({
        kind: "added",
        area: "operation",
        label: key.toUpperCase(),
        detail: op.operation.summary,
      });
    } else {
      const prev = beforeOps.get(key)!;
      const notes: string[] = [];
      if (prev.operation.summary !== op.operation.summary)
        notes.push("summary");
      if (
        JSON.stringify(prev.parameters) !== JSON.stringify(op.parameters)
      )
        notes.push("parameters");
      if (
        JSON.stringify(prev.operation.requestBody) !==
        JSON.stringify(op.operation.requestBody)
      )
        notes.push("requestBody");
      if (
        JSON.stringify(prev.operation.responses) !==
        JSON.stringify(op.operation.responses)
      )
        notes.push("responses");
      if (notes.length) {
        changes.push({
          kind: "changed",
          area: "operation",
          label: key.toUpperCase(),
          detail: `Changed: ${notes.join(", ")}`,
        });
      }
    }
  }
  for (const [key] of beforeOps) {
    if (!afterOps.has(key)) {
      changes.push({
        kind: "removed",
        area: "operation",
        label: key.toUpperCase(),
      });
    }
  }

  const beforeSchemas = new Set(
    Object.keys(before.components?.schemas ?? {})
  );
  const afterSchemas = new Set(Object.keys(after.components?.schemas ?? {}));
  for (const s of afterSchemas) {
    if (!beforeSchemas.has(s)) {
      changes.push({ kind: "added", area: "schema", label: s });
    } else if (
      JSON.stringify(before.components?.schemas?.[s]) !==
      JSON.stringify(after.components?.schemas?.[s])
    ) {
      changes.push({
        kind: "changed",
        area: "schema",
        label: s,
        detail: "Schema definition changed",
      });
    }
  }
  for (const s of beforeSchemas) {
    if (!afterSchemas.has(s)) {
      changes.push({ kind: "removed", area: "schema", label: s });
    }
  }

  const bServers = new Set((before.servers ?? []).map((s) => s.url));
  const aServers = new Set((after.servers ?? []).map((s) => s.url));
  for (const u of aServers) {
    if (!bServers.has(u))
      changes.push({ kind: "added", area: "server", label: u });
  }
  for (const u of bServers) {
    if (!aServers.has(u))
      changes.push({ kind: "removed", area: "server", label: u });
  }

  return {
    changes,
    summary: {
      added: changes.filter((c) => c.kind === "added").length,
      removed: changes.filter((c) => c.kind === "removed").length,
      changed: changes.filter((c) => c.kind === "changed").length,
    },
  };
}
