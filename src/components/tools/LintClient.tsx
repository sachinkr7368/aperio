"use client";

import { useState } from "react";
import { SpecLoader } from "@/components/SpecLoader";
import { tryParseAndLint, type LintReport } from "@/lib/openapi/lint";
import { clsx } from "clsx";

export function LintClient() {
  const [report, setReport] = useState<LintReport | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">(
    "all"
  );

  function run(raw: string) {
    const result = tryParseAndLint(raw);
    if (!result.ok) {
      setError(result.error);
      setReport(null);
      return;
    }
    setError(null);
    setTitle(result.title);
    setReport(result.report);
  }

  const issues =
    report?.issues.filter((i) => filter === "all" || i.severity === filter) ??
    [];

  return (
    <div className="space-y-6">
      {!report ? (
        <div className="surface p-5">
          <SpecLoader onLoad={run} />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-[var(--text-dim)]">
                {report.stats.endpoints} endpoints · {report.stats.schemas}{" "}
                schemas
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReport(null)}
              className="btn-secondary text-sm"
            >
              Lint another
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="surface p-4 text-center sm:col-span-1">
              <p
                className={clsx(
                  "text-4xl font-bold tabular-nums",
                  report.score >= 80
                    ? "text-[#22c55e]"
                    : report.score >= 60
                      ? "text-[#eab308]"
                      : "text-[#ef4444]"
                )}
              >
                {report.score}
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Grade {report.grade}
              </p>
            </div>
            {(
              [
                ["Errors", report.stats.errors, "text-[#ef4444]"],
                ["Warnings", report.stats.warnings, "text-[#eab308]"],
                ["Info", report.stats.infos, "text-[var(--text-muted)]"],
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

          <div className="flex flex-wrap gap-1">
            {(["all", "error", "warning", "info"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize",
                  filter === f
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-panel)] text-[var(--text-dim)]"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      issue.severity === "error" &&
                        "bg-red-500/15 text-red-400",
                      issue.severity === "warning" &&
                        "bg-amber-500/15 text-amber-400",
                      issue.severity === "info" &&
                        "bg-zinc-500/15 text-[var(--text-muted)]"
                    )}
                  >
                    {issue.severity}
                  </span>
                  <code className="text-[11px] text-[var(--text-dim)]">
                    {issue.rule}
                  </code>
                  {issue.path && (
                    <code className="text-[11px] text-[#93c5fd]">
                      {issue.path}
                    </code>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                  {issue.message}
                </p>
              </li>
            ))}
            {issues.length === 0 && (
              <p className="text-sm text-[var(--text-dim)]">
                No issues in this filter.
              </p>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
