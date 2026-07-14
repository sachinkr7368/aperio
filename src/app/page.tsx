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
} from "@/components/icons";

const features = [
  {
    icon: IconFileJson,
    title: "First-class OpenAPI",
    description:
      "JSON & YAML, $ref resolution, tags, parameters, bodies, responses, security schemes, and server variables.",
  },
  {
    icon: IconPlay,
    title: "Interactive console",
    description:
      "Send live requests with auth, custom headers, cookies, content types, timeouts, and full response inspection.",
  },
  {
    icon: IconCode,
    title: "10 client languages",
    description:
      "cURL, JavaScript, Python, Go, PHP, Ruby, Java, C#, Swift, and Rust — always in sync with your request.",
  },
  {
    icon: IconSearch,
    title: "Command palette",
    description:
      "Jump to any endpoint with ⌘K. Filter by method, expand tags, deep-link with URL hashes.",
  },
  {
    icon: IconLayers,
    title: "Models & auth map",
    description:
      "Browse schemas with examples, security schemes, focused or classic scroll layouts, export JSON/YAML.",
  },
  {
    icon: IconKey,
    title: "Environments",
    description:
      "Local {{ENV}} variables, request history, Bearer / API key / Basic for protected APIs you document.",
  },
  {
    icon: IconUnlock,
    title: "Zero gatekeeping",
    description:
      "No signup wall. No trial. MIT open source. Anyone can document and explore APIs for free.",
  },
  {
    icon: IconGlobe,
    title: "Deploy anywhere",
    description:
      "One-click Vercel, or self-host with Next.js. Your brand, your domain, your rules.",
  },
  {
    icon: IconTerminal,
    title: "Developer-first UX",
    description:
      "Dark & light themes, premium typography, keyboard shortcuts, and a reference UI that feels modern.",
  },
];

const steps = [
  {
    n: "01",
    title: "Import your OpenAPI",
    body: "Paste, upload, fetch a URL, or edit live in the playground. Works with OpenAPI 3.x and Swagger 2.0.",
  },
  {
    n: "02",
    title: "Explore & try",
    body: "Navigate tags, models, and security. Send requests, inspect responses, copy SDK snippets in 10 languages.",
  },
  {
    n: "03",
    title: "Ship & share",
    body: "Export specs, self-host Aperio, or keep using the free cloud site. No account required for readers.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="hero-grid overflow-hidden border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/80 px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)] shadow-sm backdrop-blur">
                <IconZap size={14} className="text-[var(--accent)]" />
                Free forever · Open source · No signup
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.03em] text-[var(--text)] sm:text-6xl sm:leading-[1.05]">
                Beautiful API docs
                <br />
                <span className="text-[var(--accent)]">from your OpenAPI</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                Aperio is a free, open-source API documentation platform.
                Interactive references, a full request client, multi-language
                SDKs, models, and environments — without the enterprise tax.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/playground" className="btn-primary">
                  <IconPlay size={16} />
                  Open playground
                </Link>
                <Link href="/demo" className="btn-secondary">
                  View live demo
                </Link>
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[var(--text-dim)] transition hover:text-[var(--text)]"
                >
                  <IconGithub size={16} />
                  Star on GitHub
                </a>
              </div>
            </div>

            {/* Product preview */}
            <div className="surface mx-auto mt-16 max-w-4xl overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
                <span className="ml-3 font-mono text-xs text-[var(--text-dim)]">
                  aperio.app · API reference
                </span>
                <span className="ml-auto hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-dim)] sm:inline">
                  ⌘K
                </span>
              </div>
              <div className="grid sm:grid-cols-[220px_1fr]">
                <div className="hidden border-r border-[var(--border)] p-3 sm:block">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    pets
                  </div>
                  {[
                    ["GET", "/pets", "text-[#22c55e]"],
                    ["POST", "/pets", "text-[#3b82f6]"],
                    ["GET", "/pets/{id}", "text-[#22c55e]"],
                    ["DELETE", "/pets/{id}", "text-[#ef4444]"],
                  ].map(([m, p, c]) => (
                    <div
                      key={p + m}
                      className="mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-[var(--text-muted)]"
                    >
                      <span className={`font-bold ${c}`}>{m}</span>
                      <span className="font-mono">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="border-b border-[var(--border)] p-5 sm:border-b-0 sm:border-r">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md border border-[#22c55e]/25 bg-[#22c55e]/10 px-2 py-0.5 text-[11px] font-bold text-[#22c55e]">
                        GET
                      </span>
                      <code className="font-mono text-sm">/pets</code>
                    </div>
                    <p className="mt-2 text-sm font-medium">List all pets</p>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">
                      Returns a paginated list of pets in the store.
                    </p>
                    <div className="mt-4 space-y-1.5 text-[11px] text-[var(--text-dim)]">
                      <div className="flex justify-between rounded-md border border-[var(--border)] px-2 py-1.5">
                        <span className="font-mono text-[#93c5fd]">limit</span>
                        <span>query · integer</span>
                      </div>
                      <div className="flex justify-between rounded-md border border-[var(--border)] px-2 py-1.5">
                        <span className="font-mono text-[#93c5fd]">status</span>
                        <span>query · enum</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-panel)] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                      Test request
                    </p>
                    <div className="mt-2 rounded-md border border-[var(--border)] bg-[var(--bg-input)] p-2 font-mono text-[10px] text-[var(--text-muted)]">
                      curl -X GET &apos;…/pets?limit=20&apos;
                    </div>
                    <div className="mt-3 flex gap-1">
                      {["cURL", "JS", "Python", "Go"].map((l) => (
                        <span
                          key={l}
                          className="rounded bg-[var(--bg-input)] px-2 py-0.5 text-[10px] text-[var(--text-dim)]"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 rounded-md bg-[var(--accent)] py-2 text-center text-xs font-semibold text-white">
                      Send
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Everything a modern API platform needs
              </h2>
              <p className="mt-3 text-sm text-[var(--text-dim)] sm:text-base">
                Designed for teams that want polished docs without lock-in.
              </p>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition hover:border-[var(--accent)]/35"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[var(--bg-elevated)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              From spec to docs in minutes
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6"
                >
                  <span className="font-mono text-sm font-semibold text-[var(--accent)]">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <IconBook size={32} className="mx-auto text-[var(--accent)]" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ship documentation your developers will love
            </h2>
            <p className="mt-3 text-[var(--text-dim)]">
              Free forever. Open source. No credit card. No waitlist.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/playground" className="btn-primary">
                <IconSpark size={16} />
                Start for free
              </Link>
              <Link href="/docs" className="btn-secondary">
                Read the docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
