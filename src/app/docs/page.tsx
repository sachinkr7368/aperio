import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Learn how to use Aperio to render free interactive API documentation from OpenAPI and Swagger.",
};

const toc = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "playground", label: "Playground" },
  { id: "openapi", label: "OpenAPI support" },
  { id: "try-it", label: "Try it out" },
  { id: "code-samples", label: "Code samples" },
  { id: "self-host", label: "Self-hosting" },
  { id: "proxy", label: "Spec fetch proxy" },
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
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                On this page
              </p>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/playground"
                className="mt-6 block rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Open playground
              </Link>
            </div>
          </aside>

          <article className="prose-docs min-w-0 max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Documentation
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Aperio docs
            </h1>
            <p className="text-base text-zinc-400">
              Aperio is a free, open-source platform for interactive API
              documentation. It reads OpenAPI and Swagger documents and renders
              a modern reference with search, schemas, try-it-out requests, and
              multi-language code samples — without requiring any account.
            </p>

            <h2 id="introduction">Introduction</h2>
            <p>
              Most teams already describe APIs with{" "}
              <strong className="font-medium text-zinc-300">OpenAPI</strong> (or
              older Swagger 2.0). Aperio turns that machine-readable contract into
              human-friendly docs you can share with developers immediately.
            </p>
            <ul>
              <li>No authentication or paid tiers to get started</li>
              <li>Works entirely in the browser for paste/upload flows</li>
              <li>Optional server proxy for loading remote specs</li>
              <li>MIT licensed — fork and customize freely</li>
            </ul>

            <h2 id="quickstart">Quickstart</h2>
            <p>The fastest path:</p>
            <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
              <li>
                Open the{" "}
                <Link href="/playground">playground</Link>
              </li>
              <li>Paste your OpenAPI JSON/YAML, upload a file, or fetch a URL</li>
              <li>Browse endpoints, try requests, copy code samples</li>
            </ol>
            <p>
              Prefer a ready-made example? Visit the{" "}
              <Link href="/demo">live Petstore demo</Link>.
            </p>

            <h2 id="playground">Playground</h2>
            <p>The playground supports three input modes:</p>
            <ul>
              <li>
                <strong className="text-zinc-300">Paste</strong> — drop full
                JSON or YAML into the editor and click Render docs
              </li>
              <li>
                <strong className="text-zinc-300">URL</strong> — fetch a public
                OpenAPI URL through Aperio&apos;s proxy
              </li>
              <li>
                <strong className="text-zinc-300">Upload</strong> — choose a
                local <code>.json</code>, <code>.yaml</code>, or{" "}
                <code>.yml</code> file
              </li>
            </ul>
            <p>
              Specs are parsed client-side. Nothing is stored on a server for
              paste/upload — your document stays in the browser session.
            </p>

            <h2 id="openapi">OpenAPI support</h2>
            <p>Aperio understands common OpenAPI structures:</p>
            <ul>
              <li>
                <code>info</code>, <code>servers</code>, <code>paths</code>,{" "}
                <code>tags</code>
              </li>
              <li>
                Operations: summary, description, parameters, requestBody,
                responses
              </li>
              <li>
                Components: schemas (including <code>$ref</code> resolution),
                security schemes
              </li>
              <li>JSON and YAML document formats</li>
            </ul>
            <p>
              For best results, use OpenAPI 3.0 or 3.1 with clear{" "}
              <code>operationId</code>s, tags, and examples on parameters and
              media types.
            </p>

            <h2 id="try-it">Try it out</h2>
            <p>
              On any operation, open the <strong className="text-zinc-300">Try it</strong>{" "}
              tab to:
            </p>
            <ul>
              <li>Pick a server URL from the document</li>
              <li>Fill path, query, and header parameters</li>
              <li>Edit JSON request bodies</li>
              <li>Attach an optional Bearer token</li>
              <li>Send the request and inspect status, timing, and body</li>
            </ul>
            <p>
              Browser CORS rules still apply. If a request fails due to CORS,
              use the generated code samples from your backend or a tool that
              is not limited by browser same-origin policy.
            </p>

            <h2 id="code-samples">Code samples</h2>
            <p>
              The <strong className="text-zinc-300">Code</strong> tab builds
              snippets from your current parameter and body values:
            </p>
            <ul>
              <li>cURL</li>
              <li>JavaScript (fetch)</li>
              <li>Python (requests)</li>
              <li>Go (net/http)</li>
              <li>PHP (cURL)</li>
            </ul>

            <h2 id="self-host">Self-hosting</h2>
            <p>Run Aperio locally or deploy your own instance:</p>
            <pre>
              <code>{`git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
# open http://localhost:3000`}</code>
            </pre>
            <p>
              Production build:
            </p>
            <pre>
              <code>{`npm run build
npm start`}</code>
            </pre>
            <p>
              Deploy to Vercel with one click from the GitHub repo, or connect
              the repository in the Vercel dashboard. No environment variables
              are required for the default free experience.
            </p>

            <h2 id="proxy">Spec fetch proxy</h2>
            <p>
              The playground can load remote specs via{" "}
              <code>GET /api/fetch-spec?url=...</code>. The proxy:
            </p>
            <ul>
              <li>Allows only <code>http</code> and <code>https</code></li>
              <li>Blocks localhost and common private IP ranges</li>
              <li>Caps response size at 2MB</li>
            </ul>
            <p>
              Use it for public OpenAPI URLs that would otherwise hit CORS
              errors when fetched from the browser.
            </p>

            <h2 id="faq">FAQ</h2>
            <h3>Is Aperio free?</h3>
            <p>
              Yes. Aperio is free to use and open source under the MIT license.
              There is no signup wall.
            </p>
            <h3>Do you store my OpenAPI files?</h3>
            <p>
              Paste and upload stay in your browser. URL fetch goes through the
              proxy only to retrieve the document for rendering — Aperio does
              not require accounts or persistent storage of your specs.
            </p>
            <h3>Can I white-label it?</h3>
            <p>
              Yes. Fork the repository, change branding under{" "}
              <code>src/components</code> and <code>src/app</code>, and deploy
              under your domain.
            </p>
            <h3>What about authentication for my API?</h3>
            <p>
              Aperio itself is auth-free. For calling protected APIs from Try
              it, paste a Bearer token on the operation panel. Your API&apos;s
              auth still applies on the wire.
            </p>

            <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
              <h3 className="!mt-0 text-lg text-white">Need help?</h3>
              <p className="!mb-0">
                Open an issue on{" "}
                <a
                  href="https://github.com/sachinkr7368/aperio"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>{" "}
                or jump into the{" "}
                <Link href="/playground">playground</Link> and try a sample
                spec.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
