"use client";

import { renderMarkdown } from "@/lib/markdown";

export function Markdown({
  content,
  className,
}: {
  content?: string;
  className?: string;
}) {
  if (!content) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
