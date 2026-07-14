import type { OpenAPIDocument, OpenAPIPathItem } from "./types";
import { listOperations, parseOpenAPI } from "./parse";

export type LintSeverity = "error" | "warning" | "info";

export interface LintIssue {
  id: string;
  severity: LintSeverity;
  message: string;
  path?: string;
  rule: string;
}

export interface LintReport {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  issues: LintIssue[];
  stats: {
    endpoints: number;
    schemas: number;
    errors: number;
    warnings: number;
    infos: number;
  };
}

const METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
] as const;

export function lintOpenAPI(doc: OpenAPIDocument): LintReport {
  const issues: LintIssue[] = [];
  const ops = listOperations(doc);

  if (!doc.info.description || doc.info.description.length < 20) {
    issues.push({
      id: "info-description",
      severity: "warning",
      rule: "info-description",
      message:
        "API description is missing or very short. Add a clear overview for consumers.",
      path: "info.description",
    });
  }
  if (!doc.info.contact) {
    issues.push({
      id: "info-contact",
      severity: "info",
      rule: "info-contact",
      message: "Consider adding info.contact (name, email, or URL).",
      path: "info.contact",
    });
  }
  if (!doc.info.license) {
    issues.push({
      id: "info-license",
      severity: "info",
      rule: "info-license",
      message: "Consider adding a license object under info.license.",
      path: "info.license",
    });
  }
  if (!doc.servers?.length) {
    issues.push({
      id: "servers-missing",
      severity: "error",
      rule: "servers",
      message: "No servers defined. Add at least one server URL.",
      path: "servers",
    });
  } else {
    for (const [i, s] of doc.servers.entries()) {
      if (
        !s.url ||
        s.url.includes("example.com") ||
        s.url.includes("localhost")
      ) {
        issues.push({
          id: `server-example-${i}`,
          severity: "warning",
          rule: "servers-production",
          message: `Server "${s.url}" looks like a placeholder. Prefer real environments.`,
          path: `servers[${i}].url`,
        });
      }
    }
  }

  if (!ops.length) {
    issues.push({
      id: "no-operations",
      severity: "error",
      rule: "paths",
      message: "Document has no operations under paths.",
      path: "paths",
    });
  }

  const opIds = new Set<string>();
  for (const op of ops) {
    const loc = `${op.method.toUpperCase()} ${op.path}`;
    if (!op.operation.operationId) {
      issues.push({
        id: `opid-${op.id}`,
        severity: "warning",
        rule: "operation-operationId",
        message: `${loc}: missing operationId (helps codegen and deep links).`,
        path: `paths.${op.path}.${op.method}.operationId`,
      });
    } else if (opIds.has(op.operation.operationId)) {
      issues.push({
        id: `opid-dup-${op.operation.operationId}`,
        severity: "error",
        rule: "operation-operationId-unique",
        message: `Duplicate operationId "${op.operation.operationId}".`,
        path: `paths.${op.path}.${op.method}.operationId`,
      });
    } else {
      opIds.add(op.operation.operationId);
    }

    if (!op.operation.summary) {
      issues.push({
        id: `summary-${op.id}`,
        severity: "warning",
        rule: "operation-summary",
        message: `${loc}: missing summary.`,
        path: `paths.${op.path}.${op.method}.summary`,
      });
    }
    if (!op.operation.tags?.length) {
      issues.push({
        id: `tags-${op.id}`,
        severity: "info",
        rule: "operation-tags",
        message: `${loc}: no tags — sidebar grouping will be weaker.`,
        path: `paths.${op.path}.${op.method}.tags`,
      });
    }
    if (!op.operation.responses || !Object.keys(op.operation.responses).length) {
      issues.push({
        id: `resp-${op.id}`,
        severity: "error",
        rule: "operation-responses",
        message: `${loc}: no responses defined.`,
        path: `paths.${op.path}.${op.method}.responses`,
      });
    } else {
      const codes = Object.keys(op.operation.responses);
      const hasSuccess = codes.some(
        (c) =>
          c === "default" ||
          (parseInt(c, 10) >= 200 && parseInt(c, 10) < 300)
      );
      if (!hasSuccess) {
        issues.push({
          id: `resp-success-${op.id}`,
          severity: "warning",
          rule: "operation-success-response",
          message: `${loc}: no 2xx success response documented.`,
          path: `paths.${op.path}.${op.method}.responses`,
        });
      }
    }

    if (
      ["post", "put", "patch"].includes(op.method) &&
      !op.operation.requestBody
    ) {
      issues.push({
        id: `body-${op.id}`,
        severity: "info",
        rule: "operation-requestBody",
        message: `${loc}: ${op.method.toUpperCase()} without requestBody — intentional?`,
        path: `paths.${op.path}.${op.method}.requestBody`,
      });
    }

    for (const p of op.parameters) {
      if (p.in === "path" && !p.required) {
        issues.push({
          id: `path-req-${op.id}-${p.name}`,
          severity: "error",
          rule: "path-param-required",
          message: `${loc}: path parameter "${p.name}" must be required.`,
          path: `paths.${op.path}.${op.method}.parameters`,
        });
      }
    }

    const templateParams = [...op.path.matchAll(/\{([^}]+)\}/g)].map(
      (m) => m[1]
    );
    const declared = new Set(
      op.parameters.filter((p) => p.in === "path").map((p) => p.name)
    );
    for (const t of templateParams) {
      if (!declared.has(t)) {
        issues.push({
          id: `path-undeclared-${op.id}-${t}`,
          severity: "error",
          rule: "path-param-declared",
          message: `${loc}: path template {${t}} has no matching path parameter.`,
          path: `paths.${op.path}`,
        });
      }
    }
  }

  const usedTags = new Set(ops.flatMap((o) => o.tags));
  for (const t of doc.tags ?? []) {
    if (!usedTags.has(t.name)) {
      issues.push({
        id: `tag-unused-${t.name}`,
        severity: "info",
        rule: "tag-unused",
        message: `Tag "${t.name}" is declared but never used on an operation.`,
        path: "tags",
      });
    }
  }

  const schemes = Object.keys(doc.components?.securitySchemes ?? {});
  if (schemes.length === 0 && ops.some((o) => o.operation.security?.length)) {
    issues.push({
      id: "security-schemes-missing",
      severity: "error",
      rule: "security-schemes",
      message:
        "Operations reference security but components.securitySchemes is empty.",
      path: "components.securitySchemes",
    });
  }

  const schemas = Object.keys(doc.components?.schemas ?? {});
  if (ops.length > 5 && schemas.length === 0) {
    issues.push({
      id: "schemas-missing",
      severity: "warning",
      rule: "components-schemas",
      message: "No reusable schemas. Prefer components.schemas for DRY models.",
      path: "components.schemas",
    });
  }

  for (const [path, item] of Object.entries(doc.paths ?? {})) {
    if (!item) continue;
    const hasOp = METHODS.some((m) => !!(item as OpenAPIPathItem)[m]);
    if (!hasOp) {
      issues.push({
        id: `empty-path-${path}`,
        severity: "warning",
        rule: "path-empty",
        message: `Path "${path}" has no HTTP methods.`,
        path: `paths.${path}`,
      });
    }
  }

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const infos = issues.filter((i) => i.severity === "info").length;

  let score = 100;
  score -= errors * 12;
  score -= warnings * 4;
  score -= infos * 1;
  score = Math.max(0, Math.min(100, score));

  const grade: LintReport["grade"] =
    score >= 90
      ? "A"
      : score >= 80
        ? "B"
        : score >= 70
          ? "C"
          : score >= 50
            ? "D"
            : "F";

  return {
    score,
    grade,
    issues: issues.sort((a, b) => {
      const order = { error: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity];
    }),
    stats: {
      endpoints: ops.length,
      schemas: schemas.length,
      errors,
      warnings,
      infos,
    },
  };
}

export function tryParseAndLint(raw: string):
  | { ok: true; report: LintReport; title: string }
  | { ok: false; error: string } {
  try {
    const doc = parseOpenAPI(raw);
    return { ok: true, report: lintOpenAPI(doc), title: doc.info.title };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Parse failed",
    };
  }
}
