# Aperio

**Beautiful free API documentation from OpenAPI & Swagger.**

Aperio is an open-source API documentation platform: interactive references, a full request client, multi-language code samples, models, environments, and more — with **no signup required**.

**Live:** [https://aperio-nine.vercel.app](https://aperio-nine.vercel.app)

![license](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black)

## Features

- **OpenAPI / Swagger** — JSON & YAML, `$ref` resolution, tags, parameters, bodies, responses, security
- **Interactive console** — auth (Bearer / API key / Basic), custom headers, cookies, content types, 30s timeout
- **Command palette** — `⌘K` search, method filters, expand/collapse tags, deep links (`#operationId`)
- **Focused & classic layouts** — single-operation client or continuous scroll
- **Models & auth map** — component schemas with examples, security schemes
- **10 languages** — cURL, JS, Python, Go, PHP, Ruby, Java, C#, Swift, Rust
- **Environments** — `{{VAR}}` substitution + request history (browser-only)
- **Export** — download OpenAPI as JSON or YAML
- **Themes** — dark / light
- **Auth-free product** — no accounts to use Aperio

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

```bash
npx vercel
```

No environment variables required.

## License

[MIT](./LICENSE)
