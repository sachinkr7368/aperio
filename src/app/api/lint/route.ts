import { NextRequest, NextResponse } from "next/server";
import { tryParseAndLint } from "@/lib/openapi/lint";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw =
      typeof body.openapi === "string"
        ? body.openapi
        : body.openapi
          ? JSON.stringify(body.openapi)
          : "";
    if (!raw.trim()) {
      return NextResponse.json(
        { error: "Provide openapi string or object" },
        { status: 400 }
      );
    }
    const result = tryParseAndLint(raw);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      title: result.title,
      report: result.report,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Lint failed" },
      { status: 400 }
    );
  }
}
