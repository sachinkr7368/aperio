import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MockClient } from "@/components/tools/MockClient";

export const metadata: Metadata = {
  title: "OpenAPI Mock Server",
  description:
    "Free mock responses from your OpenAPI document. Instant examples without spinning up a backend.",
};

export default function MockPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Mock
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Mock from OpenAPI
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Generate realistic responses from examples and schemas. Perfect for
            frontend work while the API is still in progress.
          </p>
          <div className="mt-8">
            <MockClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
