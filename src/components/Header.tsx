"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { clsx } from "clsx";

const nav = [
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Live Demo" },
];

export function Header({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md">
      <div
        className={clsx(
          "flex h-full items-center justify-between px-4 sm:px-5",
          !fullWidth && "mx-auto max-w-6xl"
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-[var(--text-muted)] transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/sachinkr7368/aperio"
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-1.5 text-sm text-zinc-200 transition hover:border-[#2563eb]/50 hover:bg-[#2563eb]/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-zinc-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={clsx(
          "absolute left-0 right-0 border-b border-[var(--border)] bg-[var(--bg)] md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-0.5 px-3 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/sachinkr7368/aperio"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
