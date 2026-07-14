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
      // Prefer same-origin proxy to reduce CORS issues
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
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0a0b14] px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {doc.info.title}
            </p>
            <p className="text-xs text-zinc-500">
              v{doc.info.version} · Interactive reference
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDoc(null);
              setError(null);
            }}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5"
          >
            Load another spec
          </button>
        </div>
        <ApiReference doc={doc} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Playground
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Load any OpenAPI or Swagger document — free, no account needed.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
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
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
              mode === id
                ? "bg-white/10 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0e18] p-5">
        {mode === "paste" && (
          <>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={14}
              spellCheck={false}
              placeholder={`{\n  "openapi": "3.0.3",\n  "info": { "title": "My API", "version": "1.0.0" },\n  "paths": { ... }\n}`}
              className="w-full resize-y rounded-xl border border-white/10 bg-[#07080f] p-3 font-mono text-[12px] leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500/40"
            />
            <button
              type="button"
              onClick={() => loadText(raw)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Sparkles className="h-4 w-4" />
              Render docs
            </button>
          </>
        )}

        {mode === "url" && (
          <>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
              OpenAPI URL
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/openapi.json"
                  className="w-full rounded-xl border border-white/10 bg-[#07080f] py-2.5 pl-10 pr-3 text-sm text-zinc-200 outline-none focus:border-cyan-500/40"
                />
              </div>
              <button
                type="button"
                onClick={loadFromUrl}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-600">
              Fetches through Aperio&apos;s proxy when possible to avoid CORS
              issues.
            </p>
          </>
        )}

        {mode === "file" && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#07080f] px-6 py-14 transition hover:border-cyan-500/40 hover:bg-cyan-500/5">
            <FileUp className="h-8 w-8 text-zinc-500" />
            <span className="mt-3 text-sm font-medium text-zinc-300">
              Drop OpenAPI JSON or YAML
            </span>
            <span className="mt-1 text-xs text-zinc-600">
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
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-200">
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
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          {loading ? "Loading…" : "Or try the Petstore sample →"}
        </button>
      </div>
    </div>
  );
}
