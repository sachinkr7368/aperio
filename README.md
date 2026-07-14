# Aperio

**Free, open-source API documentation from OpenAPI & Swagger.**

Aperio turns your OpenAPI documents into beautiful interactive API references — with try-it-out requests, multi-language code samples, schema browsers, and search. No accounts. No paywalls. MIT licensed.

![Aperio](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Features

- **OpenAPI / Swagger** — JSON & YAML, `$ref` resolution, tags, parameters, bodies, responses
- **Interactive reference** — sidebar navigation, method badges, operation search
- **Try it out** — live HTTP requests with params, body editor, bearer auth
- **Code samples** — cURL, JavaScript, Python, Go, PHP
- **Playground** — paste, upload, or fetch a public spec URL
- **Auth-free** — anyone can use it immediately
- **Self-host ready** — deploy to Vercel or run with Node

## Quickstart

```bash
git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

### Deploy on Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy — no environment variables required

Or use the Vercel CLI:

```bash
npx vercel
```

## Usage

1. Go to **Playground**
2. Paste OpenAPI JSON/YAML, upload a file, or load a URL
3. Explore endpoints, send test requests, copy code samples

Try the built-in demo: `/demo` (Petstore sample).

## Project structure

```
src/
  app/                 # Next.js App Router pages
    page.tsx           # Marketing homepage
    playground/        # Spec loader + docs renderer
    demo/              # Live Petstore demo
    docs/              # Product documentation
    api/fetch-spec/    # Public OpenAPI URL proxy
  components/
    api-reference/     # Interactive docs UI
  lib/openapi/         # Parser, codegen, types
public/samples/        # Sample OpenAPI documents
```

## Tech stack

- [Next.js](https://nextjs.org) (App Router)
- React 19 + TypeScript
- Tailwind CSS
- `js-yaml` for YAML OpenAPI documents

## License

[MIT](./LICENSE)

---

Built for developers who want clear API docs without lock-in.
