import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  IconGlobe,
  IconPlay,
  IconSpark,
  IconTerminal,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "How to publish your API docs",
  description:
    "Publish interactive OpenAPI documentation with Aperio — embed on your site, self-host, or use the free playground. No signup required.",
};

const paths = [
  {
    n: "01",
    title: "Use the free playground",
    body: "Best for demos, reviews, and internal sharing. Paste or upload OpenAPI and get interactive docs instantly.",
    href: "/playground",
    cta: "Open playground",
    icon: IconPlay,
  },
  {
    n: "02",
    title: "Embed on your website",
    body: "Best for public product docs. Host your openapi.json on your domain, then iframe Aperio embed. Docs update when your spec updates.",
    href: "/catalog",
    cta: "See embed example",
    icon: IconGlobe,
  },
  {
    n: "03",
    title: "Self-host Aperio",
    body: "Best for full control and branding. Clone the MIT repo, deploy on Vercel or Node, put it on docs.yourcompany.com.",
    href: "/docs#self-host",
    cta: "Self-host guide",
    icon: IconTerminal,
  },
];

export default function PublishPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Publish
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            How to document your API with Aperio
          </h1>
          <p className="mt-3 text-[var(--text-muted)] leading-relaxed">
            Aperio is a free OpenAPI docs engine — not a paid seat-based portal.
            You keep the spec; we render interactive documentation. Pick the
            path that fits you.
          </p>

          <div className="mt-10 space-y-4">
            {paths.map((p) => (
              <div key={p.n} className="surface p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <p.icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-[var(--accent)]">
                      {p.n}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{p.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
                      {p.body}
                    </p>
                    <Link
                      href={p.href}
                      className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      {p.cta} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 surface p-6">
            <h2 className="text-lg font-semibold">Embed snippet</h2>
            <p className="mt-2 text-sm text-[var(--text-dim)]">
              Host your OpenAPI at a public URL, then add this to your docs
              site:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-4 font-mono text-[11px] leading-relaxed text-[var(--text-muted)]">{`<iframe
  src="https://aperio-nine.vercel.app/embed?url=https://YOUR_API.com/openapi.json"
  style="width:100%;height:80vh;border:0;border-radius:12px"
  title="API Reference"
></iframe>`}</pre>
          </div>

          <div className="mt-10 surface p-6">
            <h2 className="text-lg font-semibold">Before you publish</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--text-muted)]">
              <li>Export OpenAPI from your API framework (or write openapi.yaml)</li>
              <li>
                <Link href="/lint" className="text-[var(--accent)] hover:underline">
                  Lint
                </Link>{" "}
                the spec for missing servers, operationIds, responses
              </li>
              <li>
                Preview in the{" "}
                <Link href="/playground" className="text-[var(--accent)] hover:underline">
                  playground
                </Link>
              </li>
              <li>Embed or self-host for a permanent home</li>
            </ol>
          </div>

          <div className="mt-10 text-center">
            <Link href="/playground" className="btn-primary">
              <IconSpark size={16} />
              Start with your OpenAPI
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
