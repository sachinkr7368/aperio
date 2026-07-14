# Aperio

**The free open-source API platform** — interactive docs, lint, mock, and diff for OpenAPI.

Built as a serious alternative to paid API documentation products. No seats. No signup wall. MIT licensed.

**Live:** [https://aperio-nine.vercel.app](https://aperio-nine.vercel.app)

## Product suite

| Product | Path | Description |
|---------|------|-------------|
| **Reference** | `/demo`, `/playground` | Interactive OpenAPI docs + try-it-out client |
| **Linter** | `/lint` | Quality score (A–F) and rule findings |
| **Mock** | `/mock` | Example responses from your spec |
| **Diff** | `/compare` | Compare two OpenAPI versions |
| **Catalog / Embed** | `/catalog`, `/embed` | Samples + iframe embed for public specs |
| **Pricing** | `/pricing` | Free forever Community tier |

## Features

- OpenAPI 3.x / Swagger JSON & YAML, `$ref` resolution
- Three-pane reference, ⌘K search, models, security schemes
- Request client: auth, headers, env `{{vars}}`, history, 10 languages
- Linter API `POST /api/lint`
- Mock API `POST /api/mock`
- Spec fetch proxy `GET /api/fetch-spec?url=`
- Dark / light themes, export JSON/YAML
- Self-host on Vercel or Node

## Quickstart

```bash
git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
```

```bash
npm run build && npm start
# or
npx vercel
```

## License

[MIT](./LICENSE)
