import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/playground", label: "Playground" },
      { href: "/demo", label: "API Reference" },
      { href: "/lint", label: "Linter" },
      { href: "/mock", label: "Mock" },
      { href: "/compare", label: "Diff" },
      { href: "/catalog", label: "Catalog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/pricing", label: "Pricing" },
      { href: "/embed?sample=petstore", label: "Embed demo" },
    ],
  },
  {
    title: "Open source",
    links: [
      {
        href: "https://github.com/sachinkr7368/aperio",
        label: "GitHub",
        external: true,
      },
      {
        href: "https://github.com/sachinkr7368/aperio/blob/main/LICENSE",
        label: "MIT License",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-dim)]">
            Free open-source API platform: reference, lint, mock, and diff —
            no accounts required.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {col.title}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text-dim)]">
              {col.links.map((l) => (
                <li key={l.href}>
                  {"external" in l && l.external ? (
                    <a
                      href={l.href}
                      className="hover:text-[#60a5fa]"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="hover:text-[#60a5fa]">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-dim)]">
        © {new Date().getFullYear()} Aperio. Free forever. Built for developers.
      </div>
    </footer>
  );
}
