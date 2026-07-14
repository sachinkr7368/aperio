# Security Policy

## Supported versions

The `main` branch of [sachinkr7368/aperio](https://github.com/sachinkr7368/aperio) is the supported line.

## Reporting a vulnerability

Please **do not** open a public issue for security-sensitive bugs.

Email the maintainer via the address on the GitHub profile, or open a **private** security advisory on GitHub:

https://github.com/sachinkr7368/aperio/security/advisories/new

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment if known

We will acknowledge and work on a fix as soon as practical.

## Scope notes

- `/api/fetch-spec` proxies public HTTP(S) OpenAPI URLs and blocks common private hosts; treat it as a public utility and do not send secrets in query params.
- Specs pasted in the browser stay client-side; do not paste production secrets into demos.
- Self-hosted deployments are the operator’s responsibility (TLS, network policy, rate limits).
