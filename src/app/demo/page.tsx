import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { Header } from "@/components/Header";
import { DemoClient } from "@/components/DemoClient";
import { parseOpenAPI } from "@/lib/openapi/parse";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "Explore the Aperio Petstore demo — interactive OpenAPI reference with try-it-out and code samples.",
};

export default async function DemoPage() {
  const filePath = path.join(process.cwd(), "public/samples/petstore.json");
  const raw = await readFile(filePath, "utf8");
  const doc = parseOpenAPI(raw);

  return (
    <>
      <Header />
      <DemoClient doc={doc} />
    </>
  );
}
