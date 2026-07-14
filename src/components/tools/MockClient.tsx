"use client";

import { useMemo, useState } from "react";
import { SpecLoader } from "@/components/SpecLoader";
import { parseOpenAPI } from "@/lib/openapi/parse";
import { listMockRoutes } from "@/lib/openapi/mock";
import type { OpenAPIDocument } from "@/lib/openapi/types";
import { MethodBadge } from "@/components/api-reference/MethodBadge";
import { IconPlay, IconRefresh } from "@/components/icons";
import { clsx } from "clsx";

export function MockClient() {
  const [doc, setDoc] = useState<OpenAPIDocument | null>(null);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/pets");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const routes = useMemo(() => (doc ? listMockRoutes(doc) : []), [doc]);

  function onLoad(text: string) {
    try {
      const parsed = parseOpenAPI(text);
      setDoc(parsed);
      setRaw(text);
      setError(null);
      const first = listMockRoutes(parsed)[0];
      if (first) {
        setMethod(first.method);
        // replace path params with sample values
        setPath(
          first.path.replace(/\{[^}]+\}/g, "1")
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse failed");
      setDoc(null);
    }
  }

  async function runMock() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openapi: raw, method, path }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(
        JSON.stringify(
          { error: e instanceof Error ? e.message : "Failed" },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  }

  if (!doc) {
    return (
      <div className="surface p-5">
        <SpecLoader onLoad={onLoad} />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{doc.info.title}</h2>
          <p className="text-sm text-[var(--text-dim)]">
            {routes.length} mockable routes
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDoc(null)}
          className="btn-secondary text-sm"
        >
          Load another
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Routes
          </p>
          <ul className="max-h-80 space-y-1 overflow-y-auto rounded-xl border border-[var(--border)] p-2">
            {routes.map((r) => (
              <li key={r.method + r.path}>
                <button
                  type="button"
                  onClick={() => {
                    setMethod(r.method);
                    setPath(r.path.replace(/\{[^}]+\}/g, "1"));
                  }}
                  className={clsx(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[var(--bg-hover)]",
                    method === r.method &&
                      path.startsWith(r.path.split("{")[0]) &&
                      "bg-[var(--accent-soft)]"
                  )}
                >
                  <MethodBadge method={r.method} size="sm" />
                  <span className="truncate font-mono text-[11px]">
                    {r.path}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input-field w-28"
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="input-field font-mono"
            />
          </div>
          <button
            type="button"
            onClick={runMock}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <IconRefresh size={16} className="aperio-spin" />
            ) : (
              <IconPlay size={16} />
            )}
            Generate mock response
          </button>
          {result && (
            <pre className="max-h-96 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[12px] text-[var(--text-muted)]">
              {result}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
