"use client";

import type { OpenAPISchema } from "@/lib/openapi/types";
import { clsx } from "clsx";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

function typeLabel(schema?: OpenAPISchema): string {
  if (!schema) return "any";
  if (schema.enum) return "enum";
  if (schema.$ref) return schema.$ref.split("/").pop() || "ref";
  const t = Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type;
  if (t === "array" && schema.items) {
    return `array<${typeLabel(schema.items)}>`;
  }
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
    (schema.type === "array" && schema.items?.properties);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        className={clsx(
          "flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm",
          hasChildren ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-default"
        )}
        style={{ paddingLeft: 12 + depth * 16 }}
      >
        {hasChildren ? (
          <ChevronRight
            className={clsx(
              "mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500 transition",
              open && "rotate-90"
            )}
          />
        ) : (
          <span className="mt-0.5 w-3.5 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-[13px] text-cyan-300">{name}</code>
            <span className="font-mono text-[11px] text-violet-300/80">
              {typeLabel(schema)}
            </span>
            {required && (
              <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-rose-300">
                required
              </span>
            )}
            {schema.format && (
              <span className="text-[11px] text-zinc-500">{schema.format}</span>
            )}
          </div>
          {schema.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
              {schema.description}
            </p>
          )}
          {schema.enum && (
            <p className="mt-1 font-mono text-[11px] text-zinc-400">
              enum: {schema.enum.map(String).join(" | ")}
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
}: {
  schema?: OpenAPISchema;
  title?: string;
}) {
  if (!schema) {
    return (
      <p className="text-sm text-zinc-500">No schema defined for this content.</p>
    );
  }

  if (schema.properties) {
    return (
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0e18]">
        <div className="border-b border-white/5 px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
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
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#0c0e18] px-3 py-3 text-sm">
      <code className="text-violet-300">{typeLabel(schema)}</code>
      {schema.description && (
        <p className="mt-1 text-xs text-zinc-500">{schema.description}</p>
      )}
    </div>
  );
}
