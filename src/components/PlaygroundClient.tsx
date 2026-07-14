"use client";

import { useCallback, useState } from "react";
import { parseOpenAPI } from "@/lib/openapi/parse";
import type { OpenAPIDocument } from "@/lib/openapi/types";
import { ApiReference } from "@/components/api-reference/ApiReference";
import {
  AlertCircle,
  FileUp,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

const SAMPLE_URL = "/samples/petstore.json";

type Mode = "paste" | "url" | "file";

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

  const loadText = useCallback((text: string) => {
    try {
      const parsed = parseOpenAPI(text);
      setDoc(parsed);
      setError(null);
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
      const text = await res.text();
      setRaw(text);
      loadText(text);
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
      setRaw(data.content);
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
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setRaw(text);
      loadText(text);
    };
    reader.onerror = () => setError("Could not read file.");
    reader.readAsText(file);
  }

  if (doc) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {doc.info.title}
              <span className="ml-2 font-normal text-[var(--text-dim)]">
                v{doc.info.version}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDoc(null);
              setError(null);
            }}
            className="rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
          >
            Load another spec
          </button>
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
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Playground
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Load any OpenAPI or Swagger document — free, no account needed.
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
        {(
          [
            ["paste", "Paste"],
            ["url", "URL"],
            ["file", "Upload"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={clsx(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition",
              mode === id
                ? "bg-[#2563eb] text-white"
                : "text-[var(--text-dim)] hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        {mode === "paste" && (
          <>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={14}
              spellCheck={false}
              placeholder={`{\n  "openapi": "3.0.3",\n  "info": { "title": "My API", "version": "1.0.0" },\n  "paths": { ... }\n}`}
              className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[12px] leading-relaxed text-zinc-200 outline-none placeholder:text-[var(--text-dim)] focus:border-[#2563eb]"
            />
            <button
              type="button"
              onClick={() => loadText(raw)}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              <Sparkles className="h-4 w-4" />
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
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/openapi.json"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] py-2.5 pl-10 pr-3 text-sm text-zinc-200 outline-none focus:border-[#2563eb]"
                />
              </div>
              <button
                type="button"
                onClick={loadFromUrl}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Fetches through Aperio&apos;s proxy when possible to avoid CORS
              issues.
            </p>
          </>
        )}

        {mode === "file" && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-input)] px-6 py-14 transition hover:border-[#2563eb]/50">
            <FileUp className="h-8 w-8 text-[var(--text-dim)]" />
            <span className="mt-3 text-sm font-medium text-zinc-300">
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
          <div className="mt-4 flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

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
