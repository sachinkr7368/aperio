"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Markdown } from "@/components/Markdown";
import { useClientStore } from "@/lib/client-store";
import {
  IconBraces,
  IconCheck,
  IconChevronDown,
  IconCopy,
  IconHistory,
  IconKey,
  IconPlay,
  IconRefresh,
  IconServer,
  IconSettings,
  IconTerminal,
  IconTrash,
} from "@/components/icons";
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
  const {
    auth,
    setAuth,
    serverUrl,
    setServerUrl,
    env,
    setEnv,
    history,
    pushHistory,
    clearHistory,
    applyEnv,
  } = useClientStore();

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
  const [clientTab, setClientTab] = useState<
    "request" | "code" | "env" | "history"
  >("request");
  const [contentType, setContentType] = useState("application/json");
  const [serverVars, setServerVars] = useState<Record<string, string>>({});

  useEffect(() => {
    setParamValues(initialParams);
    setBody(defaultBody(op));
    setResponse(null);
    setError(null);
  }, [op.id, initialParams]);

  const servers = useMemo(() => {
    const list = [
      ...(op.operation.servers ?? []),
      ...(doc.servers ?? []),
    ];
    return Array.from(new Map(list.map((s) => [s.url, s])).values());
  }, [doc, op]);

  const selectedServerObj =
    servers.find((s) => s.url === serverUrl) || servers[0];
  const rawServer =
    serverUrl || selectedServerObj?.url || "https://api.example.com";

  const resolvedServer = useMemo(() => {
    let url = rawServer;
    const vars = selectedServerObj?.variables ?? {};
    for (const [name, def] of Object.entries(vars)) {
      const val = serverVars[name] ?? def.default;
      url = url.replaceAll(`{${name}}`, val);
    }
    return applyEnv(url).replace(/\/$/, "");
  }, [rawServer, selectedServerObj, serverVars, applyEnv]);

  useEffect(() => {
    if (!serverUrl && servers[0]?.url) {
      setServerUrl(servers[0].url);
    }
  }, [servers, serverUrl, setServerUrl]);

  useEffect(() => {
    const vars = selectedServerObj?.variables ?? {};
    setServerVars((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(vars)) {
        if (next[k] === undefined) next[k] = v.default;
      }
      return next;
    });
  }, [selectedServerObj]);

  const contentTypes = Object.keys(op.operation.requestBody?.content ?? {});
  useEffect(() => {
    if (contentTypes.length && !contentTypes.includes(contentType)) {
      setContentType(contentTypes[0]);
    }
  }, [contentTypes, contentType]);

  function buildAuthParts(): {
    authHeader?: string;
    extraHeaders: Record<string, string>;
    extraQuery: Record<string, string>;
  } {
    if (auth.mode === "bearer" && auth.bearer) {
      return {
        authHeader: `Bearer ${applyEnv(auth.bearer)}`,
        extraHeaders: {},
        extraQuery: {},
      };
    }
    if (auth.mode === "apikey" && auth.apiKeyValue) {
      const val = applyEnv(auth.apiKeyValue);
      if (auth.apiKeyIn === "query") {
        return {
          extraHeaders: {},
          extraQuery: { [auth.apiKeyName || "api_key"]: val },
        };
      }
      return {
        extraHeaders: { [auth.apiKeyName || "X-API-Key"]: val },
        extraQuery: {},
      };
    }
    if (auth.mode === "basic" && (auth.basicUser || auth.basicPass)) {
      const encoded =
        typeof btoa !== "undefined"
          ? btoa(`${auth.basicUser}:${auth.basicPass}`)
          : "";
      return {
        authHeader: `Basic ${encoded}`,
        extraHeaders: {},
        extraQuery: {},
      };
    }
    return { extraHeaders: {}, extraQuery: {} };
  }

  const code = useMemo(() => {
    const { authHeader, extraHeaders, extraQuery } = buildAuthParts();
    const docWithServer: OpenAPIDocument = {
      ...doc,
      servers: [{ url: resolvedServer }],
    };
    const mergedParams = { ...paramValues };
    for (const [k, v] of Object.entries(extraHeaders)) {
      mergedParams[`header:${k}`] = v;
    }
    for (const [k, v] of Object.entries(extraQuery)) {
      mergedParams[`query:${k}`] = v;
    }
    return generateCode(
      lang,
      docWithServer,
      op,
      mergedParams,
      applyEnv(body),
      authHeader
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, doc, op, paramValues, body, resolvedServer, auth, applyEnv]);

  const responseExample = getResponseExample(op.operation);
  const requestSchema =
    op.operation.requestBody?.content?.[contentType]?.schema ||
    Object.values(op.operation.requestBody?.content ?? {})[0]?.schema;

  function prettifyBody() {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      /* ignore */
    }
  }

  async function sendRequest() {
    setLoading(true);
    setError(null);
    setResponse(null);
    const { authHeader, extraHeaders, extraQuery } = buildAuthParts();
    try {
      let path = op.path;
      for (const p of op.parameters.filter((x) => x.in === "path")) {
        const val = applyEnv(paramValues[paramKey(p)] || "");
        path = path.replace(
          new RegExp(`\\{${p.name}\\}`, "g"),
          encodeURIComponent(val)
        );
      }
      const qsMap: Record<string, string> = { ...extraQuery };
      for (const p of op.parameters.filter((x) => x.in === "query")) {
        const val = applyEnv(paramValues[paramKey(p)] || "");
        if (val) qsMap[p.name] = val;
      }
      const qs = Object.entries(qsMap)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
      const url = `${resolvedServer}${path}${qs ? `?${qs}` : ""}`;

      const headers: Record<string, string> = { ...extraHeaders };
      for (const p of op.parameters.filter((x) => x.in === "header")) {
        const val = applyEnv(paramValues[paramKey(p)] || "");
        if (val) headers[p.name] = val;
      }
      if (authHeader) headers.Authorization = authHeader;
      const finalBody = applyEnv(body);
      if (finalBody && ["post", "put", "patch"].includes(op.method)) {
        headers["Content-Type"] = headers["Content-Type"] || contentType;
      }

      // cookies
      for (const p of op.parameters.filter((x) => x.in === "cookie")) {
        const val = applyEnv(paramValues[paramKey(p)] || "");
        if (val) {
          headers.Cookie = headers.Cookie
            ? `${headers.Cookie}; ${p.name}=${val}`
            : `${p.name}=${val}`;
        }
      }

      const start = performance.now();
      const res = await fetch(url, {
        method: op.method.toUpperCase(),
        headers,
        body:
          finalBody && ["post", "put", "patch"].includes(op.method)
            ? finalBody
            : undefined,
      });
      const timeMs = Math.round(performance.now() - start);
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* keep */
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
      pushHistory({
        method: op.method.toUpperCase(),
        url,
        status: res.status,
        timeMs,
        ok: res.ok,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? `${err.message}. CORS may block browser requests — use Code samples from a server instead.`
          : "Request failed";
      setError(message);
      pushHistory({
        method: op.method.toUpperCase(),
        url: resolvedServer + op.path,
        error: message,
        ok: false,
      });
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
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
      {/* Docs */}
      <div className="min-w-0 overflow-y-auto border-b border-[var(--border)] px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <MethodBadge method={op.method} />
          <code className="break-all font-mono text-[15px] sm:text-base">
            {op.path}
          </code>
          {op.operation.deprecated && (
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
              deprecated
            </span>
          )}
          {op.operation.security && (
            <span className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--text-dim)]">
              <IconKey size={12} /> Auth required
            </span>
          )}
        </div>

        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {op.operation.summary || op.operation.operationId || op.path}
        </h2>
        {op.operation.operationId && (
          <p className="mt-1 font-mono text-xs text-[var(--text-dim)]">
            {op.operation.operationId}
          </p>
        )}
        {op.operation.description && (
          <Markdown
            content={op.operation.description}
            className="mt-3 max-w-2xl"
          />
        )}

        {op.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {op.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        )}

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
                      <td className="px-3 py-2.5 font-mono text-[13px] text-[#60a5fa]">
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

        {requestSchema && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
              Request body
              {op.operation.requestBody?.required && (
                <span className="ml-2 normal-case text-[#f87171]">required</span>
              )}
            </h3>
            {contentTypes.length > 1 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {contentTypes.map((ct) => (
                  <span
                    key={ct}
                    className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-dim)]"
                  >
                    {ct}
                  </span>
                ))}
              </div>
            )}
            <SchemaView schema={requestSchema} />
          </section>
        )}

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
                      <span
                        className={clsx(
                          "font-mono text-sm font-semibold",
                          statusColor
                        )}
                      >
                        {status}
                      </span>
                      <span className="text-sm text-[var(--text-muted)]">
                        {res.description}
                      </span>
                    </div>
                    {schema && (
                      <SchemaView schema={schema} title="Body schema" />
                    )}
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

      {/* Client */}
      <div className="flex min-h-0 flex-col bg-[var(--bg-elevated)] lg:max-h-full lg:overflow-y-auto">
        <div className="flex border-b border-[var(--border)]">
          {(
            [
              ["request", "Request", IconPlay],
              ["code", "Code", IconTerminal],
              ["env", "Env", IconSettings],
              ["history", "History", IconHistory],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setClientTab(id)}
              className={clsx(
                "flex flex-1 items-center justify-center gap-1.5 px-1 py-3 text-xs font-medium transition sm:text-sm",
                clientTab === id
                  ? "border-b-2 border-[#2563eb] text-[var(--text)]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-muted)]"
              )}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4 p-4">
          {clientTab === "request" && (
            <>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  <IconServer size={12} /> Server
                </span>
                <div className="relative">
                  <select
                    value={rawServer}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 pr-9 text-sm outline-none focus:border-[#2563eb]"
                  >
                    {servers.length === 0 && (
                      <option value={rawServer}>{rawServer}</option>
                    )}
                    {servers.map((s) => (
                      <option key={s.url} value={s.url}>
                        {s.url}
                        {s.description ? ` — ${s.description}` : ""}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
                  />
                </div>
                {selectedServerObj?.variables &&
                  Object.keys(selectedServerObj.variables).length > 0 && (
                    <div className="mt-2 space-y-2">
                      {Object.entries(selectedServerObj.variables).map(
                        ([name, def]) => (
                          <label key={name} className="block">
                            <span className="mb-1 block font-mono text-[11px] text-[#60a5fa]">
                              {"{" + name + "}"}
                            </span>
                            {def.enum ? (
                              <select
                                value={serverVars[name] ?? def.default}
                                onChange={(e) =>
                                  setServerVars((v) => ({
                                    ...v,
                                    [name]: e.target.value,
                                  }))
                                }
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 text-sm"
                              >
                                {def.enum.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={serverVars[name] ?? def.default}
                                onChange={(e) =>
                                  setServerVars((v) => ({
                                    ...v,
                                    [name]: e.target.value,
                                  }))
                                }
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1.5 font-mono text-sm"
                              />
                            )}
                          </label>
                        )
                      )}
                    </div>
                  )}
                <p className="mt-1 truncate font-mono text-[10px] text-[var(--text-dim)]">
                  → {resolvedServer}
                </p>
              </label>

              <div>
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                  <IconKey size={12} /> API Authentication
                </span>
                <p className="mb-2 text-[11px] text-[var(--text-dim)]">
                  Optional — for calling protected APIs only. Aperio itself never
                  requires signup.
                </p>
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
                      onClick={() => setAuth({ mode: id })}
                      className={clsx(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition",
                        auth.mode === id
                          ? "bg-[#2563eb] text-white"
                          : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text)]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {auth.mode === "bearer" && (
                  <input
                    value={auth.bearer}
                    onChange={(e) => setAuth({ bearer: e.target.value })}
                    placeholder="Token or {{TOKEN}}"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-mono text-sm outline-none focus:border-[#2563eb]"
                  />
                )}
                {auth.mode === "apikey" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={auth.apiKeyName}
                        onChange={(e) => setAuth({ apiKeyName: e.target.value })}
                        className="w-1/3 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-2 font-mono text-xs"
                      />
                      <input
                        value={auth.apiKeyValue}
                        onChange={(e) =>
                          setAuth({ apiKeyValue: e.target.value })
                        }
                        placeholder="Key value"
                        className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-1">
                      {(["header", "query"] as const).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setAuth({ apiKeyIn: loc })}
                          className={clsx(
                            "rounded px-2 py-0.5 text-[11px]",
                            auth.apiKeyIn === loc
                              ? "bg-[#2563eb]/15 text-[#60a5fa]"
                              : "text-[var(--text-dim)]"
                          )}
                        >
                          In {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {auth.mode === "basic" && (
                  <div className="flex gap-2">
                    <input
                      value={auth.basicUser}
                      onChange={(e) => setAuth({ basicUser: e.target.value })}
                      placeholder="Username"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm"
                    />
                    <input
                      type="password"
                      value={auth.basicPass}
                      onChange={(e) => setAuth({ basicPass: e.target.value })}
                      placeholder="Password"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              {op.parameters.length > 0 && (
                <div>
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Parameters
                  </span>
                  <div className="space-y-2.5">
                    {op.parameters.map((p) => (
                      <label key={paramKey(p)} className="block">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <code className="text-[12px] text-[#60a5fa]">
                            {p.name}
                          </code>
                          <span className="rounded bg-[var(--bg-panel)] px-1 py-0.5 text-[10px] uppercase text-[var(--text-dim)]">
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
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                      Body
                    </span>
                    <div className="flex items-center gap-2">
                      {contentTypes.length > 0 && (
                        <select
                          value={contentType}
                          onChange={(e) => setContentType(e.target.value)}
                          className="rounded border border-[var(--border)] bg-[var(--bg-input)] px-1.5 py-0.5 text-[10px]"
                        >
                          {contentTypes.map((ct) => (
                            <option key={ct} value={ct}>
                              {ct}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={prettifyBody}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--text-dim)] hover:text-[var(--text)]"
                      >
                        <IconBraces size={12} /> Pretty
                      </button>
                    </div>
                  </div>
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
                  <IconRefresh size={16} className="aperio-spin" />
                ) : (
                  <IconPlay size={16} />
                )}
                Send request
              </button>

              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
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
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(response.body)
                      }
                      className="ml-auto text-[var(--text-dim)] hover:text-[var(--text)]"
                      title="Copy body"
                    >
                      <IconCopy size={14} />
                    </button>
                  </div>
                  {response.headers && (
                    <pre className="max-h-24 overflow-auto border-b border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 font-mono text-[10px] text-[var(--text-dim)]">
                      {response.headers}
                    </pre>
                  )}
                  <pre className="max-h-72 overflow-auto bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-[var(--text-muted)]">
                    {response.body || "(empty body)"}
                  </pre>
                </div>
              )}
            </>
          )}

          {clientTab === "code" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex max-w-full flex-wrap gap-1">
                  {CODE_LANGS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLang(l.id)}
                      className={clsx(
                        "rounded-md px-2 py-1 text-[11px] font-medium transition",
                        lang === l.id
                          ? "bg-[#2563eb] text-white"
                          : "bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text)]"
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {copied ? (
                    <IconCheck size={14} className="text-[#22c55e]" />
                  ) : (
                    <IconCopy size={14} />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="overflow-hidden rounded-md border border-[var(--border)]">
                <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2 text-xs text-[var(--text-dim)]">
                  <IconTerminal size={14} />
                  {CODE_LANGS.find((l) => l.id === lang)?.label}
                </div>
                <pre className="overflow-x-auto bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-[var(--text-muted)]">
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

          {clientTab === "env" && (
            <div>
              <p className="mb-3 text-xs text-[var(--text-dim)]">
                Use{" "}
                <code className="rounded bg-[var(--bg-panel)] px-1">{`{{KEY}}`}</code>{" "}
                in servers, tokens, params, or bodies. Stored only in your
                browser.
              </p>
              <div className="space-y-2">
                {env.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={row.key}
                      onChange={(e) => {
                        const next = [...env];
                        next[i] = { ...row, key: e.target.value };
                        setEnv(next);
                      }}
                      placeholder="KEY"
                      className="w-1/3 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-2 font-mono text-xs"
                    />
                    <input
                      value={row.value}
                      onChange={(e) => {
                        const next = [...env];
                        next[i] = { ...row, value: e.target.value };
                        setEnv(next);
                      }}
                      placeholder="value"
                      className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-2 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setEnv(env.filter((_, j) => j !== i))}
                      className="rounded-md border border-[var(--border)] p-2 text-[var(--text-dim)] hover:text-red-400"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setEnv([...env, { key: "", value: "" }])}
                className="mt-3 text-sm text-[#60a5fa] hover:underline"
              >
                + Add variable
              </button>
            </div>
          )}

          {clientTab === "history" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-[var(--text-dim)]">
                  Last {history.length} requests (local only)
                </p>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-[var(--text-dim)] hover:text-red-400"
                  >
                    Clear
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-[var(--text-dim)]">
                  Send a request to see history.
                </p>
              ) : (
                <ul className="space-y-2">
                  {history.map((h) => (
                    <li
                      key={h.id}
                      className="rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase text-[#60a5fa]">
                          {h.method}
                        </span>
                        {h.status != null && (
                          <span
                            className={
                              h.ok ? "text-[#22c55e]" : "text-[#ef4444]"
                            }
                          >
                            {h.status}
                          </span>
                        )}
                        {h.timeMs != null && (
                          <span className="text-[var(--text-dim)]">
                            {h.timeMs}ms
                          </span>
                        )}
                        <span className="ml-auto text-[var(--text-dim)]">
                          {new Date(h.at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-mono text-[var(--text-muted)]">
                        {h.url}
                      </p>
                      {h.error && (
                        <p className="mt-1 text-red-400">{h.error}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
