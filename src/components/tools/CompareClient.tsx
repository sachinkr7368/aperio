"use client";

import { useState } from "react";
import { SpecLoader } from "@/components/SpecLoader";
import { parseOpenAPI } from "@/lib/openapi/parse";
import { diffOpenAPI, type DiffReport } from "@/lib/openapi/diff";
import type { OpenAPIDocument } from "@/lib/openapi/types";
import { clsx } from "clsx";

export function CompareClient() {
  const [before, setBefore] = useState<OpenAPIDocument | null>(null);
  const [after, setAfter] = useState<OpenAPIDocument | null>(null);
  const [step, setStep] = useState<"before" | "after" | "result">("before");
  const [report, setReport] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadBefore(raw: string) {
    try {
      setBefore(parseOpenAPI(raw));
      setError(null);
      setStep("after");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse failed");
    }
  }

  function loadAfter(raw: string) {
    try {
      const doc = parseOpenAPI(raw);
      setAfter(doc);
      if (before) {
        setReport(diffOpenAPI(before, doc));
        setStep("result");
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse failed");
    }
  }

  if (step === "before") {
    return (
      <div className="surface p-5">
        <h2 className="mb-3 text-sm font-semibold">1 · Baseline (before)</h2>
        <SpecLoader onLoad={loadBefore} />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  if (step === "after") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--text-dim)]">
          Baseline: <strong className="text-[var(--text)]">{before?.info.title}</strong>{" "}
          v{before?.info.version}
        </p>
        <div className="surface p-5">
          <h2 className="mb-3 text-sm font-semibold">2 · Updated (after)</h2>
          <SpecLoader onLoad={loadAfter} />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text)]">
            {before?.info.title} {before?.info.version}
          </span>
          {" → "}
          <span className="font-medium text-[var(--text)]">
            {after?.info.title} {after?.info.version}
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            setBefore(null);
            setAfter(null);
            setReport(null);
            setStep("before");
          }}
          className="btn-secondary text-sm"
        >
          New comparison
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ["Added", report?.summary.added ?? 0, "text-[#22c55e]"],
            ["Removed", report?.summary.removed ?? 0, "text-[#ef4444]"],
            ["Changed", report?.summary.changed ?? 0, "text-[#eab308]"],
          ] as const
        ).map(([label, n, color]) => (
          <div key={label} className="surface p-4">
            <p className={clsx("text-2xl font-semibold tabular-nums", color)}>
              {n}
            </p>
            <p className="text-xs text-[var(--text-dim)]">{label}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-2">
        {(report?.changes ?? []).map((c, i) => (
          <li
            key={i}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                  c.kind === "added" && "bg-emerald-500/15 text-emerald-400",
                  c.kind === "removed" && "bg-red-500/15 text-red-400",
                  c.kind === "changed" && "bg-amber-500/15 text-amber-400"
                )}
              >
                {c.kind}
              </span>
              <span className="text-[10px] uppercase text-[var(--text-dim)]">
                {c.area}
              </span>
              <code className="text-sm text-[var(--text)]">{c.label}</code>
            </div>
            {c.detail && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">{c.detail}</p>
            )}
          </li>
        ))}
        {!report?.changes.length && (
          <p className="text-sm text-[var(--text-dim)]">
            No differences detected.
          </p>
        )}
      </ul>
    </div>
  );
}
