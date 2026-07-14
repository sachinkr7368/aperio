# Aperio

**Free open-source OpenAPI docs engine** — interactive reference, lint, mock, and diff.

Not a paid seat-based portal. You own the OpenAPI file; publish via **playground**, **embed**, or **self-host**.

**Live:** [https://aperio-nine.vercel.app](https://aperio-nine.vercel.app)

## Product (final scope)

| Product | Path | Purpose |
|---------|------|---------|
| Playground | `/playground` | Import OpenAPI → interactive docs |
| Reference demo | `/demo` | Full Petstore experience |
| Linter | `/lint` | Quality score A–F |
| Mock | `/mock` | Example responses from the spec |
| Diff | `/compare` | Compare two OpenAPI versions |
| Catalog / embed | `/catalog`, `/embed` | Samples + iframe embed |
| **How to publish** | `/publish` | Embed or self-host your docs |
| Pricing | `/pricing` | Free forever |
| Docs | `/docs` | Platform guide |

## How teams publish docs

1. **Playground** — paste/upload/URL for instant docs  
2. **Embed** — host `openapi.json`, iframe Aperio  
3. **Self-host** — clone repo, deploy on Vercel/Node, brand it  

No signup for readers or authors on the free cloud tools.

## Quickstart

```bash
git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
```

```bash
npm run build && npm start
# or: npx vercel
```

## License

[MIT](./LICENSE)
