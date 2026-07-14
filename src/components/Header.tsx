"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { clsx } from "clsx";
import {
  IconGithub,
  IconMenu,
  IconMoon,
  IconSun,
  IconX,
} from "./icons";
import { useClientStore } from "@/lib/client-store";

const nav = [
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Live Demo" },
];

export function Header({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useClientStore();

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
              className="rounded-md px-3 py-1.5 text-sm text-[var(--text-muted)] transition hover:bg-black/5 hover:text-[var(--text)] dark:hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-1 rounded-md border border-[var(--border)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text)]"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <IconSun size={16} />
            ) : (
              <IconMoon size={16} />
            )}
          </button>
          <a
            href="https://github.com/sachinkr7368/aperio"
            target="_blank"
            rel="noreferrer"
            className="ml-1.5 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-1.5 text-sm text-[var(--text)] transition hover:border-[#2563eb]/50 hover:bg-[#2563eb]/10"
          >
            <IconGithub size={16} />
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md p-2 text-[var(--text-muted)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[var(--text)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <IconX size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
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
              className="rounded-md px-3 py-2.5 text-sm text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/sachinkr7368/aperio"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2.5 text-sm text-[var(--text-muted)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
