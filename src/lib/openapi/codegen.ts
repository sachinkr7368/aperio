import type { HttpMethod, OpenAPIDocument, ResolvedOperation } from "./types";
import { getRequestBodyExample } from "./parse";

export type CodeLang = "curl" | "javascript" | "python" | "go" | "php";

export const CODE_LANGS: { id: CodeLang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
];

function baseUrl(doc: OpenAPIDocument, op: ResolvedOperation): string {
  const server =
    op.operation.servers?.[0]?.url ||
    doc.servers?.[0]?.url ||
    "https://api.example.com";
  return server.replace(/\/$/, "");
}

function buildUrl(
  doc: OpenAPIDocument,
  op: ResolvedOperation,
  paramValues: Record<string, string>
): string {
  let path = op.path;
  for (const p of op.parameters.filter((x) => x.in === "path")) {
    const val = paramValues[`path:${p.name}`] || `{${p.name}}`;
    path = path.replace(new RegExp(`\\{${p.name}\\}`, "g"), encodeURIComponent(val));
  }
  const query = op.parameters
    .filter((x) => x.in === "query")
    .map((p) => {
      const val = paramValues[`query:${p.name}`];
      if (!val) return null;
      return `${encodeURIComponent(p.name)}=${encodeURIComponent(val)}`;
    })
    .filter(Boolean);
  const qs = query.length ? `?${query.join("&")}` : "";
  return `${baseUrl(doc, op)}${path}${qs}`;
}

function headersFromParams(paramValues: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(paramValues)) {
    if (k.startsWith("header:") && v) {
      headers[k.slice(7)] = v;
    }
  }
  return headers;
}

export function generateCode(
  lang: CodeLang,
  doc: OpenAPIDocument,
  op: ResolvedOperation,
  paramValues: Record<string, string>,
  body: string,
  authHeader?: string
): string {
  const url = buildUrl(doc, op, paramValues);
  const method = op.method.toUpperCase() as Uppercase<HttpMethod>;
  const headers = headersFromParams(paramValues);
  if (body && !headers["Content-Type"] && ["POST", "PUT", "PATCH"].includes(method)) {
    headers["Content-Type"] = "application/json";
  }
  if (authHeader) headers["Authorization"] = authHeader;

  switch (lang) {
    case "curl":
      return curlCode(method, url, headers, body);
    case "javascript":
      return jsCode(method, url, headers, body);
    case "python":
      return pythonCode(method, url, headers, body);
    case "go":
      return goCode(method, url, headers, body);
    case "php":
      return phpCode(method, url, headers, body);
    default:
      return "";
  }
}

function curlCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const lines = [`curl -X ${method} '${url}'`];
  for (const [k, v] of Object.entries(headers)) {
    lines.push(`  -H '${k}: ${v.replace(/'/g, "'\\''")}'`);
  }
  if (body) {
    lines.push(`  -d '${body.replace(/'/g, "'\\''")}'`);
  }
  return lines
    .map((l, i) => (i === 0 ? l : (i === lines.length - 1 ? l : `${l} \\`)))
    .join(" \\\n");
}

function jsCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const opts: string[] = [`  method: '${method}'`];
  if (Object.keys(headers).length) {
    opts.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")}`);
  }
  if (body) {
    opts.push(`  body: JSON.stringify(${body})`);
  }
  return `const response = await fetch('${url}', {\n${opts.join(",\n")}\n});\n\nconst data = await response.json();\nconsole.log(data);`;
}

function pythonCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const parts = [
    "import requests",
    "",
    `url = "${url}"`,
    `headers = ${JSON.stringify(headers, null, 2)}`,
  ];
  if (body) {
    parts.push(`payload = ${body}`);
    parts.push(
      `response = requests.request("${method}", url, headers=headers, json=payload)`
    );
  } else {
    parts.push(`response = requests.request("${method}", url, headers=headers)`);
  }
  parts.push("print(response.json())");
  return parts.join("\n");
}

function goCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const headerLines = Object.entries(headers)
    .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
    .join("\n");
  const bodySetup = body
    ? `body := strings.NewReader(\`${body}\`)\n\treq, err := http.NewRequest("${method}", "${url}", body)`
    : `req, err := http.NewRequest("${method}", "${url}", nil)`;

  return `package main

import (
\t"fmt"
\t"io"
\t"net/http"
\t"strings"
)

func main() {
\t${bodySetup}
\tif err != nil {
\t\tpanic(err)
\t}
${headerLines}
\tresp, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()
\tdata, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(data))
}`;
}

function phpCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const headerArr = Object.entries(headers)
    .map(([k, v]) => `    "${k}: ${v}"`)
    .join(",\n");
  return `<?php
$ch = curl_init("${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
${headerArr || "    // headers"}
]);
${body ? `curl_setopt($ch, CURLOPT_POSTFIELDS, '${body.replace(/'/g, "\\'")}');` : ""}
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;
}

export function defaultBody(op: ResolvedOperation): string {
  return getRequestBodyExample(op.operation);
}
