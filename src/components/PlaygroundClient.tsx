"use client";

import { useCallback, useEffect, useState } from "react";
import { parseOpenAPI } from "@/lib/openapi/parse";
import type { OpenAPIDocument } from "@/lib/openapi/types";
import { ApiReference } from "@/components/api-reference/ApiReference";
import {
  IconAlert,
  IconEdit,
  IconFileJson,
  IconLink,
  IconRefresh,
  IconSpark,
  IconUpload,
} from "@/components/icons";
import { clsx } from "clsx";

const SAMPLE_URL = "/samples/petstore.json";
const RECENT_KEY = "aperio.recentSpecs";

type Mode = "paste" | "url" | "file" | "edit";

interface RecentSpec {
  title: string;
  at: number;
  preview: string;
}

export function PlaygroundClient({
  initialDoc,
}: {
  initialDoc?: OpenAPIDocument | null;
}) {
  const [doc, setDoc] = useState<OpenAPIDocument | null>(initialDoc ?? null);
  const [mode, setMode] = useState<Mode>("paste");
  const [raw, setRaw] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<RecentSpec[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(RECENT_KEY);
      if (r) setRecent(JSON.parse(r));
    } catch {
      /* ignore */
    }
  }, []);

  const loadText = useCallback((text: string) => {
    try {
      const parsed = parseOpenAPI(text);
      setDoc(parsed);
      setRaw(text);
      setError(null);
      try {
        const entry: RecentSpec = {
          title: parsed.info.title,
          at: Date.now(),
          preview: text.slice(0, 8000),
        };
        const prev: RecentSpec[] = JSON.parse(
          localStorage.getItem(RECENT_KEY) || "[]"
        );
        const next = [
          entry,
          ...prev.filter((p) => p.title !== entry.title),
        ].slice(0, 5);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        setRecent(next);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse document");
      setDoc(null);
    }
  }, []);

  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SAMPLE_URL);
      loadText(await res.text());
    } catch {
      setError("Could not load sample document.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFromUrl() {
    if (!url.trim()) {
      setError("Enter a URL to an OpenAPI document.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const proxy = `/api/fetch-spec?url=${encodeURIComponent(url.trim())}`;
      const res = await fetch(proxy);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");
      loadText(data.content);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch. The remote host may block requests."
      );
    } finally {
      setLoading(false);
    }
  }

  function onFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadText(String(reader.result ?? ""));
    reader.onerror = () => setError("Could not read file.");
    reader.readAsText(file);
  }

  if (doc) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4">
          <p className="truncate text-sm font-medium">
            {doc.info.title}
            <span className="ml-2 font-normal text-[var(--text-dim)]">
              v{doc.info.version}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("edit");
                setDoc(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <IconEdit size={12} />
              Edit spec
            </button>
            <button
              type="button"
              onClick={() => {
                setDoc(null);
                setError(null);
                setMode("paste");
              }}
              className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              Load another
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ApiReference doc={doc} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <IconFileJson size={24} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Import any OpenAPI or Swagger document — free, no account needed.
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
        {(
          [
            ["paste", "Paste", IconFileJson],
            ["url", "URL", IconLink],
            ["file", "Upload", IconUpload],
            ["edit", "Editor", IconEdit],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition",
              mode === id
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-dim)] hover:text-[var(--text)]"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="surface p-5">
        {(mode === "paste" || mode === "edit") && (
          <>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={mode === "edit" ? 18 : 14}
              spellCheck={false}
              placeholder={`{\n  "openapi": "3.0.3",\n  "info": { "title": "My API", "version": "1.0.0" },\n  "paths": { ... }\n}`}
              className="input-field resize-y font-mono text-[12px] leading-relaxed"
            />
            <button
              type="button"
              onClick={() => loadText(raw)}
              className="btn-primary mt-3"
            >
              <IconSpark size={16} />
              Render docs
            </button>
          </>
        )}

        {mode === "url" && (
          <>
            <label className="block text-xs font-medium uppercase tracking-wider text-[var(--text-dim)]">
              OpenAPI URL
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <IconLink
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
                />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/openapi.json"
                  className="input-field pl-10"
                />
              </div>
              <button
                type="button"
                onClick={loadFromUrl}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <IconRefresh size={16} className="aperio-spin" />
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Fetches through Aperio&apos;s secure proxy to reduce CORS issues.
            </p>
          </>
        )}

        {mode === "file" && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-input)] px-6 py-14 transition hover:border-[var(--accent)]/50">
            <IconUpload size={32} className="text-[var(--text-dim)]" />
            <span className="mt-3 text-sm font-medium">
              Drop OpenAPI JSON or YAML
            </span>
            <span className="mt-1 text-xs text-[var(--text-dim)]">
              or click to browse
            </span>
            <input
              type="file"
              accept=".json,.yaml,.yml,application/json,text/yaml"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-400">
            <IconAlert size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
            Recent (this browser)
          </h2>
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.at}>
                <button
                  type="button"
                  onClick={() => loadText(r.preview)}
                  className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5 text-left text-sm transition hover:border-[var(--accent)]/40"
                >
                  <span className="font-medium">{r.title}</span>
                  <span className="text-xs text-[var(--text-dim)]">
                    {new Date(r.at).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={loadSample}
          disabled={loading}
          className="text-sm text-[#60a5fa] hover:underline"
        >
          {loading ? "Loading…" : "Or try the Petstore sample →"}
        </button>
      </div>
    </div>
  );
}
