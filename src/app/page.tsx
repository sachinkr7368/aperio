import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  IconBook,
  IconCode,
  IconFileJson,
  IconGithub,
  IconGlobe,
  IconLayers,
  IconPlay,
  IconSpark,
  IconUnlock,
  IconZap,
} from "@/components/icons";

const features = [
  {
    icon: IconFileJson,
    title: "OpenAPI & Swagger first",
    description:
      "Paste JSON or YAML, upload a file, fetch a URL, or use the live editor. Client-side parsing with $ref resolution.",
  },
  {
    icon: IconPlay,
    title: "Full request client",
    description:
      "Send live requests with params, cookies, content types, server variables, and response headers + timing.",
  },
  {
    icon: IconCode,
    title: "10 code languages",
    description:
      "cURL, JavaScript, Python, Go, PHP, Ruby, Java, C#, Swift, and Rust — generated from your setup.",
  },
  {
    icon: IconLayers,
    title: "Models & security",
    description:
      "Browse component schemas, security schemes, tags, method filters, and export OpenAPI as JSON or YAML.",
  },
  {
    icon: IconUnlock,
    title: "Auth-free forever",
    description:
      "No accounts, no paywalls. Optional Bearer / API key / Basic only for calling protected APIs you document.",
  },
  {
    icon: IconGlobe,
    title: "Env vars & history",
    description:
      "Local {{ENV}} variables, request history, dark/light theme — all in your browser. Self-host on Vercel.",
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
    body: "Paste, upload, fetch a URL, or edit live. Instant sidebar of endpoints, models, and auth schemes.",
  },
  {
    n: "03",
    title: "Share beautiful docs",
    body: "Interactive reference with try-it-out, 10 languages of code samples, and zero signup friction.",
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
                <IconZap size={14} className="text-[#2563eb]" />
                Free · Open source · No signup
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.1]">
                API docs that developers{" "}
                <span className="text-[#2563eb]">actually use</span>
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
                  <IconPlay size={16} />
                  Open playground
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-5 py-2.5 text-sm font-semibold transition hover:border-[#2563eb]/40 hover:bg-[#2563eb]/10"
                >
                  View live demo
                </Link>
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-dim)] transition hover:text-[var(--text)]"
                >
                  <IconGithub size={16} />
                  GitHub
                </a>
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl shadow-black/20">
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
                    <code className="font-mono text-sm">/pets</code>
                  </div>
                  <p className="mt-2 text-sm font-medium">List all pets</p>
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
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
                  <div className="mb-3 inline-flex rounded-lg bg-[#2563eb]/12 p-2.5 text-[#2563eb]">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
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
              Up and running in minutes
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6"
                >
                  <span className="font-mono text-sm font-semibold text-[#2563eb]">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
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
            <IconBook size={32} className="mx-auto text-[#2563eb]" />
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              Ready to document your API?
            </h2>
            <p className="mt-3 text-[var(--text-dim)]">
              No credit card. No waitlist. Open the playground and load a spec.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                <IconSpark size={16} />
                Start for free
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/5"
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
