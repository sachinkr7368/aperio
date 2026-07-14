"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  documentToJson,
  groupByTag,
  methodDot,
} from "@/lib/openapi/parse";
import type {
  OpenAPIDocument,
  OpenAPISchema,
  ResolvedOperation,
} from "@/lib/openapi/types";
import { MethodBadge } from "./MethodBadge";
import { OperationDetail } from "./OperationDetail";
import { SchemaView } from "./SchemaView";
import { CommandPalette } from "./CommandPalette";
import { Markdown } from "@/components/Markdown";
import { clsx } from "clsx";
import {
  IconBox,
  IconChevronDown,
  IconChevronRight,
  IconDownload,
  IconExternal,
  IconFilter,
  IconLayers,
  IconMenu,
  IconSearch,
  IconShield,
  IconX,
} from "@/components/icons";
import { dump as yamlDump } from "js-yaml";

type SidebarView = "endpoints" | "models" | "security";
type MethodFilter = "all" | string;
type LayoutMode = "focused" | "classic";

export function ApiReference({ doc }: { doc: OpenAPIDocument }) {
  const groups = useMemo(() => groupByTag(doc), [doc]);
  const allOps = useMemo(
    () => groups.flatMap((g) => g.operations),
    [groups]
  );
  const models = useMemo(
    () =>
      Object.entries(doc.components?.schemas ?? {}) as [
        string,
        OpenAPISchema,
      ][],
    [doc]
  );
  const securitySchemes = useMemo(
    () => Object.entries(doc.components?.securitySchemes ?? {}),
    [doc]
  );

  const [activeId, setActiveId] = useState(allOps[0]?.id ?? "");
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>("endpoints");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [exportOpen, setExportOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("focused");

  const active: ResolvedOperation | undefined =
    allOps.find((o) => o.id === activeId) || allOps[0];

  const methodsInDoc = useMemo(() => {
    return Array.from(new Set(allOps.map((o) => o.method)));
  }, [allOps]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        operations: g.operations.filter((op) => {
          if (methodFilter !== "all" && op.method !== methodFilter)
            return false;
          if (!q) return true;
          return (
            op.path.toLowerCase().includes(q) ||
            op.method.includes(q) ||
            op.operation.summary?.toLowerCase().includes(q) ||
            op.operation.operationId?.toLowerCase().includes(q) ||
            g.name.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((g) => g.operations.length > 0);
  }, [groups, query, methodFilter]);

  const filteredModels = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter(([name]) => name.toLowerCase().includes(q));
  }, [models, query]);

  const selectOp = useCallback((id: string) => {
    setActiveId(id);
    setActiveModel(null);
    setShowOverview(false);
    setSidebarOpen(false);
    if (typeof window !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
    if (allOps[0]) setActiveId(allOps[0].id);
    setActiveModel(null);
    setShowOverview(true);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  // Deep link on load
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (hash && allOps.some((o) => o.id === hash)) {
      selectOp(hash);
    }
  }, [allOps, selectOp]);

  // Cmd/Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function selectModel(name: string) {
    setActiveModel(name);
    setShowOverview(false);
    setSidebarOpen(false);
  }

  function download(format: "json" | "yaml") {
    const json = documentToJson(doc);
    const content =
      format === "json"
        ? json
        : yamlDump(JSON.parse(json), { lineWidth: 100 });
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/yaml",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.info.title || "openapi")
      .replace(/\s+/g, "-")
      .toLowerCase()}.${format === "json" ? "json" : "yaml"}`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  function expandAll(open: boolean) {
    const next: Record<string, boolean> = {};
    for (const g of groups) next[g.name] = !open;
    setCollapsed(next);
  }

  return (
    <div className="flex h-full min-h-[480px] bg-[var(--bg)] text-[var(--text)]">
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        operations={allOps}
        onSelect={selectOp}
      />

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <IconMenu size={20} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] transition-transform lg:static lg:z-0 lg:h-full lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-[var(--border)] px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setShowOverview(true);
                setActiveModel(null);
              }}
              className="min-w-0 text-left"
            >
              <h1 className="truncate text-sm font-semibold tracking-tight">
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
            </button>
            <div className="relative flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                title="Export OpenAPI"
                className="rounded-md p-1.5 text-[var(--text-dim)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
              >
                <IconDownload size={16} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl">
                  <button
                    type="button"
                    onClick={() => download("json")}
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-hover)]"
                  >
                    Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => download("yaml")}
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-[var(--bg-hover)]"
                  >
                    Export YAML
                  </button>
                </div>
              )}
              <button
                type="button"
                className="rounded-md p-1.5 text-[var(--text-dim)] lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <IconX size={16} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-0.5">
            {(
              [
                ["endpoints", "API", IconLayers],
                ["models", "Models", IconBox],
                ["security", "Auth", IconShield],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSidebarView(id)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[11px] font-medium transition",
                  sidebarView === id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-dim)] hover:text-[var(--text)]"
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-b border-[var(--border)] p-2.5">
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-2.5 py-2 text-left text-sm text-[var(--text-dim)] transition hover:border-[var(--accent)]/40"
          >
            <IconSearch size={14} />
            <span className="flex-1">Search…</span>
            <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </button>

          {sidebarView === "endpoints" && (
            <>
              <div className="relative">
                <IconSearch
                  size={14}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter endpoints…"
                  className="input-field py-2 pl-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <IconFilter size={12} className="text-[var(--text-dim)]" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1 text-[11px] outline-none"
                >
                  <option value="all">All methods</option>
                  {methodsInDoc.map((m) => (
                    <option key={m} value={m}>
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => expandAll(true)}
                  className="rounded px-1.5 py-1 text-[10px] text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  Expand
                </button>
                <button
                  type="button"
                  onClick={() => expandAll(false)}
                  className="rounded px-1.5 py-1 text-[10px] text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  Collapse
                </button>
              </div>
              <div className="flex rounded-md border border-[var(--border)] p-0.5">
                {(
                  [
                    ["focused", "Focused"],
                    ["classic", "Classic"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLayout(id)}
                    className={clsx(
                      "flex-1 rounded px-2 py-1 text-[10px] font-medium",
                      layout === id
                        ? "bg-[var(--accent-soft)] text-[var(--text)]"
                        : "text-[var(--text-dim)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {sidebarView === "endpoints" && (
            <>
              <p className="mb-2 px-2 text-[10px] text-[var(--text-dim)]">
                {allOps.length} endpoints · {groups.length} tags
              </p>
              {filtered.map((group) => {
                const isCollapsed = collapsed[group.name];
                return (
                  <div key={group.name} className="mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsed((c) => ({
                          ...c,
                          [group.name]: !c[group.name],
                        }))
                      }
                      className="mb-0.5 flex w-full items-center gap-1 px-2 py-1 text-left text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] hover:text-[var(--text-muted)]"
                    >
                      {isCollapsed ? (
                        <IconChevronRight size={12} />
                      ) : (
                        <IconChevronDown size={12} />
                      )}
                      {group.name}
                      <span className="ml-auto font-normal normal-case tabular-nums">
                        {group.operations.length}
                      </span>
                    </button>
                    {!isCollapsed && (
                      <ul className="space-y-0.5">
                        {group.operations.map((op) => (
                          <li key={op.id}>
                            <button
                              type="button"
                              onClick={() => selectOp(op.id)}
                              className={clsx(
                                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition",
                                activeId === op.id &&
                                  !activeModel &&
                                  !showOverview
                                  ? "bg-[var(--accent-soft)] text-[var(--text)]"
                                  : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
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
                    )}
                  </div>
                );
              })}
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
                    ? "No component schemas."
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
                          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition",
                          activeModel === name
                            ? "bg-[var(--accent-soft)]"
                            : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                        )}
                      >
                        <IconBox size={14} className="text-[var(--text-dim)]" />
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

          {sidebarView === "security" && (
            <div className="space-y-2 px-1">
              {securitySchemes.length === 0 ? (
                <p className="py-4 text-center text-sm text-[var(--text-dim)]">
                  No security schemes defined.
                </p>
              ) : (
                securitySchemes.map(([name, scheme]) => {
                  const s = scheme as {
                    type?: string;
                    scheme?: string;
                    name?: string;
                    description?: string;
                    bearerFormat?: string;
                    in?: string;
                  };
                  return (
                    <div
                      key={name}
                      className="rounded-lg border border-[var(--border)] p-3"
                    >
                      <div className="flex items-center gap-2">
                        <IconShield size={14} className="text-[#60a5fa]" />
                        <span className="font-mono text-sm font-medium">
                          {name}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-dim)]">
                        {s.type}
                        {s.scheme && ` · ${s.scheme}`}
                        {s.bearerFormat && ` (${s.bearerFormat})`}
                        {s.name && ` · ${s.in}: ${s.name}`}
                      </p>
                      {s.description && (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {s.description}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-2 text-center text-[10px] text-[var(--text-dim)]">
          Free forever · No account ·{" "}
          <a href="/" className="text-[#60a5fa] hover:underline">
            Aperio
          </a>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {showOverview && !activeModel ? (
          <div className="overflow-y-auto px-5 py-8 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#60a5fa]">
              API Reference
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {doc.info.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-dim)]">
              Version {doc.info.version}
            </p>
            {doc.info.description && (
              <Markdown
                content={doc.info.description}
                className="mt-4 max-w-2xl"
              />
            )}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {(doc.openapi || doc.swagger) && (
                <span className="rounded-lg border border-[var(--border)] px-2.5 py-1">
                  OpenAPI {doc.openapi || doc.swagger}
                </span>
              )}
              {doc.info.license && (
                <span className="rounded-lg border border-[var(--border)] px-2.5 py-1">
                  {doc.info.license.name}
                </span>
              )}
              {doc.info.contact?.url && (
                <a
                  href={doc.info.contact.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[#60a5fa]"
                >
                  <IconExternal size={12} /> Contact
                </a>
              )}
              {doc.externalDocs?.url && (
                <a
                  href={doc.externalDocs.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[#60a5fa]"
                >
                  <IconExternal size={12} />
                  {doc.externalDocs.description || "External docs"}
                </a>
              )}
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                [allOps.length, "Endpoints"],
                [models.length, "Models"],
                [securitySchemes.length, "Auth schemes"],
              ].map(([n, label]) => (
                <div
                  key={String(label)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
                >
                  <p className="text-2xl font-semibold tabular-nums">{n}</p>
                  <p className="text-xs text-[var(--text-dim)]">{label}</p>
                </div>
              ))}
            </div>
            {allOps[0] && (
              <button
                type="button"
                onClick={() => selectOp(allOps[0].id)}
                className="btn-primary mt-8"
              >
                Browse endpoints →
              </button>
            )}
          </div>
        ) : activeModel && doc.components?.schemas?.[activeModel] ? (
          <div className="overflow-y-auto px-5 py-6 sm:px-8">
            <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-dim)]">
              <IconBox size={14} /> Model
            </div>
            <h2 className="font-mono text-xl font-semibold">{activeModel}</h2>
            {doc.components.schemas[activeModel].description && (
              <Markdown
                content={doc.components.schemas[activeModel].description}
                className="mt-2"
              />
            )}
            <div className="mt-6 max-w-3xl">
              <SchemaView
                schema={doc.components.schemas[activeModel]}
                title={activeModel}
                showExample
              />
            </div>
          </div>
        ) : layout === "classic" ? (
          <div className="flex-1 overflow-y-auto">
            {allOps.map((op) => (
              <div
                key={op.id}
                id={op.id}
                className="border-b border-[var(--border)] px-5 py-10 sm:px-8"
              >
                <OperationDetail doc={doc} op={op} compact />
              </div>
            ))}
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
