"use client";

import type { OpenAPISchema } from "@/lib/openapi/types";
import { schemaExample } from "@/lib/openapi/parse";
import { clsx } from "clsx";
import { useState } from "react";
import { IconChevronRight, IconCopy, IconCheck } from "@/components/icons";

function typeLabel(schema?: OpenAPISchema): string {
  if (!schema) return "any";
  if (schema.enum) return "enum";
  if (schema.$ref) return schema.$ref.split("/").pop() || "ref";
  const t = Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type;
  if (t === "array" && schema.items) return `array<${typeLabel(schema.items)}>`;
  return t || (schema.properties ? "object" : "any");
}

function SchemaRow({
  name,
  schema,
  required,
  depth = 0,
}: {
  name: string;
  schema: OpenAPISchema;
  required?: boolean;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren =
    !!schema.properties ||
    schema.type === "object" ||
    (schema.type === "array" && !!schema.items?.properties) ||
    !!schema.allOf?.length ||
    !!schema.oneOf?.length;

  return (
    <div className="border-b border-[var(--border-subtle)] last:border-0">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        className={clsx(
          "flex w-full items-start gap-2 px-3 py-2 text-left text-sm",
          hasChildren ? "cursor-pointer hover:bg-[var(--bg-hover)]" : "cursor-default"
        )}
        style={{ paddingLeft: 12 + depth * 14 }}
      >
        {hasChildren ? (
          <IconChevronRight
            size={14}
            className={clsx(
              "mt-0.5 shrink-0 text-[var(--text-dim)] transition",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="mt-0.5 w-3.5 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-[13px] text-[#93c5fd]">{name}</code>
            <span className="font-mono text-[11px] text-[#c4b5fd]">
              {typeLabel(schema)}
            </span>
            {required && (
              <span className="text-[10px] font-semibold uppercase text-[#f87171]">
                required
              </span>
            )}
            {schema.nullable && (
              <span className="text-[10px] text-[var(--text-dim)]">nullable</span>
            )}
            {schema.readOnly && (
              <span className="text-[10px] text-[var(--text-dim)]">readOnly</span>
            )}
            {schema.writeOnly && (
              <span className="text-[10px] text-[var(--text-dim)]">writeOnly</span>
            )}
            {schema.deprecated && (
              <span className="text-[10px] text-amber-500">deprecated</span>
            )}
            {schema.format && (
              <span className="text-[11px] text-[var(--text-dim)]">
                {schema.format}
              </span>
            )}
          </div>
          {schema.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-dim)]">
              {schema.description}
            </p>
          )}
          {schema.enum && (
            <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
              {schema.enum.map(String).join(" · ")}
            </p>
          )}
          {(schema.minimum != null ||
            schema.maximum != null ||
            schema.minLength != null ||
            schema.pattern) && (
            <p className="mt-0.5 font-mono text-[10px] text-[var(--text-dim)]">
              {[
                schema.minimum != null && `min: ${schema.minimum}`,
                schema.maximum != null && `max: ${schema.maximum}`,
                schema.minLength != null && `minLength: ${schema.minLength}`,
                schema.maxLength != null && `maxLength: ${schema.maxLength}`,
                schema.pattern && `pattern: ${schema.pattern}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </button>
      {open && schema.properties && (
        <div>
          {Object.entries(schema.properties).map(([key, prop]) => (
            <SchemaRow
              key={key}
              name={key}
              schema={prop}
              required={schema.required?.includes(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      {open && schema.type === "array" && schema.items?.properties && (
        <div>
          {Object.entries(schema.items.properties).map(([key, prop]) => (
            <SchemaRow
              key={key}
              name={key}
              schema={prop}
              required={schema.items?.required?.includes(key)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SchemaView({
  schema,
  title = "Schema",
  showExample = false,
}: {
  schema?: OpenAPISchema;
  title?: string;
  showExample?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  if (!schema) {
    return <p className="text-sm text-[var(--text-dim)]">No schema defined.</p>;
  }

  const example = showExample
    ? JSON.stringify(schemaExample(schema), null, 2)
    : null;

  async function copyExample() {
    if (!example) return;
    await navigator.clipboard.writeText(example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="space-y-3">
      {schema.properties ? (
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-input)]">
          <div className="border-b border-[var(--border-subtle)] px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[var(--text-dim)]">
            {title}
          </div>
          {Object.entries(schema.properties).map(([key, prop]) => (
            <SchemaRow
              key={key}
              name={key}
              schema={prop}
              required={schema.required?.includes(key)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-3 text-sm">
          <code className="text-[#c4b5fd]">{typeLabel(schema)}</code>
          {schema.description && (
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              {schema.description}
            </p>
          )}
        </div>
      )}
      {example && (
        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-panel)] px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Example
            </span>
            <button
              type="button"
              onClick={copyExample}
              className="text-[var(--text-dim)] hover:text-[var(--text)]"
            >
              {copied ? (
                <IconCheck size={12} className="text-[#22c55e]" />
              ) : (
                <IconCopy size={12} />
              )}
            </button>
          </div>
          <pre className="max-h-48 overflow-auto bg-[var(--bg-input)] p-3 font-mono text-[11px] text-[var(--text-muted)]">
            {example}
          </pre>
        </div>
      )}
    </div>
  );
}
