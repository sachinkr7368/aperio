import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-dim)]">
            Free, open-source API documentation from OpenAPI and Swagger.
            Interactive references, try-it-out, and code samples — no account
            required.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Product
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-dim)]">
            <li>
              <Link href="/playground" className="hover:text-[#60a5fa]">
                Playground
              </Link>
            </li>
            <li>
              <Link href="/demo" className="hover:text-[#60a5fa]">
                Live Demo
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-[#60a5fa]">
                Documentation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Open Source
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-dim)]">
            <li>
              <a
                href="https://github.com/sachinkr7368/aperio"
                className="hover:text-[#60a5fa]"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/sachinkr7368/aperio/blob/main/LICENSE"
                className="hover:text-[#60a5fa]"
                target="_blank"
                rel="noreferrer"
              >
                MIT License
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-dim)]">
        © {new Date().getFullYear()} Aperio. Free forever. Built for developers.
      </div>
    </footer>
  );
}
