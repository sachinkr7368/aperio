"use client";

import { useEffect, useState } from "react";
import { parseOpenAPI } from "@/lib/openapi/parse";
import type { OpenAPIDocument } from "@/lib/openapi/types";
import { ApiReference } from "@/components/api-reference/ApiReference";

/**
 * Embed mode: load spec from ?url= or ?sample=petstore
 * Clean chrome for iframes.
 */
export function EmbedClient() {
  const [doc, setDoc] = useState<OpenAPIDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const sample = params.get("sample");
        const url = params.get("url");
        let text: string;
        if (url) {
          const res = await fetch(
            `/api/fetch-spec?url=${encodeURIComponent(url)}`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Fetch failed");
          text = data.content;
        } else {
          const res = await fetch(
            sample === "petstore" || !sample
              ? "/samples/petstore.json"
              : `/samples/${sample}.json`
          );
          text = await res.text();
        }
        setDoc(parseOpenAPI(text));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[var(--text-dim)]">
        Loading reference…
      </div>
    );
  }
  if (error || !doc) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-sm text-red-400">{error || "No document"}</p>
        <p className="text-xs text-[var(--text-dim)]">
          Use ?url=https://…/openapi.json or ?sample=petstore
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ApiReference doc={doc} />
    </div>
  );
}
