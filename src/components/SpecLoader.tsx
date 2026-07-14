"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  IconFileJson,
  IconLink,
  IconRefresh,
  IconUpload,
} from "@/components/icons";

type Mode = "paste" | "url" | "file";

export function SpecLoader({
  onLoad,
  sampleUrl = "/samples/petstore.json",
}: {
  onLoad: (raw: string) => void;
  sampleUrl?: string;
}) {
  const [mode, setMode] = useState<Mode>("paste");
  const [raw, setRaw] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadSample() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(sampleUrl);
      const text = await res.text();
      setRaw(text);
      onLoad(text);
    } catch {
      setError("Could not load sample.");
    } finally {
      setLoading(false);
    }
  }

  async function loadUrl() {
    if (!url.trim()) return setError("Enter a URL");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/fetch-spec?url=${encodeURIComponent(url.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");
      setRaw(data.content);
      onLoad(data.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fetch failed");
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
      onLoad(text);
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1">
        {(
          [
            ["paste", "Paste", IconFileJson],
            ["url", "URL", IconLink],
            ["file", "Upload", IconUpload],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={clsx(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium",
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

      {mode === "paste" && (
        <>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="Paste OpenAPI JSON or YAML…"
            className="input-field font-mono text-[12px]"
          />
          <button
            type="button"
            onClick={() => onLoad(raw)}
            className="btn-primary"
          >
            Continue
          </button>
        </>
      )}

      {mode === "url" && (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/openapi.json"
            className="input-field"
          />
          <button
            type="button"
            onClick={loadUrl}
            disabled={loading}
            className="btn-primary shrink-0"
          >
            {loading ? (
              <IconRefresh size={16} className="aperio-spin" />
            ) : (
              "Fetch"
            )}
          </button>
        </div>
      )}

      {mode === "file" && (
        <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-[var(--border)] px-6 py-10 hover:border-[var(--accent)]/50">
          <IconUpload size={28} className="text-[var(--text-dim)]" />
          <span className="mt-2 text-sm">Drop or browse OpenAPI file</span>
          <input
            type="file"
            accept=".json,.yaml,.yml"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="button"
        onClick={loadSample}
        className="text-sm text-[#60a5fa] hover:underline"
      >
        Use Petstore sample →
      </button>
    </div>
  );
}
