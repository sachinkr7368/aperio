"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { clsx } from "clsx";
import {
  IconChevronDown,
  IconGithub,
  IconMenu,
  IconMoon,
  IconSun,
  IconX,
} from "./icons";
import { useClientStore } from "@/lib/client-store";

const product = [
  { href: "/playground", label: "Playground", desc: "Import & render specs" },
  { href: "/demo", label: "API Reference", desc: "Interactive docs demo" },
  { href: "/lint", label: "Linter", desc: "Quality score your OpenAPI" },
  { href: "/mock", label: "Mock", desc: "Responses from your spec" },
  { href: "/compare", label: "Diff", desc: "Compare two versions" },
  { href: "/catalog", label: "Catalog", desc: "Samples & embed" },
];

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Header({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const { theme, toggleTheme } = useClientStore();

  return (
    <header className="sticky top-0 z-50 h-14 shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
      <div
        className={clsx(
          "flex h-full items-center justify-between px-4 sm:px-5",
          !fullWidth && "mx-auto max-w-6xl"
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-0.5 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProdOpen(true)}
            onMouseLeave={() => setProdOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
            >
              Product
              <IconChevronDown size={14} />
            </button>
            {prodOpen && (
              <div className="absolute left-0 top-full z-50 w-72 pt-1">
                <div className="surface grid gap-0.5 p-2">
                  {product.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 hover:bg-[var(--bg-hover)]"
                    >
                      <span className="block text-sm font-medium text-[var(--text)]">
                        {item.label}
                      </span>
                      <span className="block text-xs text-[var(--text-dim)]">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-lg border border-[var(--border)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>
          <Link href="/playground" className="btn-primary ml-2 !py-1.5 !text-xs">
            Start free
          </Link>
          <a
            href="https://github.com/sachinkr7368/aperio"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-sm text-[var(--text)] hover:bg-[var(--bg-hover)]"
          >
            <IconGithub size={16} />
          </a>
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--text-muted)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>
      <div
        className={clsx(
          "absolute left-0 right-0 max-h-[80vh] overflow-y-auto border-b border-[var(--border)] bg-[var(--bg)] md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-0.5 px-3 py-2">
          {[...product, ...nav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
