# Contributing to Aperio

Thanks for helping improve Aperio.

## Ground rules

- Keep the product **free to use without signup** for playground, lint, mock, diff, embed, and self-host.
- Do **not** reintroduce third-party branding (other docs vendors) in UI copy or assets.
- Prefer small, focused PRs.

## Dev setup

```bash
git clone https://github.com/sachinkr7368/aperio.git
cd aperio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # must pass before PR
npm run lint
```

## Project map

- `src/app` — routes (playground, lint, mock, compare, embed, docs, …)
- `src/components/api-reference` — interactive OpenAPI reference UI
- `src/lib/openapi` — parse, lint, mock, diff, codegen
- `public/samples` — example OpenAPI documents

## Pull requests

1. Fork and create a branch
2. Make your change
3. Ensure `npm run build` succeeds
4. Open a PR with a short description of **what** and **why**

## Ideas that fit well

- Better OpenAPI edge cases (webhooks, callbacks, links)
- More lint rules
- Accessibility polish
- Docs and examples
- Tests for `src/lib/openapi/*`

## Ideas that need discussion first

- Multi-tenant hosted accounts / billing
- Private project storage on the free cloud
- Heavy analytics or tracking

Open an issue before large architecture changes.
