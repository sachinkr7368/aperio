import { NextRequest, NextResponse } from "next/server";
import { parseOpenAPI } from "@/lib/openapi/parse";
import { matchMockOperation } from "@/lib/openapi/mock";

export const runtime = "nodejs";

/**
 * POST /api/mock
 * body: { openapi: string|object, method: string, path: string }
 * Returns mock response from the OpenAPI examples/schemas.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const method = String(body.method || "GET").toUpperCase();
    const path = String(body.path || "/");
    let raw: string;
    if (typeof body.openapi === "string") raw = body.openapi;
    else if (body.openapi && typeof body.openapi === "object")
      raw = JSON.stringify(body.openapi);
    else {
      return NextResponse.json(
        { error: "Provide openapi (string or object)" },
        { status: 400 }
      );
    }

    const doc = parseOpenAPI(raw);
    const match = matchMockOperation(doc, method, path);
    if (!match) {
      return NextResponse.json(
        {
          error: "No matching operation",
          method,
          path,
          hint: "Path must match an OpenAPI path template (e.g. /pets/1 for /pets/{petId}).",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        mock: true,
        status: match.status,
        operationId: match.operationId,
        matchedPath: match.path,
        method: match.method,
        contentType: match.contentType,
        body: match.body,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Mock failed" },
      { status: 400 }
    );
  }
}
