import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PlaygroundClient } from "@/components/PlaygroundClient";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Load any OpenAPI or Swagger document and generate free interactive API docs with Aperio.",
};

export default function PlaygroundPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PlaygroundClient />
      </main>
    </>
  );
}
