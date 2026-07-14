import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IconCheck, IconSpark } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Aperio is free and open source. Full API docs platform with no seat limits and no signup wall.",
};

const free = [
  "Interactive OpenAPI / Swagger reference",
  "Try-it-out request client",
  "10-language code samples",
  "OpenAPI linter & quality score",
  "Mock responses from your spec",
  "Spec diff / compare",
  "Embeddable reference iframe",
  "Environments & request history",
  "Dark / light themes",
  "Self-host (MIT) or use free cloud",
  "No seat limits · no signup",
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Pricing
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Free forever. Open source.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-muted)]">
              Aperio is a free docs engine: playground, reference, lint, mock,
              diff, and embed. Self-host or embed on your domain — no seat tax.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md surface p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold">Community</h2>
              <p className="text-3xl font-bold tracking-tight">
                $0
                <span className="text-sm font-normal text-[var(--text-dim)]">
                  /forever
                </span>
              </p>
            </div>
            <p className="mt-2 text-sm text-[var(--text-dim)]">
              Everything you need to document and explore APIs.
            </p>
            <ul className="mt-6 space-y-2.5">
              {free.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-[var(--text-muted)]"
                >
                  <IconCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-[#22c55e]"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/playground" className="btn-primary mt-8 w-full">
              <IconSpark size={16} />
              Start building docs
            </Link>
          </div>

          <p className="mt-10 text-center text-xs text-[var(--text-dim)]">
            Self-host:{" "}
            <code className="rounded bg-[var(--bg-panel)] px-1.5 py-0.5">
              git clone https://github.com/sachinkr7368/aperio.git
            </code>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
