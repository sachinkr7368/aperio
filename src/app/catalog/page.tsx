import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IconPlay, IconSpark } from "@/components/icons";

export const metadata: Metadata = {
  title: "API Catalog",
  description:
    "Browse sample OpenAPI documents and open them in Aperio playground, reference, lint, or mock.",
};

const samples = [
  {
    id: "petstore",
    title: "Petstore Demo",
    description:
      "Classic multi-tag API with pets, store, and users — great for exploring the full reference UI.",
    version: "1.2.0",
    tags: ["REST", "CRUD", "Auth"],
  },
];

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Registry
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            API catalog
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Start from curated samples or bring your own OpenAPI in the
            playground. Host any public spec via embed URL.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {samples.map((s) => (
              <article
                key={s.id}
                className="surface flex flex-col p-5"
              >
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 text-xs text-[var(--text-dim)]">
                  v{s.version}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
                  {s.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-dim)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/demo" className="btn-primary text-xs">
                    <IconPlay size={14} />
                    Open reference
                  </Link>
                  <Link
                    href={`/embed?sample=${s.id}`}
                    className="btn-secondary text-xs"
                    target="_blank"
                  >
                    Embed
                  </Link>
                  <Link
                    href="/playground"
                    className="btn-secondary text-xs"
                  >
                    Playground
                  </Link>
                </div>
              </article>
            ))}

            <article className="flex flex-col rounded-xl border border-dashed border-[var(--border)] p-5">
              <h2 className="text-lg font-semibold">Your API</h2>
              <p className="mt-3 flex-1 text-sm text-[var(--text-muted)]">
                Paste, upload, or fetch any OpenAPI 3.x / Swagger document —
                lint, mock, compare, and publish interactive docs instantly.
              </p>
              <Link href="/playground" className="btn-primary mt-5 w-fit text-xs">
                <IconSpark size={14} />
                Import OpenAPI
              </Link>
            </article>
          </div>

          <div className="surface mt-10 p-5">
            <h3 className="font-semibold">Embed any public spec</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Drop this iframe into your product docs (no Aperio account):
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-3 font-mono text-[11px] text-[var(--text-muted)]">{`<iframe
  src="https://aperio-nine.vercel.app/embed?url=https://YOUR_OPENAPI.json"
  style="width:100%;height:80vh;border:0;border-radius:12px"
  title="API Reference"
/>`}</pre>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
