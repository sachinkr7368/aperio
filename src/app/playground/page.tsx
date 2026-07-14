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
    <div className="flex min-h-screen flex-col">
      <Header fullWidth />
      <main className="flex min-h-0 flex-1 flex-col">
        <PlaygroundClient />
      </main>
    </div>
  );
}
