"use client";

import type { OpenAPIDocument } from "@/lib/openapi/types";
import { ApiReference } from "@/components/api-reference/ApiReference";

export function DemoClient({ doc }: { doc: OpenAPIDocument }) {
  return <ApiReference doc={doc} />;
}
