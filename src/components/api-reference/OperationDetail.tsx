"use client";

import { useMemo, useState } from "react";
import {
  CODE_LANGS,
  defaultBody,
  generateCode,
  type CodeLang,
} from "@/lib/openapi/codegen";
import { getResponseExample, schemaExample } from "@/lib/openapi/parse";
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
  KeyRound,
  Loader2,
  Play,
  Terminal,
} from "lucide-react";
import { clsx } from "clsx";

function paramKey(p: OpenAPIParameter) {
  return `${p.in}:${p.name}`;
}

export type AuthMode = "none" | "bearer" | "apikey" | "basic";

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
  const [authMode, setAuthMode] = useState<AuthMode>("none");
  const [authToken, setAuthToken] = useState("");
  const [apiKeyName, setApiKeyName] = useState("X-API-Key");
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");
  const [serverOverride, setServerOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    body: string;
    headers: string;
    timeMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [clientTab, setClientTab] = useState<"request" | "code">("request");

  const servers = [
    ...(op.operation.servers ?? []),
    ...(doc.servers ?? []),
  ];
  // dedupe by url
  const uniqueServers = Array.from(
    new Map(servers.map((s) => [s.url, s])).values()
  );
  const activeServer =
    serverOverride || uniqueServers[0]?.url || "https://api.example.com";

  function buildAuthHeader():
    | { header?: Record<string, string>; authHeader?: string }
    | null {
    if (authMode === "bearer" && authToken) {
      return { authHeader: `Bearer ${authToken}` };
    }
    if (authMode === "apikey" && apiKeyValue) {
      return { header: { [apiKeyName || "X-API-Key"]: apiKeyValue } };
    }
    if (authMode === "basic" && (basicUser || basicPass)) {
      const encoded =
        typeof btoa !== "undefined"
          ? btoa(`${basicUser}:${basicPass}`)
          : "";
      return { authHeader: `Basic ${encoded}` };
    }
    return null;
  }

  const code = useMemo(() => {
    const auth = (() => {
      if (authMode === "bearer" && authToken) {
        return { authHeader: `Bearer ${authToken}` as string | undefined, header: {} as Record<string, string> };
      }
      if (authMode === "apikey" && apiKeyValue) {
        return {
          authHeader: undefined as string | undefined,
          header: { [apiKeyName || "X-API-Key"]: apiKeyValue } as Record<string, string>,
        };
      }
      if (authMode === "basic" && (basicUser || basicPass)) {
        const encoded =
          typeof btoa !== "undefined" ? btoa(`${basicUser}:${basicPass}`) : "";
        return {
          authHeader: `Basic ${encoded}` as string | undefined,
          header: {} as Record<string, string>,
        };
      }
      return { authHeader: undefined as string | undefined, header: {} as Record<string, string> };
    })();

    const docWithServer: OpenAPIDocument = {
      ...doc,
      servers: [{ url: activeServer }],
    };
    const mergedParams = { ...paramValues };
    for (const [k, v] of Object.entries(auth.header)) {
      mergedParams[`header:${k}`] = v;
    }
    return generateCode(
      lang,
      docWithServer,
      op,
      mergedParams,
      body,
      auth.authHeader
    );
  }, [
    lang,
    doc,
    op,
    paramValues,
    body,
    activeServer,
    authMode,
    authToken,
    apiKeyName,
    apiKeyValue,
    basicUser,
    basicPass,
  ]);

  const responseExample = getResponseExample(op.operation);
  const requestSchema =
    op.operation.requestBody?.content?.["application/json"]?.schema ||
    Object.values(op.operation.requestBody?.content ?? {})[0]?.schema;

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

      const authNow = buildAuthHeader();
      const headers: Record<string, string> = { ...(authNow?.header ?? {}) };
      for (const p of op.parameters.filter((x) => x.in === "header")) {
        const val = paramValues[paramKey(p)];
        if (val) headers[p.name] = val;
      }
      if (authNow?.authHeader) headers.Authorization = authNow.authHeader;
      if (body && ["post", "put", "patch"].includes(op.method)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
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
      const headerLines: string[] = [];
      res.headers.forEach((v, k) => headerLines.push(`${k}: ${v}`));
      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: pretty,
        headers: headerLines.join("\n"),
        timeMs,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. If this is CORS, the API must allow browser origins — use Code samples from a backend instead.`
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

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      {/* LEFT: documentation */}
      <div className="min-w-0 overflow-y-auto border-b border-[var(--border)] px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <MethodBadge method={op.method} />
          <code className="break-all font-mono text-[15px] text-zinc-100 sm:text-base">
            {op.path}
          </code>
          {op.operation.deprecated && (
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
              deprecated
            </span>
          )}
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {op.operation.summary || op.operation.operationId || op.path}
        </h2>
        {op.operation.operationId && (
          <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">
            {op.operation.operationId}
          </p>
        )}
        {op.operation.description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
            {op.operation.description}
          </p>
        )}

        {/* Parameters table */}
        {op.parameters.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Parameters
            </h3>
            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-panel)] text-[11px] uppercase tracking-wider text-[var(--text-dim)]">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Name</th>
                    <th className="px-3 py-2.5 font-medium">In</th>
                    <th className="px-3 py-2.5 font-medium">Type</th>
                    <th className="px-3 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {op.parameters.map((p) => (
                    <tr
                      key={paramKey(p)}
                      className="border-b border-[var(--border-subtle)] last:border-0"
                    >
                      <td className="px-3 py-2.5 font-mono text-[13px] text-[#93c5fd]">
                        {p.name}
                        {p.required && (
                          <span className="ml-1 text-[#f87171]">*</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text-muted)]">
                        {p.in}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] text-[#a78bfa]">
                        {Array.isArray(p.schema?.type)
                          ? p.schema?.type.join("|")
                          : p.schema?.type || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text-dim)]">
                        {p.description || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Request body schema */}
        {requestSchema && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Request body
              {op.operation.requestBody?.required && (
                <span className="ml-2 normal-case text-[#f87171]">required</span>
              )}
            </h3>
            {op.operation.requestBody?.description && (
              <p className="mb-2 text-sm text-[var(--text-muted)]">
                {op.operation.requestBody.description}
              </p>
            )}
            <SchemaView schema={requestSchema} />
          </section>
        )}

        {/* Responses */}
        {op.operation.responses && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Responses
            </h3>
            <div className="space-y-3">
              {Object.entries(op.operation.responses).map(([status, res]) => {
                const schema =
                  res.content?.["application/json"]?.schema ||
                  Object.values(res.content ?? {})[0]?.schema;
                const statusNum = parseInt(status, 10);
                const statusColor =
                  statusNum < 300
                    ? "text-[#22c55e]"
                    : statusNum < 400
                      ? "text-[#f59e0b]"
                      : status === "default"
                        ? "text-[var(--text-muted)]"
                        : "text-[#ef4444]";
                return (
                  <div
                    key={status}
                    className="rounded-lg border border-[var(--border)] p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={clsx("font-mono text-sm font-semibold", statusColor)}>
                        {status}
                      </span>
                      <span className="text-sm text-[var(--text-muted)]">
                        {res.description}
                      </span>
                    </div>
                    {schema && <SchemaView schema={schema} title="Body schema" />}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {responseExample && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Example response
            </h3>
            <pre className="max-h-64 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-[var(--text-muted)]">
              {responseExample}
            </pre>
          </section>
        )}
      </div>

      {/* RIGHT: client panel (always visible like Scalar) */}
      <div className="flex min-h-0 flex-col bg-[var(--bg-elevated)] lg:max-h-full lg:overflow-y-auto">
        <div className="flex border-b border-[var(--border)]">
          {(
            [
              ["request", "Test Request"],
              ["code", "Code Samples"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setClientTab(id)}
              className={clsx(
                "flex-1 px-3 py-3 text-sm font-medium transition",
                clientTab === id
                  ? "border-b-2 border-[#2563eb] text-white"
                  : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 p-4">
          {clientTab === "request" && (
            <>
              {/* Server */}
              {uniqueServers.length > 0 && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Server
                  </span>
                  <div className="relative">
                    <select
                      value={activeServer}
                      onChange={(e) => setServerOverride(e.target.value)}
                      className="w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 pr-9 text-sm text-zinc-200 outline-none focus:border-[#2563eb]"
                    >
                      {uniqueServers.map((s) => (
                        <option key={s.url} value={s.url}>
                          {s.url}
                          {s.description ? ` — ${s.description}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" />
                  </div>
                </label>
              )}

              {/* Auth for API calls only — Aperio itself stays free */}
              <div>
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  <KeyRound className="h-3.5 w-3.5" />
                  Authentication
                </span>
                <div className="mb-2 flex flex-wrap gap-1">
                  {(
                    [
                      ["none", "None"],
                      ["bearer", "Bearer"],
                      ["apikey", "API Key"],
                      ["basic", "Basic"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAuthMode(id)}
                      className={clsx(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition",
                        authMode === id
                          ? "bg-[#2563eb] text-white"
                          : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-white"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {authMode === "bearer" && (
                  <input
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    placeholder="Token"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-mono text-sm outline-none focus:border-[#2563eb]"
                  />
                )}
                {authMode === "apikey" && (
                  <div className="flex gap-2">
                    <input
                      value={apiKeyName}
                      onChange={(e) => setApiKeyName(e.target.value)}
                      placeholder="Header name"
                      className="w-1/3 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-2 font-mono text-xs outline-none focus:border-[#2563eb]"
                    />
                    <input
                      value={apiKeyValue}
                      onChange={(e) => setApiKeyValue(e.target.value)}
                      placeholder="Key value"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-mono text-sm outline-none focus:border-[#2563eb]"
                    />
                  </div>
                )}
                {authMode === "basic" && (
                  <div className="flex gap-2">
                    <input
                      value={basicUser}
                      onChange={(e) => setBasicUser(e.target.value)}
                      placeholder="Username"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                    />
                    <input
                      type="password"
                      value={basicPass}
                      onChange={(e) => setBasicPass(e.target.value)}
                      placeholder="Password"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                    />
                  </div>
                )}
              </div>

              {/* Params */}
              {op.parameters.length > 0 && (
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Parameters
                  </span>
                  <div className="space-y-2.5">
                    {op.parameters.map((p) => (
                      <label key={paramKey(p)} className="block">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <code className="text-[12px] text-[#93c5fd]">
                            {p.name}
                          </code>
                          <span className="rounded bg-white/5 px-1 py-0.5 text-[10px] uppercase text-[var(--text-dim)]">
                            {p.in}
                          </span>
                          {p.required && (
                            <span className="text-[10px] text-[#f87171]">*</span>
                          )}
                        </div>
                        {p.schema?.enum ? (
                          <select
                            value={paramValues[paramKey(p)] ?? ""}
                            onChange={(e) =>
                              setParamValues((prev) => ({
                                ...prev,
                                [paramKey(p)]: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
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
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-mono text-sm outline-none focus:border-[#2563eb]"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {op.operation.requestBody && (
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Body
                  </span>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    spellCheck={false}
                    className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed outline-none focus:border-[#2563eb]"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={sendRequest}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Send
              </button>

              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
                  {error}
                </div>
              )}

              {response && (
                <div className="overflow-hidden rounded-md border border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2 text-sm">
                    <span
                      className={clsx(
                        "font-mono font-semibold",
                        response.status < 300
                          ? "text-[#22c55e]"
                          : response.status < 400
                            ? "text-[#f59e0b]"
                            : "text-[#ef4444]"
                      )}
                    >
                      {response.status} {response.statusText}
                    </span>
                    <span className="text-[var(--text-dim)]">
                      {response.timeMs} ms
                    </span>
                  </div>
                  {response.headers && (
                    <pre className="max-h-24 overflow-auto border-b border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 font-mono text-[10px] text-[var(--text-dim)]">
                      {response.headers}
                    </pre>
                  )}
                  <pre className="max-h-72 overflow-auto bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-zinc-300">
                    {response.body || "(empty body)"}
                  </pre>
                </div>
              )}
            </>
          )}

          {clientTab === "code" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {CODE_LANGS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLang(l.id)}
                      className={clsx(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition",
                        lang === l.id
                          ? "bg-[#2563eb] text-white"
                          : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-white"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)] hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="overflow-hidden rounded-md border border-[var(--border)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2 text-xs text-[var(--text-dim)]">
                  <Terminal className="h-3.5 w-3.5" />
                  {CODE_LANGS.find((l) => l.id === lang)?.label}
                </div>
                <pre className="overflow-x-auto bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-zinc-300">
                  {code}
                </pre>
              </div>
              {requestSchema && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Body example
                  </p>
                  <pre className="overflow-auto rounded-md border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[11px] text-[var(--text-muted)]">
                    {JSON.stringify(schemaExample(requestSchema), null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
