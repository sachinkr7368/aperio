import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareClient } from "@/components/tools/CompareClient";

export const metadata: Metadata = {
  title: "OpenAPI Diff",
  description:
    "Compare two OpenAPI documents — see added, removed, and changed operations, schemas, and servers. Free and open source.",
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Diff
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Compare OpenAPI versions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Catch breaking changes before you ship. Diff operations, schemas,
            and servers between any two specs.
          </p>
          <div className="mt-8">
            <CompareClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
