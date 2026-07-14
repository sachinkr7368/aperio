import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  Code2,
  FileJson,
  Globe,
  Unlock,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileJson,
    title: "OpenAPI & Swagger first",
    description:
      "Paste JSON or YAML, upload a file, or load from a URL. Aperio parses OpenAPI 3.x and Swagger 2.0 client-side.",
  },
  {
    icon: Play,
    title: "Try it out",
    description:
      "Send live requests from the browser. Edit parameters, bodies, and auth (Bearer, API key, Basic).",
  },
  {
    icon: Code2,
    title: "Code samples",
    description:
      "Copy ready snippets in cURL, JavaScript, Python, Go, and PHP from your current request setup.",
  },
  {
    icon: Sparkles,
    title: "Modern reference UI",
    description:
      "Three-pane layout: endpoints & models, documentation, and a sticky request client — like a pro API console.",
  },
  {
    icon: Unlock,
    title: "Auth-free forever",
    description:
      "No accounts, no paywalls. Anyone can open Aperio and document or explore an API immediately.",
  },
  {
    icon: Globe,
    title: "Self-host or use online",
    description:
      "Deploy on Vercel in minutes or run locally. MIT licensed — fork it and brand it your way.",
  },
];

const steps = [
  {
    n: "01",
    title: "Bring your OpenAPI",
    body: "Export from your framework or write a spec. Aperio speaks the standard you already use.",
  },
  {
    n: "02",
    title: "Drop it in the playground",
    body: "Paste, upload, or fetch a URL. Instant sidebar of endpoints and models.",
  },
  {
    n: "03",
    title: "Share beautiful docs",
    body: "Interactive reference with try-it-out and code samples. Free for your whole team.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="overflow-hidden border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                <Zap className="h-3.5 w-3.5 text-[#2563eb]" />
                Free · Open source · No signup
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
                API docs that developers{" "}
                <span className="text-[#60a5fa]">actually use</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                Aperio turns OpenAPI and Swagger into interactive documentation —
                try requests, browse schemas, and copy code samples. Completely
                free for everyone.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  <Play className="h-4 w-4" />
                  Open playground
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-[#2563eb]/40 hover:bg-[#2563eb]/10"
                >
                  View live demo
                </Link>
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-dim)] transition hover:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            {/* Preview card */}
            <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
                <span className="ml-3 font-mono text-xs text-[var(--text-dim)]">
                  aperio · API reference
                </span>
              </div>
              <div className="grid sm:grid-cols-[200px_1fr]">
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
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-[#22c55e]/25 bg-[#22c55e]/10 px-2 py-0.5 text-[11px] font-bold text-[#22c55e]">
                      GET
                    </span>
                    <code className="font-mono text-sm text-zinc-200">/pets</code>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">
                    List all pets
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-dim)]">
                    Returns a paginated list of pets in the store.
                  </p>
                  <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">
                    <span className="text-[var(--text-dim)]">$</span> curl -X GET
                    &apos;https://api.example.com/v1/pets?limit=20&apos;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Everything you need for API docs
              </h2>
              <p className="mt-3 text-sm text-[var(--text-dim)] sm:text-base">
                Polished references without enterprise lock-in.
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition hover:border-[#2563eb]/40"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-[#2563eb]/12 p-2.5 text-[#60a5fa]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
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
            <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Up and running in minutes
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6"
                >
                  <span className="font-mono text-sm font-semibold text-[#60a5fa]">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">
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

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <BookOpen className="mx-auto h-8 w-8 text-[#2563eb]" />
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
              Ready to document your API?
            </h2>
            <p className="mt-3 text-[var(--text-dim)]">
              No credit card. No waitlist. Open the playground and load a spec.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                Start for free
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
              >
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
