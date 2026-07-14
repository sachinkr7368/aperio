import type { OpenAPIDocument, ResolvedOperation } from "./types";
import { getRequestBodyExample } from "./parse";

export type CodeLang =
  | "curl"
  | "javascript"
  | "python"
  | "go"
  | "php"
  | "ruby"
  | "java"
  | "csharp"
  | "swift"
  | "rust";

export const CODE_LANGS: { id: CodeLang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "swift", label: "Swift" },
  { id: "rust", label: "Rust" },
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
    path = path.replace(
      new RegExp(`\\{${p.name}\\}`, "g"),
      encodeURIComponent(val)
    );
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

function headersFromParams(
  paramValues: Record<string, string>
): Record<string, string> {
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
  const method = op.method.toUpperCase();
  const headers = headersFromParams(paramValues);
  if (
    body &&
    !headers["Content-Type"] &&
    ["POST", "PUT", "PATCH"].includes(method)
  ) {
    headers["Content-Type"] = "application/json";
  }
  if (authHeader) headers.Authorization = authHeader;

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
    case "ruby":
      return rubyCode(method, url, headers, body);
    case "java":
      return javaCode(method, url, headers, body);
    case "csharp":
      return csharpCode(method, url, headers, body);
    case "swift":
      return swiftCode(method, url, headers, body);
    case "rust":
      return rustCode(method, url, headers, body);
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
    .map((l, i) => (i === lines.length - 1 ? l : `${l} \\`))
    .join("\n");
}

function jsCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const opts: string[] = [`  method: '${method}'`];
  if (Object.keys(headers).length) {
    opts.push(
      `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")}`
    );
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

function rubyCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const h = Object.entries(headers)
    .map(([k, v]) => `  '${k}' => '${v}'`)
    .join(",\n");
  return `require 'net/http'
require 'json'
require 'uri'

uri = URI('${url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::${method === "GET" ? "Get" : method === "POST" ? "Post" : method === "PUT" ? "Put" : method === "DELETE" ? "Delete" : method === "PATCH" ? "Patch" : "Get"}.new(uri)
${h ? `headers = {\n${h}\n}\nheaders.each { |k, v| request[k] = v }` : ""}
${body ? `request.body = ${JSON.stringify(body)}` : ""}

response = http.request(request)
puts response.body`;
}

function javaCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const h = Object.entries(headers)
    .map(([k, v]) => `connection.setRequestProperty("${k}", "${v}");`)
    .join("\n");
  return `import java.net.HttpURLConnection;
import java.net.URL;
import java.io.*;

public class ApiRequest {
  public static void main(String[] args) throws Exception {
    URL url = new URL("${url}");
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setRequestMethod("${method}");
${h}
${
  body
    ? `    connection.setDoOutput(true);
    try (OutputStream os = connection.getOutputStream()) {
      byte[] input = ${JSON.stringify(body)}.getBytes("utf-8");
      os.write(input, 0, input.length);
    }`
    : ""
}
    try (BufferedReader br = new BufferedReader(
        new InputStreamReader(connection.getInputStream(), "utf-8"))) {
      StringBuilder response = new StringBuilder();
      String line;
      while ((line = br.readLine()) != null) response.append(line.trim());
      System.out.println(response);
    }
  }
}`;
}

function csharpCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const h = Object.entries(headers)
    .map(([k, v]) =>
      k.toLowerCase() === "content-type"
        ? `// Content-Type set via content`
        : `client.DefaultRequestHeaders.TryAddWithoutValidation("${k}", "${v}");`
    )
    .filter((l) => !l.startsWith("//"))
    .join("\n");
  return `using System.Net.Http;
using System.Text;

var client = new HttpClient();
${h}
${
  body
    ? `var content = new StringContent(${JSON.stringify(body)}, Encoding.UTF8, "application/json");
var response = await client.${method === "GET" ? "GetAsync" : method === "POST" ? "PostAsync" : method === "PUT" ? "PutAsync" : method === "DELETE" ? "DeleteAsync" : "SendAsync"}(
  ${method === "GET" || method === "DELETE" ? `"${url}"` : `"${url}", content`});`
    : `var response = await client.GetAsync("${url}");`
}
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);`;
}

function swiftCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const h = Object.entries(headers)
    .map(([k, v]) => `request.setValue("${v}", forHTTPHeaderField: "${k}")`)
    .join("\n");
  return `import Foundation

var request = URLRequest(url: URL(string: "${url}")!)
request.httpMethod = "${method}"
${h}
${body ? `request.httpBody = """\n${body}\n""".data(using: .utf8)` : ""}

let task = URLSession.shared.dataTask(with: request) { data, response, error in
  guard let data = data, error == nil else { return }
  print(String(data: data, encoding: .utf8) ?? "")
}
task.resume()`;
}

function rustCode(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string
): string {
  const h = Object.entries(headers)
    .map(([k, v]) => `.header("${k}", "${v}")`)
    .join("\n    ");
  return `// cargo add reqwest tokio --features reqwest/json,tokio/full
use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let response = client
        .request(reqwest::Method::${method}, "${url}")
        ${h}
        ${body ? `.body(r#"${body}"#)` : ""}
        .send()
        .await?;

    println!("{}", response.text().await?);
    Ok(())
}`;
}

export function defaultBody(op: ResolvedOperation, contentType?: string): string {
  return getRequestBodyExample(op.operation, contentType);
}
