# Aperio

**Free open-source OpenAPI docs engine** — interactive reference, lint, mock, and diff.

Not a paid seat-based portal. You own the OpenAPI file; publish via **playground**, **embed**, or **self-host**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

**Live demo:** [https://aperio-nine.vercel.app](https://aperio-nine.vercel.app)

## Why Aperio?

| Write yourself | Generate from OpenAPI |
|----------------|------------------------|
| Getting started guides, tutorials | Endpoint reference, params, schemas |
| Product explainers | Try-it-out + code samples |

Aperio focuses on the **reference** side: drop in OpenAPI/Swagger → interactive docs and tooling. Free, no account required.

## Features

- Interactive API reference (tags, models, security schemes)
- Try-it-out client (Bearer / API key / Basic, env `{{vars}}`, history)
- Code samples in 10 languages
- OpenAPI linter with score (A–F)
- Mock responses from examples/schemas
- Spec diff between two versions
- Embeddable iframe (`/embed?url=…`)
- Dark / light theme
- Self-host friendly (Vercel / Node)

## Quickstart

```bash
git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
# or: npx vercel
```

No environment variables required for the default free setup.

## Product map

| Path | Purpose |
|------|---------|
| `/playground` | Import OpenAPI → interactive docs |
| `/demo` | Petstore live reference |
| `/lint` | Quality score & findings |
| `/mock` | Mock responses from a spec |
| `/compare` | Diff two OpenAPI documents |
| `/catalog` | Samples + embed snippet |
| `/publish` | How to publish (embed / self-host) |
| `/embed` | Chrome-less reference for iframes |
| `/docs` | Platform documentation |
| `/pricing` | Free forever |

## How to publish your API docs

1. Export OpenAPI from your API (or write `openapi.yaml`)
2. Preview in the [playground](https://aperio-nine.vercel.app/playground)
3. Optionally [lint](https://aperio-nine.vercel.app/lint) it
4. **Embed** on your site or **self-host** this app  

Guide: [https://aperio-nine.vercel.app/publish](https://aperio-nine.vercel.app/publish)

```html
<iframe
  src="https://aperio-nine.vercel.app/embed?url=https://YOUR_API.com/openapi.json"
  style="width:100%;height:80vh;border:0;border-radius:12px"
  title="API Reference"
></iframe>
```

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- `js-yaml` for YAML OpenAPI

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). PRs welcome.

## Security

See [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE) — free to use, fork, and commercialize with attribution in the license sense (keep the MIT notice).
