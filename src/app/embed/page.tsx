import type { Metadata } from "next";
import { EmbedClient } from "@/components/tools/EmbedClient";

export const metadata: Metadata = {
  title: "Embed API Reference",
  description: "Embeddable OpenAPI reference for your product docs.",
  robots: { index: false },
};

export default function EmbedPage() {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)]">
      <EmbedClient />
    </div>
  );
}
