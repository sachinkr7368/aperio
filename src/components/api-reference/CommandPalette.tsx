"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ResolvedOperation } from "@/lib/openapi/types";
import { MethodBadge } from "./MethodBadge";
import { IconSearch, IconX } from "@/components/icons";
import { clsx } from "clsx";

export function CommandPalette({
  open,
  onClose,
  operations,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  operations: ResolvedOperation[];
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return operations.slice(0, 40);
    return operations
      .filter(
        (op) =>
          op.path.toLowerCase().includes(query) ||
          op.method.includes(query) ||
          op.operation.summary?.toLowerCase().includes(query) ||
          op.operation.operationId?.toLowerCase().includes(query) ||
          op.tags.some((t) => t.toLowerCase().includes(query))
      )
      .slice(0, 40);
  }, [q, operations]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setIdx(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[idx]) {
        e.preventDefault();
        onSelect(results[idx].id);
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, idx, onClose, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
      <div className="cmd-overlay absolute inset-0" onClick={onClose} />
      <div className="surface relative z-10 w-full max-w-xl overflow-hidden animate-fade-in">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-3">
          <IconSearch size={16} className="text-[var(--text-dim)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search endpoints, operations, tags…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[var(--text-dim)]"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[var(--text-dim)] hover:text-[var(--text)]"
          >
            <IconX size={16} />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1.5">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-[var(--text-dim)]">
              No matches
            </li>
          )}
          {results.map((op, i) => (
            <li key={op.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(op.id);
                  onClose();
                }}
                onMouseEnter={() => setIdx(i)}
                className={clsx(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm",
                  i === idx ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--bg-hover)]"
                )}
              >
                <MethodBadge method={op.method} size="sm" />
                <span className="min-w-0 flex-1 truncate font-mono text-[12px]">
                  {op.path}
                </span>
                <span className="hidden max-w-[40%] truncate text-xs text-[var(--text-dim)] sm:block">
                  {op.operation.summary}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 border-t border-[var(--border)] px-3 py-2 text-[10px] text-[var(--text-dim)]">
          <span>
            <kbd className="rounded border border-[var(--border)] px-1">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded border border-[var(--border)] px-1">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border border-[var(--border)] px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
