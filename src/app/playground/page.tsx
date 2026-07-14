import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PlaygroundClient } from "@/components/PlaygroundClient";

export const metadata: Metadata = {
  title: "OpenAPI Playground — Free Interactive API Docs",
  description:
    "Free OpenAPI playground: paste or upload Swagger/OpenAPI and get interactive API documentation. No signup. Open source.",
  alternates: { canonical: "/playground" },
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
