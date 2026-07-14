"use client";

import { useEffect, useMemo, useState } from "react";
import {
  documentToJson,
  groupByTag,
  methodDot,
} from "@/lib/openapi/parse";
import type { OpenAPIDocument, OpenAPISchema, ResolvedOperation } from "@/lib/openapi/types";
import { MethodBadge } from "./MethodBadge";
import { OperationDetail } from "./OperationDetail";
import { SchemaView } from "./SchemaView";
import { clsx } from "clsx";
import {
  Box,
  Download,
  Menu,
  Search,
  X,
} from "lucide-react";

type SidebarView = "endpoints" | "models";

export function ApiReference({
  doc,
}: {
  doc: OpenAPIDocument;
  showBranding?: boolean;
}) {
  const groups = useMemo(() => groupByTag(doc), [doc]);
  const allOps = useMemo(
    () => groups.flatMap((g) => g.operations),
    [groups]
  );
  const models = useMemo(
    () => Object.entries(doc.components?.schemas ?? {}) as [string, OpenAPISchema][],
    [doc]
  );

  const [activeId, setActiveId] = useState(allOps[0]?.id ?? "");
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>("endpoints");

  const active: ResolvedOperation | undefined =
    allOps.find((o) => o.id === activeId) || allOps[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        operations: g.operations.filter(
          (op) =>
            op.path.toLowerCase().includes(q) ||
            op.method.includes(q) ||
            op.operation.summary?.toLowerCase().includes(q) ||
            op.operation.operationId?.toLowerCase().includes(q) ||
            g.name.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.operations.length > 0);
  }, [groups, query]);

  const filteredModels = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter(([name]) => name.toLowerCase().includes(q));
  }, [models, query]);

  useEffect(() => {
    if (allOps[0]) setActiveId(allOps[0].id);
    setActiveModel(null);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectOp(id: string) {
    setActiveId(id);
    setActiveModel(null);
    setSidebarOpen(false);
  }

  function selectModel(name: string) {
    setActiveModel(name);
    setSidebarOpen(false);
  }

  function downloadSpec() {
    const blob = new Blob([documentToJson(doc)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.info.title || "openapi").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full min-h-[480px] bg-[var(--bg)] text-[var(--text)]">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform lg:static lg:z-0 lg:h-full lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-[var(--border)] px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-white">
                {doc.info.title}
              </h1>
              <p className="mt-0.5 text-xs text-[var(--text-dim)]">
                v{doc.info.version}
                {(doc.openapi || doc.swagger) && (
                  <span className="ml-1.5">
                    · OpenAPI {doc.openapi || doc.swagger}
                  </span>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={downloadSpec}
                title="Download OpenAPI JSON"
                className="rounded-md p-1.5 text-[var(--text-dim)] hover:bg-white/5 hover:text-white"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-1.5 text-[var(--text-dim)] lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {doc.info.description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--text-dim)]">
              {doc.info.description}
            </p>
          )}

          <div className="mt-3 flex rounded-md border border-[var(--border)] bg-[var(--bg-input)] p-0.5">
            <button
              type="button"
              onClick={() => setSidebarView("endpoints")}
              className={clsx(
                "flex-1 rounded px-2 py-1.5 text-xs font-medium transition",
                sidebarView === "endpoints"
                  ? "bg-[#2563eb] text-white"
                  : "text-[var(--text-dim)] hover:text-white"
              )}
            >
              Endpoints
            </button>
            <button
              type="button"
              onClick={() => setSidebarView("models")}
              className={clsx(
                "flex-1 rounded px-2 py-1.5 text-xs font-medium transition",
                sidebarView === "models"
                  ? "bg-[#2563eb] text-white"
                  : "text-[var(--text-dim)] hover:text-white"
              )}
            >
              Models {models.length > 0 && `(${models.length})`}
            </button>
          </div>
        </div>

        <div className="border-b border-[var(--border)] p-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-dim)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                sidebarView === "endpoints"
                  ? "Search endpoints…"
                  : "Search models…"
              }
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-input)] py-2 pl-8 pr-3 text-sm text-zinc-200 outline-none placeholder:text-[var(--text-dim)] focus:border-[#2563eb]"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {sidebarView === "endpoints" && (
            <>
              {filtered.map((group) => (
                <div key={group.name} className="mb-3">
                  <h2 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    {group.name}
                  </h2>
                  <ul className="space-y-0.5">
                    {group.operations.map((op) => (
                      <li key={op.id}>
                        <button
                          type="button"
                          onClick={() => selectOp(op.id)}
                          className={clsx(
                            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition",
                            activeId === op.id && !activeModel
                              ? "bg-[#2563eb]/15 text-white"
                              : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-zinc-200"
                          )}
                        >
                          <span
                            className={clsx(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              methodDot(op.method)
                            )}
                          />
                          <MethodBadge method={op.method} size="sm" />
                          <span className="min-w-0 truncate font-mono text-[11px]">
                            {op.path}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-[var(--text-dim)]">
                  No matching endpoints.
                </p>
              )}
            </>
          )}

          {sidebarView === "models" && (
            <>
              {filteredModels.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-[var(--text-dim)]">
                  {models.length === 0
                    ? "No component schemas in this document."
                    : "No matching models."}
                </p>
              ) : (
                <ul className="space-y-0.5">
                  {filteredModels.map(([name]) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => selectModel(name)}
                        className={clsx(
                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition",
                          activeModel === name
                            ? "bg-[#2563eb]/15 text-white"
                            : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-zinc-200"
                        )}
                      >
                        <Box className="h-3.5 w-3.5 shrink-0 text-[var(--text-dim)]" />
                        <span className="truncate font-mono text-[12px]">
                          {name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-2 text-center text-[10px] text-[var(--text-dim)]">
          Free · No account ·{" "}
          <a href="/" className="text-[#60a5fa] hover:underline">
            Aperio
          </a>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {activeModel && doc.components?.schemas?.[activeModel] ? (
          <div className="overflow-y-auto px-5 py-6 sm:px-8">
            <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <Box className="h-3.5 w-3.5" />
              Model
            </div>
            <h2 className="font-mono text-xl font-semibold text-white">
              {activeModel}
            </h2>
            {doc.components.schemas[activeModel].description && (
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {doc.components.schemas[activeModel].description}
              </p>
            )}
            <div className="mt-6 max-w-3xl">
              <SchemaView
                schema={doc.components.schemas[activeModel]}
                title={activeModel}
              />
            </div>
          </div>
        ) : active ? (
          <OperationDetail key={active.id} doc={doc} op={active} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-[var(--text-dim)]">
            No operations in this document.
          </div>
        )}
      </main>
    </div>
  );
}
