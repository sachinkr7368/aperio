"use client";

import { useMemo, useState } from "react";
import {
  CODE_LANGS,
  defaultBody,
  generateCode,
  type CodeLang,
} from "@/lib/openapi/codegen";
import {
  getResponseExample,
  schemaExample,
} from "@/lib/openapi/parse";
import type {
  OpenAPIDocument,
  OpenAPIParameter,
  ResolvedOperation,
} from "@/lib/openapi/types";
import { MethodBadge } from "./MethodBadge";
import { SchemaView } from "./SchemaView";
import {
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Play,
  Terminal,
} from "lucide-react";
import { clsx } from "clsx";

function paramKey(p: OpenAPIParameter) {
  return `${p.in}:${p.name}`;
}

export function OperationDetail({
  doc,
  op,
}: {
  doc: OpenAPIDocument;
  op: ResolvedOperation;
}) {
  const initialParams = useMemo(() => {
    const vals: Record<string, string> = {};
    for (const p of op.parameters) {
      const ex =
        p.example !== undefined
          ? String(p.example)
          : p.schema?.example !== undefined
            ? String(p.schema.example)
            : p.schema?.default !== undefined
              ? String(p.schema.default)
              : p.schema?.enum?.[0] !== undefined
                ? String(p.schema.enum[0])
                : "";
      vals[paramKey(p)] = ex;
    }
    return vals;
  }, [op]);

  const [paramValues, setParamValues] = useState(initialParams);
  const [body, setBody] = useState(() => defaultBody(op));
  const [lang, setLang] = useState<CodeLang>("curl");
  const [auth, setAuth] = useState("");
  const [serverOverride, setServerOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    body: string;
    timeMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"try" | "code" | "schema">("try");

  const servers = [
    ...(op.operation.servers ?? []),
    ...(doc.servers ?? []),
  ];
  const activeServer =
    serverOverride || servers[0]?.url || "https://api.example.com";

  const code = useMemo(() => {
    const docWithServer: OpenAPIDocument = {
      ...doc,
      servers: [{ url: activeServer }],
    };
    return generateCode(
      lang,
      docWithServer,
      op,
      paramValues,
      body,
      auth ? `Bearer ${auth}` : undefined
    );
  }, [lang, doc, op, paramValues, body, auth, activeServer]);

  const responseExample = getResponseExample(op.operation);

  async function sendRequest() {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      let path = op.path;
      for (const p of op.parameters.filter((x) => x.in === "path")) {
        const val = paramValues[paramKey(p)] || "";
        path = path.replace(
          new RegExp(`\\{${p.name}\\}`, "g"),
          encodeURIComponent(val)
        );
      }
      const qs = op.parameters
        .filter((x) => x.in === "query")
        .map((p) => {
          const val = paramValues[paramKey(p)];
          if (!val) return null;
          return `${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`;
        })
        .filter(Boolean);
      const url = `${activeServer.replace(/\/$/, "")}${path}${qs.length ? `?${qs.join("&")}` : ""}`;

      const headers: Record<string, string> = {};
      for (const p of op.parameters.filter((x) => x.in === "header")) {
        const val = paramValues[paramKey(p)];
        if (val) headers[p.name] = val;
      }
      if (auth) headers.Authorization = `Bearer ${auth}`;
      if (body && ["post", "put", "patch"].includes(op.method)) {
        headers["Content-Type"] = "application/json";
      }

      const start = performance.now();
      const res = await fetch(url, {
        method: op.method.toUpperCase(),
        headers,
        body:
          body && ["post", "put", "patch"].includes(op.method) ? body : undefined,
      });
      const timeMs = Math.round(performance.now() - start);
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* keep raw */
      }
      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: pretty,
        timeMs,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. If this is a CORS error, the target API must allow browser requests, or use the generated code from your backend.`
          : "Request failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const requestSchema =
    op.operation.requestBody?.content?.["application/json"]?.schema ||
    Object.values(op.operation.requestBody?.content ?? {})[0]?.schema;

  return (
    <article className="min-w-0">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <MethodBadge method={op.method} className="text-xs" />
          <code className="font-mono text-base text-zinc-100 sm:text-lg">
            {op.path}
          </code>
          {op.operation.deprecated && (
            <span className="rounded bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
              deprecated
            </span>
          )}
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {op.operation.summary || op.operation.operationId || op.path}
        </h2>
        {op.operation.description && (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {op.operation.description}
          </p>
        )}
      </div>

      <div className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {(
          [
            ["try", "Try it"],
            ["code", "Code"],
            ["schema", "Schemas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={clsx(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
              tab === id
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "try" && (
        <div className="space-y-5">
          {servers.length > 0 && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Server
              </span>
              <div className="relative">
                <select
                  value={activeServer}
                  onChange={(e) => setServerOverride(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c0e18] px-3 py-2.5 pr-10 text-sm text-zinc-200 outline-none focus:border-cyan-500/40"
                >
                  {servers.map((s) => (
                    <option key={s.url} value={s.url}>
                      {s.url}
                      {s.description ? ` — ${s.description}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Bearer token (optional)
            </span>
            <input
              value={auth}
              onChange={(e) => setAuth(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full rounded-xl border border-white/10 bg-[#0c0e18] px-3 py-2.5 font-mono text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500/40"
            />
          </label>

          {op.parameters.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Parameters
              </h3>
              <div className="space-y-3 rounded-xl border border-white/10 bg-[#0c0e18] p-3">
                {op.parameters.map((p) => (
                  <label key={paramKey(p)} className="block">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <code className="text-sm text-cyan-300">{p.name}</code>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-zinc-500">
                        {p.in}
                      </span>
                      {p.required && (
                        <span className="text-[10px] uppercase text-rose-400">
                          required
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="mb-1.5 text-xs text-zinc-500">
                        {p.description}
                      </p>
                    )}
                    {p.schema?.enum ? (
                      <select
                        value={paramValues[paramKey(p)] ?? ""}
                        onChange={(e) =>
                          setParamValues((prev) => ({
                            ...prev,
                            [paramKey(p)]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#07080f] px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500/40"
                      >
                        <option value="">—</option>
                        {p.schema.enum.map((v) => (
                          <option key={String(v)} value={String(v)}>
                            {String(v)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={paramValues[paramKey(p)] ?? ""}
                        onChange={(e) =>
                          setParamValues((prev) => ({
                            ...prev,
                            [paramKey(p)]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#07080f] px-3 py-2 font-mono text-sm text-zinc-200 outline-none focus:border-cyan-500/40"
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {op.operation.requestBody && (
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Request body
              </h3>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                spellCheck={false}
                className="w-full resize-y rounded-xl border border-white/10 bg-[#0c0e18] p-3 font-mono text-[13px] leading-relaxed text-zinc-200 outline-none focus:border-cyan-500/40"
              />
            </div>
          )}

          <button
            type="button"
            onClick={sendRequest}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Send request
          </button>

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {response && (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm">
                <span
                  className={clsx(
                    "font-mono font-semibold",
                    response.status < 300
                      ? "text-emerald-400"
                      : response.status < 400
                        ? "text-amber-400"
                        : "text-rose-400"
                  )}
                >
                  {response.status} {response.statusText}
                </span>
                <span className="text-zinc-500">{response.timeMs} ms</span>
              </div>
              <pre className="max-h-96 overflow-auto bg-[#0c0e18] p-4 font-mono text-[12px] leading-relaxed text-zinc-300">
                {response.body || "(empty body)"}
              </pre>
            </div>
          )}

          {!response && !error && responseExample && (
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Example response
              </h3>
              <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-[#0c0e18] p-4 font-mono text-[12px] leading-relaxed text-zinc-400">
                {responseExample}
              </pre>
            </div>
          )}
        </div>
      )}

      {tab === "code" && (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {CODE_LANGS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={clsx(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    lang === l.id
                      ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-500">
              <Terminal className="h-3.5 w-3.5" />
              {CODE_LANGS.find((l) => l.id === lang)?.label}
            </div>
            <pre className="overflow-x-auto bg-[#0c0e18] p-4 font-mono text-[12px] leading-relaxed text-zinc-300">
              {code}
            </pre>
          </div>
        </div>
      )}

      {tab === "schema" && (
        <div className="space-y-6">
          {op.parameters.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-300">
                Parameters
              </h3>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">In</th>
                      <th className="px-3 py-2 font-medium">Type</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {op.parameters.map((p) => (
                      <tr
                        key={paramKey(p)}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-3 py-2 font-mono text-cyan-300">
                          {p.name}
                          {p.required && (
                            <span className="ml-1 text-rose-400">*</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-zinc-400">{p.in}</td>
                        <td className="px-3 py-2 font-mono text-violet-300/80">
                          {Array.isArray(p.schema?.type)
                            ? p.schema?.type.join("|")
                            : p.schema?.type || "—"}
                        </td>
                        <td className="px-3 py-2 text-zinc-500">
                          {p.description || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {requestSchema && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-300">
                Request body
              </h3>
              <SchemaView schema={requestSchema} />
              <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-[#0c0e18] p-3 font-mono text-[12px] text-zinc-400">
                {JSON.stringify(schemaExample(requestSchema), null, 2)}
              </pre>
            </div>
          )}

          {op.operation.responses && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-300">
                Responses
              </h3>
              <div className="space-y-3">
                {Object.entries(op.operation.responses).map(
                  ([status, res]) => {
                    const schema =
                      res.content?.["application/json"]?.schema ||
                      Object.values(res.content ?? {})[0]?.schema;
                    return (
                      <div
                        key={status}
                        className="rounded-xl border border-white/10 p-3"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-emerald-400">
                            {status}
                          </span>
                          <span className="text-sm text-zinc-400">
                            {res.description}
                          </span>
                        </div>
                        {schema && <SchemaView schema={schema} title="Body" />}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
