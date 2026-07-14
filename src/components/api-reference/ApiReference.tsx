"use client";

import { useEffect, useMemo, useState } from "react";
import { groupByTag } from "@/lib/openapi/parse";
import type { OpenAPIDocument, ResolvedOperation } from "@/lib/openapi/types";
import { MethodBadge } from "./MethodBadge";
import { OperationDetail } from "./OperationDetail";
import { Logo } from "../Logo";
import { clsx } from "clsx";
import { Menu, Search, X } from "lucide-react";

export function ApiReference({
  doc,
  showBranding = true,
}: {
  doc: OpenAPIDocument;
  showBranding?: boolean;
}) {
  const groups = useMemo(() => groupByTag(doc), [doc]);
  const allOps = useMemo(
    () => groups.flatMap((g) => g.operations),
    [groups]
  );
  const [activeId, setActiveId] = useState(allOps[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    if (active) setActiveId(active.id);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectOp(id: string) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#07080f] text-zinc-100">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg lg:hidden"
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

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-white/10 bg-[#0a0b14] transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
          <div className="min-w-0">
            {showBranding && (
              <div className="mb-2 lg:hidden">
                <Logo className="text-base" />
              </div>
            )}
            <h1 className="truncate text-sm font-semibold text-white">
              {doc.info.title}
            </h1>
            <p className="text-xs text-zinc-500">v{doc.info.version}</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-zinc-400 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/5 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search endpoints…"
              className="w-full rounded-lg border border-white/10 bg-[#07080f] py-2 pl-9 pr-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-500/40"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {filtered.map((group) => (
            <div key={group.name} className="mb-4">
              <h2 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {group.name}
              </h2>
              <ul className="space-y-0.5">
                {group.operations.map((op) => (
                  <li key={op.id}>
                    <button
                      type="button"
                      onClick={() => selectOp(op.id)}
                      className={clsx(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition",
                        activeId === op.id
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      )}
                    >
                      <MethodBadge method={op.method} className="min-w-[2.75rem] text-[10px]" />
                      <span className="min-w-0 truncate font-mono text-[12px]">
                        {op.path}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 text-sm text-zinc-500">No matching endpoints.</p>
          )}
        </nav>

        {showBranding && (
          <div className="border-t border-white/5 p-3 text-center text-[11px] text-zinc-600">
            Powered by{" "}
            <a href="/" className="text-cyan-500/80 hover:text-cyan-400">
              Aperio
            </a>
          </div>
        )}
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="border-b border-white/5 px-4 py-6 sm:px-8">
          {doc.info.description && (
            <p className="mb-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
              {doc.info.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            {(doc.openapi || doc.swagger) && (
              <span className="rounded-md border border-white/10 px-2 py-1">
                OpenAPI {doc.openapi || doc.swagger}
              </span>
            )}
            {doc.info.license && (
              <span className="rounded-md border border-white/10 px-2 py-1">
                {doc.info.license.name}
              </span>
            )}
            {doc.servers?.[0] && (
              <span className="rounded-md border border-white/10 px-2 py-1 font-mono">
                {doc.servers[0].url}
              </span>
            )}
          </div>
        </div>
        <div className="px-4 py-8 sm:px-8">
          {active ? (
            <OperationDetail key={active.id} doc={doc} op={active} />
          ) : (
            <p className="text-zinc-500">No operations in this document.</p>
          )}
        </div>
      </main>
    </div>
  );
}
