import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  IconBook,
  IconCode,
  IconFileJson,
  IconGithub,
  IconGlobe,
  IconKey,
  IconLayers,
  IconPlay,
  IconSearch,
  IconSpark,
  IconTerminal,
  IconUnlock,
  IconZap,
  IconShield,
  IconBraces,
  IconBox,
} from "@/components/icons";

const suite = [
  {
    href: "/playground",
    icon: IconFileJson,
    title: "Reference",
    description:
      "Interactive OpenAPI docs with try-it-out, models, auth schemes, and dual layouts.",
  },
  {
    href: "/lint",
    icon: IconShield,
    title: "Linter",
    description:
      "Quality score your spec — operationIds, servers, path params, responses, and more.",
  },
  {
    href: "/mock",
    icon: IconBraces,
    title: "Mock",
    description:
      "Return example payloads from your OpenAPI without standing up a backend.",
  },
  {
    href: "/compare",
    icon: IconLayers,
    title: "Diff",
    description:
      "Compare two OpenAPI versions. See added, removed, and changed operations.",
  },
  {
    href: "/catalog",
    icon: IconBox,
    title: "Catalog & embed",
    description:
      "Sample APIs plus iframe embeds for any public OpenAPI URL — no account.",
  },
  {
    href: "/docs",
    icon: IconBook,
    title: "Docs platform",
    description:
      "Self-host on Vercel, theme dark/light, environments, history, 10 SDK languages.",
  },
];

const why = [
  {
    icon: IconUnlock,
    title: "No gatekeeping",
    body: "No seats, no trial wall, no “talk to sales” for basic docs. Free forever under MIT.",
  },
  {
    icon: IconZap,
    title: "Minutes, not weeks",
    body: "Paste a spec and ship interactive docs immediately. Lint and mock in the same browser tab.",
  },
  {
    icon: IconGlobe,
    title: "Own your stack",
    body: "Self-host, white-label, or embed. Your domain, your branding, your OpenAPI source of truth.",
  },
];

const compareRows = [
  ["Interactive API reference", true],
  ["Try-it-out client", true],
  ["Multi-language code samples", true],
  ["OpenAPI linter / score", true],
  ["Mock from OpenAPI", true],
  ["Spec diff / changelog assist", true],
  ["Embed without account", true],
  ["Self-host (MIT)", true],
  ["$0 with full features", true],
] as const;

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="hero-grid overflow-hidden border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/80 px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                <IconZap size={14} className="text-[var(--accent)]" />
                Open-source API platform · Reference · Lint · Mock · Diff
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-6xl sm:leading-[1.05]">
                The free API docs stack
                <br />
                <span className="text-[var(--accent)]">
                  teams actually ship with
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                Aperio is built as a serious alternative to paid API
                documentation platforms: beautiful references, a real request
                client, linting, mocks, and version diffs — without the seat tax.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/playground" className="btn-primary">
                  <IconPlay size={16} />
                  Open playground
                </Link>
                <Link href="/demo" className="btn-secondary">
                  Live API demo
                </Link>
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text)]"
                >
                  <IconGithub size={16} />
                  GitHub
                </a>
              </div>
            </div>

            <div className="surface mx-auto mt-16 max-w-4xl overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
                <span className="ml-3 font-mono text-xs text-[var(--text-dim)]">
                  aperio · platform
                </span>
              </div>
              <div className="grid divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  ["Reference", "⌘K search · try-it · SDKs"],
                  ["Linter", "Score A–F · fix before publish"],
                  ["Mock + Diff", "Ship UI while API evolves"],
                ].map(([t, d]) => (
                  <div key={t} className="p-5">
                    <p className="text-sm font-semibold">{t}</p>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Full product suite
              </h2>
              <p className="mt-3 text-sm text-[var(--text-dim)]">
                Not just a docs skin — tooling around the OpenAPI lifecycle.
              </p>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {suite.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition hover:border-[var(--accent)]/40"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
                    {f.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[var(--bg-elevated)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Why teams choose Aperio
                </h2>
                <div className="mt-8 space-y-6">
                  {why.map((w) => (
                    <div key={w.title} className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                        <w.icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{w.title}</h3>
                        <p className="mt-1 text-sm text-[var(--text-dim)]">
                          {w.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface overflow-hidden">
                <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-semibold">
                  Platform capabilities
                </div>
                <ul>
                  {compareRows.map(([label]) => (
                    <li
                      key={label}
                      className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5 text-sm last:border-0"
                    >
                      <span className="text-[var(--text-muted)]">{label}</span>
                      <span className="font-medium text-[#22c55e]">Included</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              Built for developers
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  [IconSearch, "⌘K command palette"],
                  [IconCode, "10 client SDKs"],
                  [IconKey, "Env {{vars}} + history"],
                  [IconTerminal, "Export JSON / YAML"],
                ] as const
              ).map(([Icon, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3"
                >
                  <Icon size={18} className="text-[var(--accent)]" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <IconSpark size={32} className="mx-auto text-[var(--accent)]" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ship API docs that match your product quality
            </h2>
            <p className="mt-3 text-[var(--text-dim)]">
              Free forever. Open source. No credit card. Compete on product — not
              on documentation tooling bills.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/playground" className="btn-primary">
                Start free
              </Link>
              <Link href="/pricing" className="btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
