import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LintClient } from "@/components/tools/LintClient";

export const metadata: Metadata = {
  title: "OpenAPI Linter",
  description:
    "Free OpenAPI quality score — catch missing operationIds, servers, responses, and path parameter issues before you publish docs.",
};

export default function LintPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Quality
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            OpenAPI Linter
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Score your spec like a production API platform. Catch errors that
            break codegen, docs navigation, and consumer trust — free, no
            signup.
          </p>
          <div className="mt-8">
            <LintClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
