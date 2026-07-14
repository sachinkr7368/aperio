import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MAX_BYTES = 2_000_000;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json(
      { error: "Only http and https URLs are allowed" },
      { status: 400 }
    );
  }

  // Block obvious private/local targets
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.")
  ) {
    return NextResponse.json(
      { error: "Private or local URLs are not allowed" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        Accept: "application/json, application/yaml, text/yaml, text/plain, */*",
        "User-Agent": "Aperio-Docs/1.0",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Document exceeds 2MB limit" },
        { status: 413 }
      );
    }

    const content = new TextDecoder().decode(buf);
    return NextResponse.json({
      content,
      contentType,
      source: parsed.toString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Fetch failed: ${err.message}`
            : "Fetch failed",
      },
      { status: 502 }
    );
  }
}
