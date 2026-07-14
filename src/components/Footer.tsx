import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#05060c]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            Free, open-source API documentation from OpenAPI and Swagger.
            Beautiful references, try-it-out requests, and code samples — no
            account required.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Product
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500">
            <li>
              <Link href="/playground" className="hover:text-cyan-400">
                Playground
              </Link>
            </li>
            <li>
              <Link href="/demo" className="hover:text-cyan-400">
                Live Demo
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-cyan-400">
                Documentation
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Open Source
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-500">
            <li>
              <a
                href="https://github.com/sachinkr7368/aperio"
                className="hover:text-cyan-400"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/sachinkr7368/aperio/blob/main/LICENSE"
                className="hover:text-cyan-400"
                target="_blank"
                rel="noreferrer"
              >
                MIT License
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Aperio. Free forever. Built for developers.
      </div>
    </footer>
  );
}
