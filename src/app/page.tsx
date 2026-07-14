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
      "Paste JSON or YAML, upload a file, or load from a URL. Aperio parses OpenAPI 3.x and Swagger 2.0 specs client-side.",
  },
  {
    icon: Play,
    title: "Try it out",
    description:
      "Send live requests from the browser, edit parameters and bodies, and inspect status codes and response payloads.",
  },
  {
    icon: Code2,
    title: "Code samples",
    description:
      "Copy ready-to-run snippets in cURL, JavaScript, Python, Go, and PHP — generated from your actual request setup.",
  },
  {
    icon: Sparkles,
    title: "Modern UI",
    description:
      "Dark, developer-friendly reference layout with search, tag groups, schema trees, and method badges that don’t feel dated.",
  },
  {
    icon: Unlock,
    title: "Auth-free forever",
    description:
      "No accounts, no paywalls, no tracking gates. Anyone can open Aperio and document or explore an API immediately.",
  },
  {
    icon: Globe,
    title: "Self-host or use online",
    description:
      "Deploy on Vercel in minutes or run locally. MIT licensed — fork it, brand it, embed it in your stack.",
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
    body: "Paste, upload, or fetch a URL. Instant sidebar of endpoints grouped by tags.",
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
        {/* Hero */}
        <section className="grid-glow relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <Zap className="h-3.5 w-3.5" />
                Free · Open source · No signup
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl sm:leading-[1.08]">
                API docs that feel{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  alive
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Aperio turns OpenAPI and Swagger into interactive documentation —
                try requests, browse schemas, and copy code samples. Completely
                free for everyone.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
                >
                  <Play className="h-4 w-4" />
                  Open playground
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                >
                  View live demo
                </Link>
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>

            {/* Preview card */}
            <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e18]/80 shadow-2xl shadow-violet-500/10 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 font-mono text-xs text-zinc-500">
                  aperio · API reference
                </span>
              </div>
              <div className="grid sm:grid-cols-[220px_1fr]">
                <div className="hidden border-r border-white/5 p-4 sm:block">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                    pets
                  </div>
                  {[
                    ["GET", "/pets"],
                    ["POST", "/pets"],
                    ["GET", "/pets/{id}"],
                    ["DELETE", "/pets/{id}"],
                  ].map(([m, p]) => (
                    <div
                      key={p + m}
                      className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-400"
                    >
                      <span
                        className={
                          m === "GET"
                            ? "text-emerald-400"
                            : m === "POST"
                              ? "text-sky-400"
                              : "text-rose-400"
                        }
                      >
                        {m}
                      </span>
                      <span className="font-mono">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                      GET
                    </span>
                    <code className="font-mono text-sm text-zinc-200">/pets</code>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">
                    List all pets
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Returns a paginated list of pets in the store.
                  </p>
                  <div className="mt-4 rounded-lg border border-white/10 bg-[#07080f] p-3 font-mono text-[11px] leading-relaxed text-zinc-400">
                    <span className="text-zinc-600">$</span> curl -X GET
                    &apos;https://api.example.com/v1/pets?limit=20&apos;
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-zinc-500">
                      cURL
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-zinc-500">
                      JavaScript
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-zinc-500">
                      Python
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Everything you need for API docs
              </h2>
              <p className="mt-3 text-sm text-zinc-500 sm:text-base">
                Built for developers who want polished references without
                enterprise lock-in.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-500/20 hover:bg-white/[0.04]"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 p-2.5 text-cyan-300">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-white/5 bg-[#05060c] py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Up and running in minutes
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-2xl border border-white/10 p-6"
                >
                  <span className="font-mono text-sm font-semibold text-cyan-400">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <BookOpen className="mx-auto h-8 w-8 text-violet-400" />
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
              Ready to document your API?
            </h2>
            <p className="mt-3 text-zinc-500">
              No credit card. No waitlist. Open the playground and load a
              spec.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                Start for free
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
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
