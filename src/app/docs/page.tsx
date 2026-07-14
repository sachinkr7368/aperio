import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Aperio platform docs — reference, playground, linter, mock, diff, embed, and self-hosting.",
};

const toc = [
  { id: "platform", label: "Platform overview" },
  { id: "reference", label: "API Reference" },
  { id: "playground", label: "Playground" },
  { id: "lint", label: "Linter" },
  { id: "mock", label: "Mock" },
  { id: "diff", label: "Diff" },
  { id: "embed", label: "Embed" },
  { id: "self-host", label: "Self-hosting" },
  { id: "faq", label: "FAQ" },
];

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                On this page
              </p>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-[var(--text-dim)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <Link href="/playground" className="btn-primary mt-6 w-full text-center text-sm">
                Open playground
              </Link>
            </div>
          </aside>

          <article className="prose-docs min-w-0 max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Documentation
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Aperio platform
            </h1>
            <p className="text-base text-[var(--text-muted)]">
              Aperio is a free, open-source API platform: interactive
              documentation, linting, mocks, and version diffs for OpenAPI and
              Swagger — designed as a modern alternative to paid docs products.
            </p>

            <h2 id="platform">Platform overview</h2>
            <p>
              Aperio is intentionally a free engine (not a paid multi-tenant
              portal). You own the OpenAPI file; use playground, embed, or
              self-host to publish. See{" "}
              <Link href="/publish">How to publish</Link>.
            </p>
            <ul>
              <li>
                <Link href="/playground">Playground</Link> — import OpenAPI
              </li>
              <li>
                <Link href="/demo">API Reference</Link> — interactive docs +
                client
              </li>
              <li>
                <Link href="/lint">Linter</Link> — quality score & issues
              </li>
              <li>
                <Link href="/mock">Mock</Link> — responses from examples/schemas
              </li>
              <li>
                <Link href="/compare">Diff</Link> — compare two specs
              </li>
              <li>
                <Link href="/catalog">Catalog</Link> — samples & embed snippets
              </li>
              <li>
                <Link href="/publish">Publish</Link> — embed or self-host guide
              </li>
            </ul>

            <h2 id="reference">API Reference</h2>
            <p>
              Renders OpenAPI 3.x / Swagger into a three-pane experience:
              navigation (endpoints, models, security), documentation, and a
              sticky request client.
            </p>
            <ul>
              <li>⌘K command palette & method filters</li>
              <li>Focused or classic scroll layouts</li>
              <li>Try-it-out with Bearer / API key / Basic</li>
              <li>Custom headers, env vars <code>{"{{KEY}}"}</code>, history</li>
              <li>10 code languages + export JSON/YAML</li>
              <li>Deep links via <code>#operationId</code></li>
            </ul>

            <h2 id="playground">Playground</h2>
            <p>
              Paste JSON/YAML, upload a file, fetch a public URL (via proxy), or
              edit live. Recent specs stay in your browser only.
            </p>

            <h2 id="lint">Linter</h2>
            <p>
              Scores specs 0–100 (grade A–F). Rules cover servers, operationIds,
              summaries, tags, responses, path parameters, security schemes, and
              schema hygiene.
            </p>
            <pre>
              <code>{`POST /api/lint
{ "openapi": "<json or yaml string>" }`}</code>
            </pre>

            <h2 id="mock">Mock</h2>
            <p>
              Matches method + path against your document and returns example
              bodies from OpenAPI media types / schemas.
            </p>
            <pre>
              <code>{`POST /api/mock
{
  "openapi": { ... },
  "method": "GET",
  "path": "/pets/1"
}`}</code>
            </pre>

            <h2 id="diff">Diff</h2>
            <p>
              Load a baseline and an updated document. Aperio reports added,
              removed, and changed operations, schemas, and servers.
            </p>

            <h2 id="embed">Embed</h2>
            <p>Chrome-less reference for product docs:</p>
            <pre>
              <code>{`<iframe
  src="https://aperio-nine.vercel.app/embed?url=https://YOUR/openapi.json"
  style="width:100%;height:80vh;border:0"
/>`}</code>
            </pre>
            <p>
              Or <code>?sample=petstore</code> for the built-in demo.
            </p>

            <h2 id="self-host">Self-hosting</h2>
            <pre>
              <code>{`git clone https://github.com/sachinkr7368/aperio.git
cd aperio && npm install
npm run dev     # local
npm run build && npm start
# or: npx vercel`}</code>
            </pre>
            <p>No environment variables required for the free default setup.</p>

            <h2 id="faq">FAQ</h2>
            <h3>Is Aperio free?</h3>
            <p>
              Yes. MIT licensed, no signup wall, full feature set on the
              Community tier.
            </p>
            <h3>Do you store my specs?</h3>
            <p>
              Paste/upload stay in the browser. URL fetch and mock/lint APIs
              process requests ephemerally — no account database.
            </p>
            <h3>How is this different from a docs-only UI?</h3>
            <p>
              Aperio pairs the reference with lint, mock, and diff so you can
              improve and ship APIs — not only render them.
            </p>

            <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
              <h3 className="!mt-0 text-lg text-[var(--text)]">Next steps</h3>
              <p className="!mb-0">
                <Link href="/playground">Import a spec</Link>,{" "}
                <Link href="/lint">lint it</Link>, then{" "}
                <Link href="/demo">explore the reference demo</Link>.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
